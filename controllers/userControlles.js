import User from "../models/User.js";
import userService from "../services/userService.js";

/**
 * Get all users
 */
const getAllUser = async (req, res) => {
  try {
    const users = await userService.fetchAllUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== null) {
      throw new Error("id is required");
    }
    const user = await userService.fetchUserId(id);
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new user
 */
const createUser = async (req, res) => {
  try {
    const newuser = await userService.addUser();
    res.status(201).json(newuser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update a user by ID
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== null) {
      throw new Error("id is required");
    }
    const user = await userService.modifyUser();
    //can not find any user in database
    if (!user) {
      return res
        .status(409)
        .json({ message: `can not find any user with ID ${id}` });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a user by ID
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== null) {
      throw new Error("id is required");
    }
    const user = await User.findByIdAndDelete(id);
    //can not find any user in database
    if (!user) {
      return res
        .status(404)
        .json({ message: `can not find any user with ID ${id}` });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
