import { appModels } from "../models/models.js";
import { appServices } from "../services/services.js";

async function getAllProductsController(req, res) {
  try {
    let result = await appModels.getAllProductsModel();
    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      msg: error.msg || error.message || "Error en la conexion del servidor",
    });
  }
}

async function getProductForIdController(req, res) {
  try {
    let { id } = req.params;

    if (id === undefined) {
      return res.status(404).json({ msg: "No se encontro el producto" });
    }

    let result = await appModels.getProductForIdModel({ id });

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      msg: error.msg || error.message || "Error en la conexion del servidor",
    });
  }
}

async function createNewProductController(req, res) {
  try {
    let { name, price, stock } = req.body;

    let result = await appModels.createNewProductModel({ name, price, stock });
    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      msg: error.msg || error.message || "Error en la conexion del servidor",
    });
  }
}

async function deleteProductControler(req, res) {
  try {
    let { id } = req.params;
    if (id === undefined) {
      return res.status(404).json({ msg: "No se encontro el producto" });
    }
    let result = await appModels.deleteProducModel({ id });
    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      msg: error.msg || error.message || "Error en la conexion del servidor",
    });
  }
}

async function loginController(req, res) {
  try {
    let { username, password } = req.user;

    let result = await appServices.loginServices({ username, password });
    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      msg: error.msg || error.message || "Error en la conexion del servidor",
    });
  }
}

const appControllers = {
  getAllProductsController,
  getProductForIdController,
  createNewProductController,
  deleteProductControler,
  loginController,
};

export { appControllers };
