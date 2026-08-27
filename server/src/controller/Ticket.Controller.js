import Ticket from "../models/Ticket.Model.js";
import User from "../models/User.Model.js";
import mongoose from "mongoose";
import {
  ticketSchema,
  userTicketUpdateSchema,
  agentTicketUpdateSchema,
  adminTicketUpdateSchema,
} from "../utils/Schema.Validation.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// ─── Create ──────────────────────────────────────────────────────────────────

const createTicket = async (req, res, next) => {
  try {
    const { value, error } = ticketSchema.validate(req.body);

    if (error) {
      return next(
        new ApiError(400, "VALIDATION_ERROR", error.details[0].message, error.details),
      );
    }

    const ticket = new Ticket({
      ...value,
      createdBy: req.user.id,
      status: "open",
      assignedTo: null,
    });

    await ticket.save();

    return res.status(201).json(
      new ApiResponse(ticket, "Ticket created successfully"),
    );
  } catch (error) {
    next(error);
  }
};

// ─── List (admin) ─────────────────────────────────────────────────────────────

const getAllTicketsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const [tickets, totalItems] = await Promise.all([
      Ticket.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ticket.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json(
      new ApiResponse(
        {
          items: tickets,
          pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
        "Tickets fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

// ─── My tickets ───────────────────────────────────────────────────────────────

const getMyTicketsController = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(
        { items: tickets },
        "My tickets fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Assigned tickets ─────────────────────────────────────────────────────────

const getAssignedTicketsController = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(
      new ApiResponse(
        { items: tickets },
        "Assigned tickets fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Ticket detail ────────────────────────────────────────────────────────────

const getTicketDetailController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"));
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"));
    }

    let query = { _id: id };

    if (req.user.role === "user") {
      query.createdBy = req.user.id;
    } else if (req.user.role === "agent") {
      query.assignedTo = req.user.id;
    } else if (!["admin", "super_admin"].includes(req.user.role)) {
      return next(new ApiError(403, "ACCESS_DENIED", "Access forbidden"));
    }

    const ticket = await Ticket.findOne(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) {
      return next(
        new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found or access denied"),
      );
    }

    return res.status(200).json(
      new ApiResponse(ticket, "Ticket fetched successfully"),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

const deleteTicketController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"));
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"));
    }

    let query = { _id: id };

    // User can delete only their own ticket
    if (req.user.role === "user") {
      query.createdBy = req.user.id;
    }

    // Agent is not allowed to delete
    else if (req.user.role === "agent") {
      return next(
        new ApiError(403, "AGENT_DELETE_FORBIDDEN", "Agents are not allowed to delete tickets"),
      );
    }

    // Admin can delete any ticket
    else if (!["admin", "super_admin"].includes(req.user.role)) {
      return next(new ApiError(403, "ACCESS_DENIED", "Access forbidden"));
    }

    const ticket = await Ticket.findOneAndDelete(query);

    if (!ticket) {
      return next(
        new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found or access denied"),
      );
    }

    return res.status(200).json(
      new ApiResponse({ ticketId: ticket._id }, "Ticket deleted successfully"),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Update ───────────────────────────────────────────────────────────────────

const updateTicketController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"));
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"));
    }

    // Build query based on role
    let query = { _id: id };

    if (req.user.role === "user") {
      query.createdBy = req.user.id;
    } else if (req.user.role === "agent") {
      query.assignedTo = req.user.id;
    } else if (!["admin", "super_admin"].includes(req.user.role)) {
      return next(new ApiError(403, "ACCESS_DENIED", "Access forbidden"));
    }

    // Validate request body
    const schema =
      req.user.role === "user"
        ? userTicketUpdateSchema
        : req.user.role === "agent"
          ? agentTicketUpdateSchema
          : adminTicketUpdateSchema;

    const { value, error } = schema.validate(req.body);

    if (error) {
      return next(
        new ApiError(400, "VALIDATION_ERROR", error.details[0].message, error.details),
      );
    }

    // Update ticket
    const ticket = await Ticket.findOneAndUpdate(
      query,
      { $set: value },
      { new: true, runValidators: true },
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) {
      return next(
        new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found or access denied"),
      );
    }

    return res.status(200).json(
      new ApiResponse(ticket, "Ticket updated successfully"),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Assign ───────────────────────────────────────────────────────────────────

const assignTicketController = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(ticketId) ||
      !mongoose.Types.ObjectId.isValid(assignedTo || "")
    ) {
      return next(
        new ApiError(400, "INVALID_ID", "Invalid ticket or assignee ID"),
      );
    }

    const [ticket, agent] = await Promise.all([
      Ticket.findById(ticketId),
      User.findOne({ _id: assignedTo, role: "agent" }),
    ]);

    if (!ticket) {
      return next(new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found"));
    }

    if (!agent) {
      return next(new ApiError(404, "AGENT_NOT_FOUND", "Assignee not found or is not an agent"));
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { assignedTo: agent._id } },
      { new: true, runValidators: true },
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    return res.status(200).json(
      new ApiResponse(updatedTicket, "Ticket assigned successfully"),
    );
  } catch (error) {
    next(error);
  }
};

export {
  createTicket,
  getAllTicketsController,
  getMyTicketsController,
  getAssignedTicketsController,
  getTicketDetailController,
  deleteTicketController,
  updateTicketController,
  assignTicketController,
};
