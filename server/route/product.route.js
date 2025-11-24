import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createProduct,
  getAllProducts,
  getAllProductsByCatId,
  getAllProductsByCatName,
  getAllProductsByPrice,
  getAllProductsBySubCatId,
  getAllProductsBySubCatName,
  getAllProductsBySubThirdLaveCatId,
  getAllProductsBySubThirdLaveCatName,
  uploadImages,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
productRouter.post("/create", auth, createProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getAllProductsByCatId/:id", getAllProductsByCatId);
productRouter.get("/getAllProductsByCatName", getAllProductsByCatName);
productRouter.get("/getAllProductsBySubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/getAllProductsBySubCatName", getAllProductsBySubCatName);
productRouter.get(
  "/getAllProductsByThirdLavelCat/:id",
  getAllProductsBySubThirdLaveCatId
);
productRouter.get(
  "/getAllProductsByThirdLavelCatName",
  getAllProductsBySubThirdLaveCatName
);
productRouter.get("/getAllProductsByPrice", getAllProductsByPrice);

export default productRouter;
