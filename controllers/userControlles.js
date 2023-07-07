import User from "../models/User.js";
import userService from "../services/userService.js";

/**
 * Get all users
 */
const getAllUser = async (req, res) => {
  try {
    const users = await userService.fetchAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    console.log(".............");
    const { id } = req.body;
    if (id == null) {
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
    console.log(req.body);
    const username = req.body.username || null;
    const password = req.body.password || null;
    const rate = req.body.rate || null;
    const role = req.body.role || null;
    if (!username && password && rate && role) {
      return res.status(400).json({ error: "field is required" });
    }
    const newuser = await userService.addUser({
      username,
      password,
      rate,
      role,
    });
    res.status(201).json({ data: newuser });
    // res.status(201).json({ data: "sss" });
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
    const { _id } = req.body;
    const user = await userService.modifyUser(req.body);
    if (_id == null) {
      throw new Error("id is required");
    }

    res.status(200).json({ data: user });
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
    // console.log(req.body);
    const { _id } = req.body;
    if (_id == null) {
      throw new Error("id is required");
    }
    const user = await userService.removeUser(_id);
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
