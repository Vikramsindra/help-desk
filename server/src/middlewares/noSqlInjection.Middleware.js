import ApiError from "../utils/ApiError.js";

const hasUnsafeKeys = (value) => {
  if (!value || typeof value !== "object") return false;

  return Object.entries(value).some(
    ([key, child]) =>
      key.startsWith("$") ||
      key.includes(".") ||
      ["__proto__", "prototype", "constructor"].includes(key) ||
      hasUnsafeKeys(child),
  );
};

const noSqlInjectionMiddleware = (req, res, next) => {
  if (
    hasUnsafeKeys(req.body) ||
    hasUnsafeKeys(req.query) ||
    hasUnsafeKeys(req.params)
  ) {
    return next(
      new ApiError(
        400,
        "UNSAFE_INPUT",
        "Request contains unsupported field names",
      ),
    );
  }

  next();
};

export { noSqlInjectionMiddleware };
