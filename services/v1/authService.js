import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generateJwtToken, validatePassword } from "../../lib/helpers/auth.js";
import Currency from "../../models/v1/Currency.js";
import User, { USER_ROLE } from "../../models/v1/User.js";

const loginUser = async ({ username, password }) => {
  try {
    // Check if username exists
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      throw new Error("The provided credentials are incorrect. Please try again.");
    }

    // Check if password is valid
    const isValidPassword = await validatePassword(password, existingUser.password);
    if (!isValidPassword) {
      throw new Error("The provided credentials are incorrect. Please try again.");
    }

    const token = generateJwtToken({ _id: existingUser._id });

    const loggedInUser = existingUser.toJSON();
    delete loggedInUser.password;
    return { user: loggedInUser, token };
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const loginFrontUser = async ({ username, password }) => {
  try {
    // Check if username exists
    const existingUser = await User.findOne({ username: username, role: USER_ROLE.USER });
    if (!existingUser) {
      throw new Error("The provided credentials are incorrect. Please try again.");
    }

    // Check if password is valid
    const isValidPassword = await validatePassword(password, existingUser.password);
    if (!isValidPassword) {
      throw new Error("The provided credentials are incorrect. Please try again.");
    }

    const token = generateJwtToken({ _id: existingUser._id });

    const loggedInUser = existingUser.toJSON();
    delete loggedInUser.password;
    return { user: loggedInUser, token };
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const registerUser = async ({ username, password, fullName, currencyId, mobileNumber }) => {
  try {
    // Check if currency exists
    const currency = await Currency.findById(currencyId);
    if (!currency) {
      throw new Error("Currency not found!");
    }

    const createdUser = await User.create({
      username,
      password,
      fullName,
      currencyId,
      mobileNumber,
    });

    const registeredUser = createdUser.toJSON();
    delete registeredUser.password;

    return registeredUser;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const resetPassword = async ({ userId, oldPassword, newPassword, isForceChangePassword }) => {
  try {
    // Check if user_id exists
    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
      throw new Error("User not found.");
    }

    if (existingUser.lockPasswordChange == true) {
      throw new Error("You can not change password.");
    }

    // Check if password is valid
    const isValidPassword = await validatePassword(oldPassword, existingUser.password);
    if (!isValidPassword) {
      throw new Error("Old password is incorrect!");
    } else {
      if (isForceChangePassword == "true") {
        existingUser.password = newPassword;
        existingUser.forcePasswordChange = false;
        existingUser.save();
      } else {
        existingUser.password = newPassword;
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
  loginFrontUser,
  registerUser,
  resetPassword,
};
