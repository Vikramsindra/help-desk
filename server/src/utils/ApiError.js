/**
 * Operational API error — thrown by controllers and services instead of
 * constructing error JSON by hand.
 *
 * The global error middleware (error.Middleware.js) converts every ApiError
 * into the standard error envelope:
 *
 *   {
 *     "success": false,
 *     "error": {
 *       "code":    "TICKET_NOT_FOUND",
 *       "message": "The requested ticket was not found",
 *       "details": <omitted when undefined>
 *     }
 *   }
 *
 * Usage:
 *   throw new ApiError(404, "TICKET_NOT_FOUND", "The requested ticket was not found");
 *   throw new ApiError(422, "VALIDATION_ERROR", "Invalid input", error.details);
 *
 * isOperational = true marks the error as expected/handled so the global
 * handler never leaks the stack trace for these errors.
 */
class ApiError extends Error {
  /**
   * @param {number}   statusCode  HTTP status code (e.g. 400, 401, 403, 404, 409, 422, 500)
   * @param {string}   code        Machine-readable error code (e.g. "TICKET_NOT_FOUND")
   * @param {string}   message     Human-readable error description
   * @param {*}        [details]   Optional structured details (e.g. Joi validation array)
   */
  constructor(statusCode, code, message, details = undefined) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    // Captures a clean stack trace that starts at the call site, not inside
    // this constructor, making debugging easier.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
