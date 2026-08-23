import express from "express";
import { createStaffController } from "../controller/User.Controller.js";
import { authMiddleware } from "../middlewares/auth.Middleware.js";
import { allowRoles } from "../middlewares/role.Middleware.js";

const router = express.Router();
router.post(
  "/users",
  authMiddleware,
  allowRoles("super_admin"),
  createStaffController,
);

export default router;
