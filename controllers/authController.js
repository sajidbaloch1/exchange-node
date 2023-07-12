import ErrorResponse from "../lib/error-response.js";
import authService from "../services/authService.js";

const login = async (req, res) => {
  const username = req.body?.username ? req.body.username.trim() : null;
  const password = req.body?.password ? req.body.password.trim() : null;

  if (!(username && password)) {
    throw new ErrorResponse(200, "username and password is required!", {
      success: false,
    });
  }

  const userWithToken = await authService.loginUser({ username, password });

  return res.status(200).json({ success: true, data: userWithToken });
};

const register = async (req, res) => {
  const username = req.body?.username ? req.body.username.trim() : null;
  const password = req.body?.password ? req.body.password.trim() : null;
  const confirmPassword = req.body?.confirm_password
    ? req.body.confirm_password.trim()
    : null;
  const fullName = req.body?.fullName || null;

  if (!(username && password && confirmPassword && fullName)) {
    throw new Error(
      "username, fullName, password & confirm_password is required!"
    );
  }

  if (password !== confirmPassword) {
    throw new Error("password and confirm_password do not match!");
  }

  const registeredUser = await authService.registerUser({
    username,
    password,
    fullName,
  });

  return res.status(200).json({ success: true, data: registeredUser });
};

export default {
  login,
  register,
};
