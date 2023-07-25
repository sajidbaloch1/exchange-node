import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../config/app.js";

/**
 * Encrypts a password using bcrypt.
 *
 * @param {string} password - The password to be encrypted.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(appConfig.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Validates a password by comparing it to a hashed password.
 *
 * @param {string} password - The password to be validated.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the password is valid.
 */
export const validatePassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

/**
 * Generates a JWT token with the provided payload.
 *
 * @param {Object} payload - The payload to be included in the JWT token.
 * @returns {string} The generated JWT token.
 */
export const generateJwtToken = (payload) => {
  const token = jwt.sign(payload, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRY,
  });

  const prefix = appConfig.JWT_TOKEN_PREFIX || "";

  return `${prefix} ${token}`;
};

/**
 * Validates a JWT token in the request's authorization header.
 *
 * @param {Object} req - The HTTP request object.
 * @returns {Object} An object indicating the validation result.
 * It contains the `isValid` boolean property and,
 * if invalid, the `message` property with the error message.
 */
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
