import authService from "../services/authService.js";
import authRequest from "../requests/authRequest.js";

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

  return res.status(200).json({ success: true, data: registeredUser });
};

export default {
  login,
  register,
};
