import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.Model.js";
import ApiError from "../utils/ApiError.js";

/**
 * Authentication middleware.
 * Verifies the Bearer access token in the Authorization header.
 * Populates req.user with the decoded JWT payload on success.
 * Delegates all error responses to the global error middleware via next(ApiError).
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new ApiError(401, "TOKEN_MISSING", "Access token required"));
    }

    // 2. Check Bearer format
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(
        new ApiError(
          401,
          "TOKEN_INVALID_FORMAT",
          "Invalid authorization format",
        ),
      );
    }

    const token = parts[1];

    // 3. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || process.env.ACCESS_SECRET,
      { algorithms: ["HS256"] },
    );

    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return next(new ApiError(401, "TOKEN_INVALID", "Invalid access token"));
    }

    const user = await User.findById(decoded.id).select("role isActive");
    if (!user || user.isActive === false) {
      return next(
        new ApiError(401, "ACCOUNT_INACTIVE", "Account is unavailable"),
      );
    }

    // Use current database permissions so role changes and deactivation take effect immediately.
    req.user = { ...decoded, id: user._id.toString(), role: user.role };

    // 5. Continue to protected controller
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "TOKEN_EXPIRED", "Access token expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "TOKEN_INVALID", "Invalid access token"));
    }

    // Unexpected error — let global handler deal with it
    next(error);
  }
};

export { authMiddleware };
