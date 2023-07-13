import { USER_ROLE } from "../models/User.js";
import userService from "../services/userService.js";

// Get all users
const getAllUser = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const showDeleted = req.body?.showDeleted
    ? req.body.showDeleted === true || req.body.showDeleted === "true"
    : false;
  const role = req.body?.role || null;
  const searchQuery = req.body?.searchQuery || null;
  const parentId = req.body?.parentId || null;

  if (role && !Object.values(USER_ROLE).includes(role)) {
    throw new Error("Invalid user role!");
  }

  const users = await userService.fetchAllUsers({
    page,
    perPage,
    sortBy,
    direction,
    showDeleted,
    role,
    searchQuery,
    parentId,
  });

  return res.status(200).json({ success: true, data: users });
};

// Get user by ID
const getUserById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const user = await userService.fetchUserId(_id);

  res.status(200).json({ success: true, data: { details: user } });
};

// Create a new user
const createUser = async (req, res) => {
  const user = req.user;
  const currencyId = req.body?.currencyId ? req.body.currencyId.trim() : null;
  const fullName = req.body?.fullName ? req.body.fullName.trim() : null;
  const username = req.body?.username ? req.body.username.trim() : null;
  const password = req.body?.password ? req.body.password.trim() : null;

  const rate = req.body?.rate ? Number(req.body.rate) : null;
  const balance = req.body?.balance ? Number(req.body.balance) : null;
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
    user,
    fullName,
    username,
    password,
    rate,
    balance,
    role,
    currencyId,
  });

  res.status(201).json({ success: true, data: { details: newuser } });
};

// Update a user
const updateUser = async (req, res) => {
  const _id = req.body?._id || null;
  const rate = req.body?.rate ? Number(req.body.rate) : null;
  const balance = req.body?.balance ? Number(req.body.balance) : null;
  const password = req.body?.password || null;
  const confirmPassword = req.body?.confirmPassword || null;

  if (!_id) {
    throw new Error("_id is required!");
  }

  if (password && confirmPassword && password !== confirmPassword) {
    throw new Error("password and confirm_password donot match!");
  }

  const updatedUser = await userService.modifyUser({
    _id,
    rate,
    balance,
    password,
  });

  res.status(200).json({ success: true, data: { details: updatedUser } });
};

// Delete a user
const deleteUser = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedUser = await userService.removeUser(_id);

  res.status(200).json({ success: true, data: { details: deletedUser } });
};

// Bet Lock
const updateUserStatus = async (req, res) => {
  const _id = req.body?._id || null;
  const isActive = req.body?.isActive || null;
  const isBetLock = req.body?.isBetLock || null;
  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedUserStatus = await userService.statusModify({
    _id,
    isActive,
    isBetLock,
  });

  res.status(200).json({ success: true, data: { details: updatedUserStatus } });
};
export default {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
};
