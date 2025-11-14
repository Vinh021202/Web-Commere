import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createCategory,
  getCategories,
  getCategoryCount,
  uploadImages,
} from "../controllers/category.controller.js";

const categoryRouter = Router();
categoryRouter.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  uploadImages
);
categoryRouter.post("/create", auth, upload.array("images"), createCategory);
categoryRouter.get("/", auth, getCategories);
categoryRouter.get("/get/count", auth, getCategoryCount);

export default categoryRouter;
