import User from "../../models/v1/User.js";

async function validateUser(socket, next) {
  if (!socket.userId) {
    return next(new Error("User not found"));
  }

  const user = await User.findById(socket.userId);

  if (!user) {
    return next(new Error("User not found"));
  }

  return next();
}

export { validateUser };
