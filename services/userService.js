import User from "../models/User.js";

/**
 * Fetch all users from the database
 */
const fetchAllUsers = async () => {
  const users = await User.find({});
  return users;
};

/**
 * Fetch user by Id from the database
 */
const fetchUserId = async (id) => {
  const user = await User.findById(id);
  return user;
};

/**
 * create user in the database
 */
const addUser = async () => {
  const newUser = await User.create(req.body);
  return newUser;
};

/**
 * update user in the database
 */
const modifyUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, req.body);
  return user;
};

/**
 * delete user in the database
 */
const removeUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

export default {
  fetchAllUsers,
  fetchUserId,
  addUser,
  modifyUser,
  removeUser,
};
