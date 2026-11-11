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
  if (!error.isOperational && process.env.NODE_ENV !== "test") {
    console.error("Unhandled API request failure", {
      method: req.method,
      path: req.path,
      statusCode: error.statusCode || error.status || 500,
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Request body is too large",
      },
    });
  }

  if (error instanceof SyntaxError && Object.hasOwn(error, "body")) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_JSON", message: "Malformed JSON request body" },
    });
  }

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
      body.error.details = Array.isArray(error.details)
        ? error.details.map((detail) => {
            const safeDetail = {};
            for (const key of ["message", "path", "type", "field", "msg"]) {
              if (detail[key] !== undefined) safeDetail[key] = detail[key];
            }
            return safeDetail;
          })
        : undefined;
      if (body.error.details === undefined) delete body.error.details;
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
