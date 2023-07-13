import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../config/app.js";

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
export const validateJwtToken = async (req) => {
  const jwtErrors = {
    TokenExpiredError: "Token expired!",
    JsonWebTokenError: "Invalid token!",
    NotBeforeError: "Inactive token!",
  };

  try {
    const token = req.get("Authorization");
    if (!token) {
      throw new Error("Missing token!");
    }

    const prefix = appConfig.JWT_TOKEN_PREFIX + " " || "";
    const tokenPrefix = token.slice(0, prefix.length);

    if (prefix.length && tokenPrefix !== prefix) {
      throw new Error("Invalid token!");
    }

    const originalToken = token.replace(prefix, "");
    const user = jwt.verify(originalToken, appConfig.JWT_SECRET);

    req.user = user;

    return { isValid: true };
  } catch (e) {
    let errorMessage = e.message;

    if (Object.keys(jwtErrors).includes(e.name)) {
      errorMessage = jwtErrors[e.name];
    }

    return { isValid: false, message: errorMessage };
  }
};
