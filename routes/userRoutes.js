import express from "express";
import userController from "../controllers/userControlles.js";
import { route } from "../lib/routes-error-boundary.js";

const router = express.Router();

//find all user
route(router, "get", "/getAllUsers", userController.getAllUser);

//find product with id
router.get("/:id", userController.getUserById);

//create a new user
router.post("/", userController.createUser);

// update a user
router.put("/:id", userController.updateUser);

// Route to delete a user
router.delete("/:id", userController.deleteUser);

export default router;
