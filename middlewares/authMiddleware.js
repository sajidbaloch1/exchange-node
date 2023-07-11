import { validateJwtToken } from "../lib/auth-helpers.js";

export default async function authMiddleware(req, res, next) {
  const token = await validateJwtToken(req);

  if (!token.isValid) {
    return res.status(401).json({
      invalidAuth: true,
      message: token.message || "Not authenticated!",
    });
  }

  next();
}
