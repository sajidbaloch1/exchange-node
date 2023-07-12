/**
 * Represents an error response with a specific status code, message, and optional body.
 *
 * @class ErrorResponse
 * @extends Error
 *
 * @param {number} statusCode - The HTTP status code for the error response.
 * @param {string} message - The error message.
 * @param {Object} [body={ success: false }] - Optional. Additional data to include in the error response body.
 *
 * @property {string} name - The name of the error ("ErrorResponse").
 * @property {number} statusCode - The HTTP status code for the error response.
 * @property {Object} body - The error response body, which includes the "success" property by default.
 */
export default class ErrorResponse extends Error {
  constructor(statusCode, message, body = { success: false }) {
    super(message);
    this.name = "ErrorResponse";
    this.statusCode = statusCode;
    this.body = { success: false, ...body };
  }
}
