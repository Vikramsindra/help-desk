import Comment from "../models/Comment.Model.js";
import Ticket from "../models/Ticket.Model.js";
import mongoose from "mongoose";
import { commentSchema } from "../utils/Schema.Validation.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// ─── Access check helper ──────────────────────────────────────────────────────

const canAccessTicket = (ticket, user) => {
  if (["admin", "super_admin"].includes(user.role)) return true;
  if (user.role === "user") return ticket.createdBy.toString() === user.id;
  return ticket.assignedTo?.toString() === user.id;
};

// ─── Create comment ───────────────────────────────────────────────────────────

const createCommentController = async (req, res, next) => {
  try {
    const ticketId = req.params.ticketId || req.params.id;

    // Validate ticket ID format
    if (!ticketId) {
      return next(new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return next(new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"));
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return next(new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found"));
    }

    if (!canAccessTicket(ticket, req.user)) {
      return next(new ApiError(403, "ACCESS_DENIED", "Access forbidden"));
    }

    // Validate request body
    const { value, error } = commentSchema.validate(req.body);

    if (error) {
      return next(
        new ApiError(400, "VALIDATION_ERROR", error.details[0].message, error.details),
      );
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

    return res.status(201).json(
      new ApiResponse(comment, "Comment created successfully"),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get comments ─────────────────────────────────────────────────────────────

const getTicketCommentsController = async (req, res, next) => {
  try {
    const ticketId = req.params.ticketId || req.params.id;

    // Validate ticket ID format
    if (!ticketId) {
      return next(new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return next(new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"));
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return next(new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found"));
    }

    if (!canAccessTicket(ticket, req.user)) {
      return next(new ApiError(403, "ACCESS_DENIED", "Access forbidden"));
    }

    // Fetch all comments for the ticket (chronological order)
    const comments = await Comment.find({ ticket: ticketId })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json(
      new ApiResponse({ items: comments }, "Comments fetched successfully"),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Delete comment ───────────────────────────────────────────────────────────

const deleteCommentController = async (req, res, next) => {
  try {
    const ticketId = req.params.ticketId || req.params.id;
    const { commentId } = req.params;

    // Validate IDs
    if (!ticketId || !commentId) {
      return next(
        new ApiError(400, "ID_REQUIRED", "Ticket ID and Comment ID are required"),
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(ticketId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return next(
        new ApiError(400, "INVALID_ID", "Invalid ticket or comment ID format"),
      );
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new ApiError(404, "COMMENT_NOT_FOUND", "Comment not found"));
    }

    // Check if comment belongs to the ticket
    if (comment.ticket.toString() !== ticketId) {
      return next(
        new ApiError(400, "COMMENT_TICKET_MISMATCH", "Comment does not belong to this ticket"),
      );
    }

    // Authorization: Only comment author or admin can delete
    if (
      comment.author.toString() !== req.user.id &&
      !["admin", "super_admin"].includes(req.user.role)
    ) {
      return next(
        new ApiError(403, "DELETE_FORBIDDEN", "You can only delete your own comments"),
      );
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
      new ApiResponse({ commentId }, "Comment deleted successfully"),
    );
  } catch (error) {
    next(error);
  }
};

export {
  createCommentController,
  getTicketCommentsController,
  deleteCommentController,
};
