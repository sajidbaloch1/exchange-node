import {
  encryptPassword,
  generateJwtToken,
  validatePassword,
} from "../lib/auth-helpers.js";
import User from "../models/User.js";

const registerUser = async ({ username, password }) => {
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      throw new Error("username is already taken!");
    }

    const hashedPassword = await encryptPassword(password);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
      forcePasswordChange: true,
    });

    return createdUser;
  } catch (e) {
    throw new Error(e);
  }
};

const loginUser = async ({ username, password }) => {
  try {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      throw new Error("Invalid credentials!");
    }

    const isValidPassword = await validatePassword(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials!");
    }

    const token = generateJwtToken({ _id: existingUser._id });

    return { user: existingUser, token };
  } catch (e) {
    throw new Error(e);
  }
};

export default {
  registerUser,
  loginUser,
};
