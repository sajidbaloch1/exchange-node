import { URL } from "url";

/**
 * Checks if a given string is a valid URL.
 *
 * @param {string} url - The URL string to be validated.
 * @returns {boolean} Returns true if the URL is valid, otherwise false.
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
