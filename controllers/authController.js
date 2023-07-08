import authService from "../services/authService.js";

const register = async (req, res) => {
  try {
    const username = req.body?.username ? req.body.username.trim() : null;
    const password = req.body?.password ? req.body.password.trim() : null;
    const confirmPassword = req.body?.confirm_password
      ? req.body.confirm_password.trim()
      : null;

    if (!(username && password && confirmPassword)) {
      throw new Error("username, password & confirm_password is required!");
    }

    if (password !== confirmPassword) {
      throw new Error("password and confirm_password do not match!");
    }

    const registeredUser = await authService.registerUser({
      username,
      password,
    });

    return res.status(200).json({ success: true, data: registeredUser });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const username = req.body?.username ? req.body.username.trim() : null;
    const password = req.body?.password ? req.body.password.trim() : null;

    if (!(username && password)) {
      throw new Error("username and password is required!");
    }

    const userWithToken = await authService.loginUser({ username, password });

    return res.status(200).json({ success: true, data: userWithToken });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

export default {
  register,
  login,
};
