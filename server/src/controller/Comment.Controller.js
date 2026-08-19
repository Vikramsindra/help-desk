import Comment from "../models/Comment.Model.js";
import Ticket from "../models/Ticket.Model.js";
import mongoose from "mongoose";
import { commentSchema } from "../utils/Schema.Validation.js";

const createCommentController = async (req, res) => {
  try {
    const ticketId = req.params.ticketId || req.params.id;

    // Validate ticket ID format
    if (!ticketId) {
      return res.status(400).json({
        error: "Ticket ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        error: "Invalid ticket ID format",
      });
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    // Validate request body
    const { value, error } = commentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    // Create new comment
    const comment = new Comment({
      ticket: ticketId,
      author: req.user.id,
      message: value.message,
    });

    await comment.save();

    // Populate author info
    await comment.populate("author", "name email role");

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTicketCommentsController = async (req, res) => {
  try {
    const ticketId = req.params.ticketId || req.params.id;

    // Validate ticket ID format
    if (!ticketId) {
      return res.status(400).json({
        error: "Ticket ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        error: "Invalid ticket ID format",
      });
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    // Fetch all comments for the ticket
    const comments = await Comment.find({ ticket: ticketId })
      .populate("author", "name role")
      .sort({ createdAt: 1 }); // Chronological order

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const ticketId = req.params.ticketId || req.params.id;
    const { commentId } = req.params;

    // Validate IDs
    if (!ticketId || !commentId) {
      return res.status(400).json({
        error: "Ticket ID and Comment ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(ticketId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({
        error: "Invalid ticket or comment ID format",
      });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    // Check if comment belongs to the ticket
    if (comment.ticket.toString() !== ticketId) {
      return res.status(400).json({
        error: "Comment does not belong to this ticket",
      });
    }

    // Authorization: Only comment author or admin can delete
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        error: "You can only delete your own comments",
      });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createCommentController,
  getTicketCommentsController,
  deleteCommentController,
};
