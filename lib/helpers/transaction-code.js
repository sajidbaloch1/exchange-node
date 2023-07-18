import bcrypt from "bcrypt";
import { appConfig } from "../../config/app.js";
import { randomNumber } from "./random.js";

/**
 * Encrypts a transaction code using bcrypt.
 *
 * @param {string} uniqueCode - The transaction code to be encrypted.
 * @returns {Promise<string>} A promise that resolves to the hashed transaction code.
 */
export const encryptTransactionCode = async (uniqueCode) => {
  const salt = await bcrypt.genSalt(appConfig.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(uniqueCode, salt);
  return hashedPassword;
};

/**
 * Validates a transaction code by comparing it to a hashed transaction code.
 *
 * @param {string} uniqueCode - The transaction code to be validated.
 * @param {string} hashedPassword - The hashed transaction code to compare against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the transaction code is valid.
 */
export const validateTransactionCode = async (uniqueCode, hashedPassword) => {
  const isValid = await bcrypt.compare(uniqueCode, hashedPassword);
  return isValid;
};

/**
 * Generates a unique transaction code by ensuring it does not exist in the existing codes array.
 *
 * @param {string[]} existingCodes - An array of existing transaction codes.
 * @returns {Promise<string>} A promise that resolves to the encrypted unique transaction code.
 */
export const generateTransactionCode = async (existingCodes = []) => {
  let uniqueCode = randomNumber({ length: 6 });

  while (existingCodes.includes(uniqueCode)) {
    uniqueCode = randomNumber({ length: 6 });
  }

  const encryptedCode = await encryptTransactionCode(uniqueCode);
  return encryptedCode;
};
