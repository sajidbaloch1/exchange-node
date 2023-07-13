import express from "express";
import userController from "../controllers/userController.js";
import { route } from "../lib/error-handling/routes-error-boundary.js";
import validateRequest from "../middlewares/requestMiddleware.js";
import userRequest from "../requests/userRequest.js";

const router = express.Router();

route(
  router,
  "post",
  "/getAllUsers",
  validateRequest(userRequest.listingSchema, userController.getAllUser)
);

route(router, "post", "/getUserById", userController.getUserById);

route(
  router,
  "post",
  "/createUser",
  validateRequest(userRequest.createUserSchema, userController.createUser)
);

route(
  router,
  "post",
  "/updateUser",
  validateRequest(userRequest.updateUserSchema, userController.updateUser)
);

route(router, "post", "/deleteUser", userController.deleteUser);

route(router, "post", "/updateUserStatus", userController.updateUserStatus);

export default router;
