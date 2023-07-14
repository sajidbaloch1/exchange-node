import ErrorResponse from "../lib/error-handling/error-response.js";
import {
  generateJwtToken,
  validatePassword,
} from "../lib/helpers/auth-helpers.js";
import Currency from "../models/Currency.js";
import User from "../models/User.js";

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

    const loggedInUser = existingUser.toJSON();
    delete loggedInUser.password;

    return { user: loggedInUser, token };
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const registerUser = async ({ username, password, fullName, currencyId }) => {
  try {
    // Check if currency exists
    const currency = await Currency.findById(currencyId);
    if (!currency) {
      throw new Error("Currency not found!");
    }

    const createdUser = await User.create({
      username,
      password,
      forcePasswordChange: true,
      fullName,
      currencyId,
    });

    const registeredUser = createdUser.toJSON();
    delete registeredUser.password;

    return registeredUser;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const resetPassword = async ({ user_id, old_password, new_password, is_force_change_password }) => {
  try {
    // Check if user_id exists
    const existingUser = await User.findOne({ _id: user_id });
    if (!existingUser) {
      throw new Error("User not found.");
    }

    // Check if password is valid
    const isValidPassword = await validatePassword(
      old_password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw new Error("Old password is incorrect!");
    }
    else {
      if (is_force_change_password == 'true') {
        existingUser.password = new_password;
        existingUser.forcePasswordChange = false;
        existingUser.save();
      }
      else {
        existingUser.password = new_password;
        existingUser.save();
      }
    }
    const loggedInUser = existingUser.toJSON();
    delete loggedInUser.password;
    return existingUser;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  loginUser,
  registerUser,
  resetPassword
};
