import express from "express";
import authController from "../controllers/authController.js";
import { route } from "../lib/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/register", authController.register, false);
// route(router, "post", "/login", authController.login, false);
router.post("/login", authController.login);

export default router;
