import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app.js";

// Generate hashed password from normal password
export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(appConfig.SALT_ROUNDS);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

// Check if the entered password matches the hashed password
export const validatePassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);

  return isValid;
};

// Generate JWT token
export const generateJwtToken = (payload) => {
  const token = jwt.sign(payload, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRY,
  });

  const prefix = appConfig.JWT_TOKEN_PREFIX || "";

  return `${prefix} ${token}`;
};

// Validate JWT token
export const validateJwtToken = (req) => {
  const token = req.get("Authorization");
  if (!token) {
    return false;
  }

  const prefix = appConfig.JWT_TOKEN_PREFIX + " " || "";
  const tokenPrefix = token.slice(0, prefix.length);

  if (prefix.length && tokenPrefix !== prefix) {
    return false;
  }

  const originalToken = token.replace(prefix, "");
  const decodedPayload = jwt.verify(originalToken, appConfig.JWT_SECRET);
  req.user = decodedPayload;

  return true;
};
