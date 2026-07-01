import { db, app } from "../database/firebase.js";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { customError } from "../errors/handleErrors.js";
import bcrypt from "bcrypt";

const productsCollectionRef = collection(db, "products");

async function getAllProductsModel() {
  try {
    const querySnapshot = await getDocs(productsCollectionRef);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    customError({
      msg: "Error al obtener la lista de productos de la base de datos.",
      code: "DB_FETCH_ALL_ERROR",
      status: 500,
    });
  }
}

async function getProductForIdModel({ id }) {
  try {
    if (!id) {
      customError({
        msg: "El ID del producto es requerido.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      customError({
        msg: `El producto con ID ${id} no existe.`,
        code: "PRODUCT_NOT_FOUND",
        status: 404,
      });
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    if (error.status) throw error;

    customError({
      msg: "Error interno al buscar el producto por ID.",
      code: "DB_FETCH_ID_ERROR",
      status: 500,
    });
  }
}

async function createNewProductModel({ name, price, stock }) {
  try {
    const newProduct = {
      name,
      price: Number(price),
      stock: Number(stock),
      createdAt: new Date(),
    };

    const docRef = await addDoc(productsCollectionRef, newProduct);

    return { id: docRef.id, ...newProduct };
  } catch (error) {
    customError({
      msg: "No se pudo registrar el nuevo producto en la base de datos.",
      code: "DB_CREATE_ERROR",
      status: 500,
    });
  }
}

async function deleteProducModel({ id }) {
  try {
    if (!id) {
      customError({
        msg: "El ID es necesario para eliminar un producto.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      customError({
        msg: "El producto que intentás eliminar no existe.",
        code: "PRODUCT_NOT_FOUND",
        status: 404,
      });
    }

    await deleteDoc(docRef);
    return { id, deleted: true };
  } catch (error) {
    if (error.status) throw error;

    customError({
      msg: "Error interno al intentar eliminar el producto.",
      code: "DB_DELETE_ERROR",
      status: 500,
    });
  }
}

async function loginModel({ username, password }) {
  try {
    const usersCollectionRef = collection(db, "users");

    const q = query(usersCollectionRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      customError({
        msg: "El nombre de usuario o la contraseña son incorrectos.",
        code: "AUTH_INVALID_CREDENTIALS",
        status: 401,
      });
    }

    let pass = typeof password === "number" ? password.toString() : password;

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    let comparePass = await bcrypt.compare(pass, userData.password);

    if (!comparePass) {
      customError({
        msg: "El nombre de usuario o la contraseña son incorrectos.",
        code: "AUTH_INVALID_CREDENTIALS",
        status: 401,
      });
    }

    return {
      id: userDoc.id,
      username: userData.username,
      email: userData.email || null,
    };
  } catch (error) {
    if (error.status) throw error;

    customError({
      msg: "Error en el proceso de autenticación de la base de datos.",
      code: "DB_AUTH_ERROR",
      status: 500,
    });
  }
}

const appModels = {
  getAllProductsModel,
  getProductForIdModel,
  createNewProductModel,
  deleteProducModel,
  loginModel,
};

export { appModels };
