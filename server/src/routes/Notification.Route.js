import express from "express";
import { authMiddleware } from "../middlewares/auth.Middleware.js";
import {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
} from "../controller/Notification.Controller.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getNotificationsController);
router.patch("/read-all", markAllNotificationsReadController);
router.patch("/:notificationId/read", markNotificationReadController);

export default router;
