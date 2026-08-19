import express from "express";
import { authMiddleware } from "../middlewares/auth.Middleware.js";
import {
  createCommentController,
  getTicketCommentsController,
  deleteCommentController,
} from "../controller/Comment.Controller.js";

const router = express.Router({ mergeParams: true });

router.get("/test", (req, res) => {
  res.send("working");
});

// POST - Create a new comment on a ticket
router.post("/", authMiddleware, createCommentController);

// GET - Get all comments for a ticket
router.get("/", authMiddleware, getTicketCommentsController);

// DELETE - Delete a specific comment
router.delete("/:commentId", authMiddleware, deleteCommentController);

export default router;
