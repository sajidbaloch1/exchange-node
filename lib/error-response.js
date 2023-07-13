/**
 * Represents an error response with a specific status code, message, and optional body.
 *
 * @class ErrorResponse
 * @extends Error
 *
 * @param {string} message - The error message.
 * @param {number} [status=200] - The HTTP status code for the error response.
 * @param {Object} [responseBody={ success: false }] - Optional. Additional data to include in the error response body.
 *
 * @property {string} name - The name of the error ("ErrorResponse").
 * @property {number} status - The HTTP status code for the error response.
 * @property {Object} body - The error response body, which includes the "success" property by default.
 */
export default class ErrorResponse extends Error {
  constructor(message, status = 200, responseBody = {}) {
    super(
      typeof message === "string"
        ? message
        : message instanceof Error
        ? message.message
        : "Unknown Error!"
    );
    this.name = "ErrorResponse";
    this.statusCode = status;
    this.responseBody = { success: false, ...responseBody };
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  body(responseBody) {
    this.responseBody = { ...this.responseBody, ...responseBody };
    return this;
  }
}
