import express from "express";
import authController from "../controllers/authController.js";
import { route } from "../lib/routes-error-boundary.js";
import validateRequest from "../middlewares/requestMiddleware.js";
import { loginReqSchema, registerReqSchema } from "../requests/authRequest.js";

const router = express.Router();

route(
  router,
  "post",
  "/login",
  validateRequest(loginReqSchema, authController.login),
  false
);

route(
  router,
  "post",
  "/register",
  validateRequest(registerReqSchema, authController.register),
  false
);

export default router;
