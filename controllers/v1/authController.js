import authService from "../../services/authService.js";
import authRequest from "../../requests/v1/authRequest.js";
import { USER_ACTIVITY_EVENT } from "../../models/v1/UserActivity.js";
import userActivityService from "../../services/userActivityService.js";

/**
 * Logs in a user.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response with success status and user data.
 */
const login = async (req, res) => {
  const { user, body } = await authRequest.userLoginRequest(req);

  const userWithToken = await authService.loginUser({ user, ...body });

  await userActivityService.createUserActivity({
    userId: userWithToken.user._id,
    event: USER_ACTIVITY_EVENT.LOGIN,
    ipAddress: body.ipAddress,
    description: body.description,
  });

  return res.status(200).json({ success: true, data: userWithToken });
};

/**
 * Registers a new user.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response with success status and registered user data.
 */
const register = async (req, res) => {
  const { user, body } = await authRequest.userRegisterRequest(req);

  const registeredUser = await authService.registerUser({ user, ...body });
  console.log(registeredUser);
  await userActivityService.createUserActivity({
    userId: registeredUser._id,
    event: USER_ACTIVITY_EVENT.REGISTERED,
    ipAddress: body.ipAddress,
    description: body.description,
  });

  return res.status(200).json({ success: true, data: registeredUser });
};

/**
 * Reset password.
 */

const resetPassword = async (req, res) => {
  const { body } = await authRequest.userResetPasswordRequest(req);

  const resetPasswordUser = await authService.resetPassword({ ...body });

  await userActivityService.createUserActivity({
    userId: resetPasswordUser._id,
    event: USER_ACTIVITY_EVENT.PASSWORD_RESET,
    ipAddress: body.ipAddress,
    description: body.description,
  });

  return res.status(200).json({ success: true, data: resetPasswordUser });
};

export default {
  login,
  register,
  resetPassword,
};
