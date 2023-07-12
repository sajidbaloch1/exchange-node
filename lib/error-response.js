export default class ErrorResponse extends Error {
  constructor(statusCode, message, body = {}) {
    super(message);
    this.name = "ErrorResponse";
    this.statusCode = statusCode;
    this.body = body;
  }
}
