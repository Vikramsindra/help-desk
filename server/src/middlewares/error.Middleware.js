import ApiError from "../utils/ApiError.js";

/**
 * 404 handler — registered after all routes.
 * Passes an ApiError to the global error handler instead of responding directly,
 * so the error envelope is consistent.
 */
const notFoundMiddleware = (req, res, next) => {
  next(
    new ApiError(
      404,
      "ROUTE_NOT_FOUND",
      `Route not found: ${req.method} ${req.originalUrl}`,
    ),
  );
};

/**
 * Global error middleware — must be the last app.use() call.
 *
 * Handles two classes of errors:
 *   1. ApiError (isOperational = true)  — expected business/validation errors.
 *      The original statusCode, code, and message are forwarded to the client.
 *   2. Unexpected errors                — bugs, DB failures, etc.
 *      Always respond with 500 and a generic message; stack is never leaked.
 *
 * Error envelope shape:
 *   {
 *     "success": false,
 *     "error": {
 *       "code":    "MACHINE_CODE",
 *       "message": "Human-readable description",
 *       "details": <present only when set>
 *     }
 *   }
 */
const errorMiddleware = (error, req, res, next) => {
  // Always log full error server-side
  console.error(error);

  if (error.isOperational) {
    // Known ApiError — safe to forward details to client
    const body = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };

    if (error.details !== undefined) {
      body.error.details = error.details;
    }

    return res.status(error.statusCode).json(body);
  }

  // Unexpected error — never leak internals in production
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
};

export { notFoundMiddleware, errorMiddleware };
