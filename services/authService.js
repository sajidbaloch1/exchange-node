import ErrorResponse from "../lib/error-handling/error-response.js";
import {
  generateJwtToken,
  validatePassword,
} from "../lib/helpers/auth-helpers.js";
import Currency from "../models/Currency.js";
import User from "../models/User.js";

const registerUser = async ({ username, password, fullName, currencyId }) => {
  try {
    // Check existing username
    const existingUser = async (username) => {
      const user = await User.findOne({ username: username });
      return !user;
    };
    if (existingUser) {
      throw new Error("Username already in use!");
    }

    // Check if currency exists
    const currencyExists = async (currencyId) => {
      const currency = await Currency.findById(currencyId);
      return !!currency;
    };
    if (!currencyExists) {
      throw new Error("Currency not found!");
    }

    const createdUser = await User.create({
      username,
      password,
      forcePasswordChange: true,
      fullName,
      currencyId,
    });

    return createdUser;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const loginUser = async ({ username, password }) => {
  try {
    // Check if username exists
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      throw new Error("Invalid credentials!");
    }

    // Check if password is valid
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
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  registerUser,
  loginUser,
};
