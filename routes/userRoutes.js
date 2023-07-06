import express from "express";
import userController from "../controllers/userControlles.js";

const router = express.Router();

router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);

// update a user
router.put("/:id", userController.updateUser);

// Route to delete a user
router.delete("/:id", userController.deleteUser);

export default router;
