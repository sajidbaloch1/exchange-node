import express from "express";
import authController from "../controllers/authController.js";
import { route } from "../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/login", authController.login, false);
route(router, "post", "/register", authController.register, false);

export default router;
