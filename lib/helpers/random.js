/**
 * Generates a random number of the specified length.
 *
 * @param {Object} options - The options object.
 * @param {number} [options.length=6] - The length of the generated random number.
 * @returns {string} The generated random number.
 */
export const randomNumber = ({ length = 6 }) => {
  const chars = "0123456789";

  let result = "";

  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};
