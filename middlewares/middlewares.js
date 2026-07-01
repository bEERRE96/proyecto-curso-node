import jwt from "jsonwebtoken";

function newProductData(req, res, next) {
  let { name, price, stock } = req.body;
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ msg: "Por favor complete todos los datos" });
  }

  const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s'\-,.]{3,60}$/;
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  const stockRegex = /^(0|[1-9]\d*)$/;

  if (!nameRegex.test(name.trim())) {
    return res.status(400).json({
      msg: "El nombre no es válido (debe tener entre 3 y 60 caracteres).",
    });
  }

  if (!priceRegex.test(price.toString())) {
    return res
      .status(400)
      .json({ msg: "El precio debe ser un número válido (ej: 150 o 99.99)." });
  }

  if (!stockRegex.test(stock.toString())) {
    return res
      .status(400)
      .json({ msg: "El stock debe ser un número entero mayor o igual a 0." });
  }

  next();
}

function loginData(req, res, next) {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Por favor complete todos los datos" });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  const passwordRegex = /.{4,20}/;

  if (!usernameRegex.test(username.trim())) {
    return res.status(400).json({
      msg: "El usuario solo puede contener letras, números y guiones bajos (entre 3 y 16 caracteres).",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      msg: "La contraseña debe tener entre 4 y 20 caracteres.",
    });
  }

  req.user = { username: username.trim(), password };
  next();
}

async function checkAuth(req, res, next) {
  let tokenHeader = req.headers?.authorization;

  if (!tokenHeader) {
    return res
      .status(401)
      .json({ msg: "Token de sesión inválido, vuelva a iniciar sesión" });
  }

  let token = tokenHeader.startsWith(`Bearer `)
    ? tokenHeader.split(" ")[1]
    : undefined;

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Sesión inválida, vuelva a iniciar sesión" });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken.id) {
      return res
        .status(401)
        .json({ msg: "Sesión inválida, vuelva a iniciar sesión" });
    }

    req.userId = verifyToken.id;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Sesión expirada o inválida, vuelva a iniciar sesión" });
  }
}

const appMiddlewares = { newProductData, loginData, checkAuth };

export { appMiddlewares };
