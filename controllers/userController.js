import userRequest from "../requests/userRequest.js";
import userService from "../services/userService.js";

// Get all users
const getAllUser = async (req, res) => {
  const validatedReq = await userRequest.userListingRequest(req);

  const users = await userService.fetchAllUsers(validatedReq);

  return res.status(200).json({ success: true, data: users });
};

// Get user by ID
const getUserById = async (req, res) => {
  const { _id = null } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const user = await userService.fetchUserId(_id);

  res.status(200).json({ success: true, data: { details: user } });
};

// Create a new user
const createUser = async (req, res) => {
  const validatedReq = await userRequest.createUserRequest(req);

  const newuser = await userService.addUser(validatedReq);

  res.status(201).json({ success: true, data: { details: newuser } });
};

// Update a user
const updateUser = async (req, res) => {
  const validatedReq = await userRequest.updateUserRequest(req);

  const updatedUser = await userService.modifyUser(validatedReq);

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
