import { isValidObjectId } from "mongoose";
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

/**
 * Checks if a given array contains valid ObjectIds.
 *
 * @param {Array} ids - The array of ObjectIds to be validated.
 * @returns {boolean} Returns true if the array contains valid ObjectIds, otherwise false.
 */
export const isValidObjectIdArray = (ids = []) => {
  try {
    if (!Array.isArray(ids)) {
      return false;
    }
    for (const id of ids) {
      if (!isValidObjectId(id)) {
        return false;
      }
    }
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Checks if a given string is a valid country code.
 *
 * @param {string} countryCode - The country code to be validated.
 * @returns {boolean} Returns true if the country code is valid, otherwise false.
 */
export const isValidCountryCode = (countryCode) => {
  try {
    const regex = new RegExp("^\\+[1-9]{1,3}$");

    return regex.test(countryCode);
  } catch (err) {
    return false;
  }
};
