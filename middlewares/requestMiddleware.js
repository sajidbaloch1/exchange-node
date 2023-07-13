import ErrorResponse from "../lib/error-handling/error-response.js";

/**
 * Middleware that validates a request against a Yup schema and calls a controller if the request is valid.
 *
 * @param {Function} validationSchema - The Yup schema validation function that validates the request.
 * @param {Function} controller - The controller function to be called if the request is valid.
 * @returns {Function} - The middleware function that handles request validation and controller invocation.
 * @throws {ErrorResponse} - Throws an ErrorResponse with a status code of 200 and the error message if validation fails.
 */
export default function validateRequest(validationSchema, controller) {
  return async function (req, res, next) {
    const validator = await validationSchema(req);
    try {
      await validator.validate(req.body);
      return await controller(req, res, next);
    } catch (e) {
      throw new ErrorResponse(e.message).status(200);
    }
  };
}
