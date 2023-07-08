import express from "express";
import userController from "../controllers/userControlles.js";
import { route } from "../lib/routes-error-boundary.js";

const router = express.Router();

route(router, "get", "/getAllUsers", userController.getAllUser);
route(router, "post", "/getUserById", userController.getUserById);
route(router, "post", "/createUser", userController.createUser);
route(router, "post", "/updateUser", userController.updateUser);
route(router, "post", "/deleteUser", userController.deleteUser);

export default router;
