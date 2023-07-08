import User, { USER_ROLE } from "../models/User.js";
import userService from "../services/userService.js";

/**
 * Get all users
 */
const getAllUser = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";

  const users = await userService.fetchAllUsers({
    page,
    perPage,
    sortBy,
    direction,
  });

  return res.status(200).json({ success: true, data: users });
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const user = await userService.fetchUserId(_id);

  res.status(200).json({ success: true, data: user });
};

/**
 * Create a new user
 */
const createUser = async (req, res) => {
  const username = req.body?.username ? req.body.username.trim() : null;
  const password = req.body?.password ? req.body.password.trim() : null;

  const rate = req.body?.rate ? Number(req.body.rate) : null;
  const role = req.body?.role ? req.body?.role?.toLowerCase() : null;

  if (!(username && password)) {
    throw new Error("username and password is required!");
  }

  if (rate && (rate < 0 || rate > 1)) {
    throw new Error("Invalid rate!");
  }

  if (role) {
    const userRoles = Object.values(USER_ROLE);
    if (!userRoles.includes(role)) {
      throw new Error("Invalid user role!");
    }
  }

  const newuser = await userService.addUser({
    username,
    password,
    rate,
    role,
  });

  res.status(201).json({ data: newuser });
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
