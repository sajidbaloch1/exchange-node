import User from "../models/User.js";

const getUserPermissions = async ({ userId }) => {
  try {
    const user = await User.findById(userId);
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  getUserPermissions,
};
