import express from "express";
import {
  createStaffController,
  getStaffListController,
  getStaffDetailController,
  updateStaffController,
  getAgentCandidatesController,
  getCustomerListController,
  getCustomerDetailController,
  updateCustomerController,
} from "../controller/User.Controller.js";
import { authMiddleware } from "../middlewares/auth.Middleware.js";
import { allowRoles } from "../middlewares/role.Middleware.js";

const router = express.Router();
router.get(
  "/agents",
  authMiddleware,
  allowRoles("admin", "super_admin"),
  getAgentCandidatesController,
);
router.get(
  "/customers",
  authMiddleware,
  allowRoles("super_admin"),
  getCustomerListController,
);
router.get(
  "/customers/:customerId",
  authMiddleware,
  allowRoles("super_admin"),
  getCustomerDetailController,
);
router.patch(
  "/customers/:customerId",
  authMiddleware,
  allowRoles("super_admin"),
  updateCustomerController,
);
router.get(
  "/users",
  authMiddleware,
  allowRoles("super_admin"),
  getStaffListController,
);
router.post(
  "/users",
  authMiddleware,
  allowRoles("super_admin"),
  createStaffController,
);
router.get(
  "/users/:staffId",
  authMiddleware,
  allowRoles("super_admin"),
  getStaffDetailController,
);
router.patch(
  "/users/:staffId",
  authMiddleware,
  allowRoles("super_admin"),
  updateStaffController,
);

export default router;
