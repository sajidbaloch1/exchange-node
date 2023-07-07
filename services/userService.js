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
const addUser = async ({ username, password, rate, role }) => {
  const newUserObj = {
    username: username,
    password: password,
    rate: rate,
    role: role,
    forcePasswordChange: true,
  };
  const newUser = await User.create(newUserObj);
  return newUser;
};

/**
 * update user in the database
 */
const modifyUser = async (body) => {
  const user = await User.findByIdAndUpdate(body._id, body);
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
