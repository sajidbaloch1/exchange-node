import CryptoJS from "crypto-js";
import { appConfig } from "../../config/app.js";
import { randomNumber } from "./random.js";

/**
 * Encrypts a transaction code using AES encryption.
 *
 * @param {string} uniqueCode - The transaction code to be encrypted.
 * @returns {string} The encrypted transaction code.
 */
export const encryptTransactionCode = (uniqueCode) => {
  const encryptedCode = CryptoJS.AES.encrypt(uniqueCode, appConfig.TRANSACTION_AES_SECRET).toString();

  return encryptedCode;
};

/**
 * Decrypts an encrypted transaction code using AES decryption.
 *
 * @param {string} encryptedCode - The encrypted transaction code to be decrypted.
 * @returns {string} The decrypted transaction code.
 */
export const decryptTransactionCode = (encryptedCode) => {
  const bytes = CryptoJS.AES.decrypt(encryptedCode, appConfig.TRANSACTION_AES_SECRET);

  const decryptedCode = bytes.toString(CryptoJS.enc.Utf8);

  return decryptedCode;
};

/**
 * Validates a transaction code by comparing it to an encrypted code.
 *
 * @param {string} uniqueCode - The transaction code to be validated.
 * @param {string} encryptedCode - The encrypted transaction code to compare against.
 * @returns {boolean} A boolean indicating if the transaction code is valid.
 */
export const validateTransactionCode = (uniqueCode, encryptedCode) => {
  const decryptedCode = decryptTransactionCode(encryptedCode);
  const isValid = decryptedCode === uniqueCode;

  return isValid;
};

/**
 * Generates a unique transaction code by ensuring it does not exist in the existing codes array.
 *
 * @param {string[]} existingCodes - An array of existing transaction codes.
 * @returns {string} The generated unique transaction code.
 */
export const generateTransactionCode = (existingCodes = []) => {
  let uniqueCode = randomNumber({ length: 6 });

  while (existingCodes.includes(uniqueCode)) {
    uniqueCode = randomNumber({ length: 6 });
  }

  const encryptedCode = encryptTransactionCode(uniqueCode);
  return encryptedCode;
};
