import { getTrimmedUser } from "../../lib/helpers/auth.js";
import userService from "../../services/v1/userService.js";
import { validateSocketAuth } from "../middlewares/authSocketMiddleware.js";
import { validateUser } from "../middlewares/userSocketMiddleware.js";

async function handleConnection(socket) {
  console.log("A user connected", socket.id);

  try {
    const user = await userService.fetchUserId(socket.userId);
    const userDetails = getTrimmedUser(user);
    socket.emit(`user:${socket.userId}`, userDetails);
  } catch (e) {
    socket.emit("server_error", e.message);
    socket.disconnect(true);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
}

export const connect = (socket) => {
  socket.use(validateSocketAuth);
  socket.use(validateUser);

  socket.on("connection", handleConnection);
};
