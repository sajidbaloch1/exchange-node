import { validateJwtToken } from "../lib/auth-helpers.js";

export default function authMiddleware(req, res, next) {
  const validToken = validateJwtToken(req);

  if (!validToken) {
    return res.status(401).json({ error: "Not authenticated!" });
  }

  next();
}
