import express from "express";
import categoryController from "../controllers/categoryController.js";
import { route } from "../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllCategory", categoryController.getAllCategory);
route(router, "post", "/getCategoryById", categoryController.getCategoryById);
route(router, "post", "/createCategory", categoryController.createCategory);
route(router, "post", "/updateCategory", categoryController.updateCategory);
route(router, "post", "/deleteCategory", categoryController.deleteCategory);

export default router;
