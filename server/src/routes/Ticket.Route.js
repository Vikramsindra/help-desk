import express from "express";
import { authMiddleware } from "../middlewares/auth.Middleware.js"
import { createTicket, getMyTicketsController } from "../controller/Ticket.Controller.js";
import { allowRoles } from "../middlewares/role.Middleware.js"

const router = express.Router();


router.post("/", authMiddleware, createTicket);

router.get("/admin", authMiddleware, allowRoles("admin"), getAllTicketsController);

router.get("/my-ticket", authMiddleware, getMyTicketsController);

export default router;