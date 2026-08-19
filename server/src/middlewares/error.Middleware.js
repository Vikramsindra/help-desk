const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || error.status || 500;
  const message = statusCode >= 500 ? "Internal server error" : error.message;

  res.status(statusCode).json({
    message: message || "Internal server error",
  });
};

export { notFoundMiddleware, errorMiddleware };
