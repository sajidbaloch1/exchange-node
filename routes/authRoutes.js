import express from "express";
import authController from "../controllers/authController.js";
import { route } from "../lib/routes-error-boundary.js";
import validateRequest from "../middlewares/requestMiddleware.js";
import authRequest from "../requests/authRequest.js";

const router = express.Router();

route(
  router,
  "post",
  "/login",
  validateRequest(authRequest.loginSchema, authController.login),
  false
);

route(
  router,
  "post",
  "/register",
  validateRequest(authRequest.registerSchema, authController.register),
  false
);

export default router;
