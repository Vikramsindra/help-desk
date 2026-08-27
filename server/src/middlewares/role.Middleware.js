import ApiError from "../utils/ApiError.js";

/**
 * Role-based access control middleware factory.
 * Pass one or more allowed roles; the middleware rejects any other role.
 * All errors are forwarded to the global error middleware via next(ApiError).
 *
 * Usage:
 *   router.get("/admin", authMiddleware, allowRoles("admin", "super_admin"), handler);
 */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(401, "AUTH_REQUIRED", "Authentication required"),
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "ACCESS_DENIED", "Access denied"),
      );
    }

    next();
  };
};

export { allowRoles };