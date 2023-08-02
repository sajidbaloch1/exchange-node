import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generateJwtToken, validatePassword } from "../../lib/helpers/auth.js";
import Currency from "../../models/v1/Currency.js";
import { generateTransactionCode } from "../../lib/helpers/transaction-code.js";
import User, { USER_ROLE } from "../../models/v1/User.js";
import permissionService from "./permissionService.js";


const loginUser = async ({ username, password }) => {
  try {
    const allowedRoles = [
      USER_ROLE.SYSTEM_OWNER,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_MASTER,
      USER_ROLE.MASTER,
      USER_ROLE.AGENT,
    ];

    const errorMessage =
      "The provided credentials are incorrect. Please try again.";

    // Check if username exists
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      throw new Error(errorMessage);
    }

    // Check if user is allowed to login
    if (!allowedRoles.includes(existingUser.role)) {
      throw new Error(errorMessage);
    }

    // Check if password is valid
    const isValidPassword = await validatePassword(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw new Error(errorMessage);
    }

    const token = generateJwtToken({ _id: existingUser._id });

    const loggedInUser = existingUser.toJSON();
    delete loggedInUser.password;
    const userPermissions = await permissionService.fetchUserPermissions({
      userId: loggedInUser._id,
    });

    return { user: loggedInUser, token, userPermissions };
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const loginFrontUser = async ({ username, password }) => {
  try {
    const allowedRoles = [USER_ROLE.USER];

    const errorMessage =
      "The provided credentials are incorrect. Please try again.";

    // Check if username exists
    const existingUser = await User.findOne({
      username: username,
      role: USER_ROLE.USER,
    });
    if (!existingUser) {
      throw new Error(errorMessage);
    }

    // Check if user is allowed to login
    if (!allowedRoles.includes(existingUser.role)) {
      throw new Error(errorMessage);
    }

    // Check if password is valid
    const isValidPassword = await validatePassword(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw new Error(errorMessage);
    }

    const token = generateJwtToken({ _id: existingUser._id });

    const loggedInUser = existingUser.toJSON();
    delete loggedInUser.password;

    return { user: loggedInUser, token };
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const registerUser = async ({
  username,
  password,
  fullName,
  currencyId,
  mobileNumber,
}) => {
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

const resetPassword = async ({
  userId,
  oldPassword,
  newPassword,
  isForceChangePassword,
}) => {
  try {
    // Check if user_id exists
    const existingUser = await User.findOne({ _id: userId });
    const transactionCodesInUse = await User
      .distinct("transactionCode")
      .exec();

    if (!existingUser) {
      throw new Error(
        "The provided credentials are incorrect. Please try again."
      );
    }

    if (existingUser.lockPasswordChange === true) {
      throw new Error("You can not change password.");
    }

    // Check if password is valid
    const isValidPassword = await validatePassword(
      oldPassword,
      existingUser.password
    );

    if (!isValidPassword) {
      throw new Error("Old password is incorrect!");
    } else {
      if (isForceChangePassword === "true") {
        existingUser.password = newPassword;
        existingUser.forcePasswordChange = false;
        existingUser.transactionCode = generateTransactionCode(transactionCodesInUse);
        existingUser.save();
      } else {
        existingUser.password = newPassword;
        existingUser.transactionCode = generateTransactionCode(transactionCodesInUse);
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
