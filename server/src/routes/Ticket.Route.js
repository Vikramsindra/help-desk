import express from "express";
import { authMiddleware } from "../middlewares/auth.Middleware.js";
import {
  createTicket,
  deleteTicketController,
  getMyTicketsController,
  getTicketDetailController,
  updateTicketController,
  getAllTicketsController,
  getAssignedTicketsController,
  assignTicketController,
  getDashboardStatsController,
} from "../controller/Ticket.Controller.js";
import { allowRoles } from "../middlewares/role.Middleware.js";
import CommentRoute from "./Comment.Route.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/dashboard/stats", authMiddleware, getDashboardStatsController);

router.get(
  "/admin",
  authMiddleware,
  allowRoles("admin", "super_admin"),
  getAllTicketsController,
);

router.get(
  "/my-ticket",
  authMiddleware,
  allowRoles("user"),
  getMyTicketsController,
);
router.get(
  "/assigned-to-me",
  authMiddleware,
  allowRoles("agent"),
  getAssignedTicketsController,
);
router.patch(
  "/:ticketId/assign",
  authMiddleware,
  allowRoles("admin", "super_admin"),
  assignTicketController,
);

// Nested routes for comments
router.use("/:ticketId/comments", CommentRoute);

router.get("/:id", authMiddleware, getTicketDetailController);

router.delete("/:id", authMiddleware, deleteTicketController);

router.patch("/:id", authMiddleware, updateTicketController);

export default router;
