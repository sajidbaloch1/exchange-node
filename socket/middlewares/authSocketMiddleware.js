import { parseJwtToken } from "../../lib/helpers/auth.js";

async function validateSocketAuth(socket, next) {
  const token = socket.handshake.auth.token;

  const parsedResult = await parseJwtToken(token);

  if (!parsedResult.isValid) {
    return next(new Error("Invalid token"));
  }

  socket.userId = parsedResult.tokenData._id;

  return next();
}

export { validateSocketAuth };
