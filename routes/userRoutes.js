import express from "express";
import userController from "../controllers/userControlles.js";
import { route } from "../lib/routes-error-boundary.js";

const router = express.Router();

//find all user
route(router, "get", "/getAllUsers", userController.getAllUser);

//find user with id
router.post("/getUserById", userController.getUserById);

//create a new user
router.post("/createUser", userController.createUser);

// update a user
router.post("/updateUserById", userController.updateUser);

// Route to delete a user
router.post("/deleteUserId", userController.deleteUser);

export default router;
