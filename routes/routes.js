import { Router } from "express";
import { appControllers } from "../controllers/controllers.js";
import { appMiddlewares } from "../middlewares/middlewares.js";

const ProductRoutes = Router();
const AuthRoutes = Router();

ProductRoutes.get(
  "/products",
  appMiddlewares.checkAuth,
  appControllers.getAllProductsController
);
ProductRoutes.get(
  "/products/:id",
  appMiddlewares.checkAuth,
  appControllers.getProductForIdController
);
ProductRoutes.post(
  "/products/create",
  appMiddlewares.checkAuth,
  appMiddlewares.newProductData,
  appControllers.createNewProductController
);
ProductRoutes.delete(
  "/products/:id",
  appMiddlewares.checkAuth,
  appControllers.deleteProductControler
);
AuthRoutes.post(
  "/login",
  appMiddlewares.loginData,
  appControllers.loginController
);

export { ProductRoutes, AuthRoutes };
