import Ticket from "../models/Ticket.Model.js";
import User from "../models/User.Model.js";
import mongoose from "mongoose";
import {
  ticketSchema,
  userTicketUpdateSchema,
  agentTicketUpdateSchema,
  adminTicketUpdateSchema,
  ticketListQuerySchema,
  ticketAssignSchema,
} from "../utils/Schema.Validation.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { escapeRegex } from "../utils/utils.functions.js";
import { createNotifications } from "../utils/notification.functions.js";
import { emitToStaff, emitToUsers } from "../realtime/socket.js";

const parseTicketListOptions = (query) => {
  const { value, error } = ticketListQuerySchema.validate(query);
  if (error) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      error.details[0].message,
      error.details,
    );
  }

  const filter = {};
  if (value.status) filter.status = value.status;
  if (value.priority) filter.priority = value.priority;
  if (value.category) filter.category = value.category;
  if (value.search) {
    const escapedSearch = escapeRegex(value.search);
    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const sort = { [value.sortBy]: value.sortOrder === "asc" ? 1 : -1 };
  if (value.sortBy === "assignedAt") sort.updatedAt = -1;

  return {
    filter,
    page: value.page,
    limit: value.limit,
    skip: (value.page - 1) * value.limit,
    sort,
  };
};

const fetchTicketPage = async ({ filter, page, limit, skip, sort }) => {
  const [tickets, totalItems] = await Promise.all([
    Ticket.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  return {
    items: tickets,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const countByField = async (match, field) => {
  const grouped = await Ticket.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(grouped.map(({ _id, count }) => [_id, count]));
};

const getDashboardStatsController = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    let data;

    if (req.user.role === "user") {
      const counts = await countByField({ createdBy: userId }, "status");
      data = {
        totalTickets: Object.values(counts).reduce(
          (sum, count) => sum + count,
          0,
        ),
        openTickets: counts.open || 0,
        inProgressTickets: counts["in progress"] || 0,
        resolvedTickets: counts.resolved || 0,
      };
    } else if (req.user.role === "agent") {
      const counts = await countByField({ assignedTo: userId }, "status");
      data = {
        assignedTickets: Object.values(counts).reduce(
          (sum, count) => sum + count,
          0,
        ),
        pendingTickets: counts.open || 0,
        inProgressTickets: counts["in progress"] || 0,
        resolvedTickets: counts.resolved || 0,
      };
    } else if (["admin", "super_admin"].includes(req.user.role)) {
      const [
        totalTickets,
        totalUsers,
        totalAgents,
        totalAdministrators,
        ticketsByStatus,
        ticketsByPriority,
      ] = await Promise.all([
        Ticket.countDocuments(),
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "agent" }),
        User.countDocuments({ role: "admin" }),
        countByField({}, "status"),
        countByField({}, "priority"),
      ]);

      data = {
        totalTickets,
        totalUsers,
        totalAgents,
        totalAdministrators,
        ticketsByStatus: {
          open: ticketsByStatus.open || 0,
          "in progress": ticketsByStatus["in progress"] || 0,
          resolved: ticketsByStatus.resolved || 0,
          closed: ticketsByStatus.closed || 0,
        },
        ticketsByPriority: {
          low: ticketsByPriority.low || 0,
          medium: ticketsByPriority.medium || 0,
          high: ticketsByPriority.high || 0,
        },
      };
    } else {
      return next(new ApiError(403, "ACCESS_DENIED", "Access forbidden"));
    }

    return res
      .status(200)
      .json(new ApiResponse(data, "Dashboard statistics fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Create ──────────────────────────────────────────────────────────────────

const createTicket = async (req, res, next) => {
  try {
    const { value, error } = ticketSchema.validate(req.body);

    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const ticket = new Ticket({
      ...value,
      createdBy: req.user.id,
      status: "open",
      assignedTo: null,
    });

    await ticket.save();

    await createNotifications({
      userFilter: { role: { $in: ["admin", "super_admin"] } },
      ticketId: ticket._id,
      type: "ticket_created",
      message: `New ticket created: ${ticket.title}`,
      excludeUserId: req.user.id,
    });
    await emitToStaff("ticket:created", ticket.toObject(), req.user.id);

    return res
      .status(201)
      .json(new ApiResponse(ticket, "Ticket created successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── List (admin) ─────────────────────────────────────────────────────────────

const getAllTicketsController = async (req, res, next) => {
  try {
    const options = parseTicketListOptions(req.query);
    const data = await fetchTicketPage(options);

    return res
      .status(200)
      .json(new ApiResponse(data, "Tickets fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── My tickets ───────────────────────────────────────────────────────────────

const getMyTicketsController = async (req, res, next) => {
  try {
    const options = parseTicketListOptions(req.query);
    options.filter.createdBy = req.user.id;
    const data = await fetchTicketPage(options);

    return res
      .status(200)
      .json(new ApiResponse(data, "My tickets fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Assigned tickets ─────────────────────────────────────────────────────────

const getAssignedTicketsController = async (req, res, next) => {
  try {
    const options = parseTicketListOptions(req.query);
    options.filter.assignedTo = req.user.id;
    const data = await fetchTicketPage(options);

    return res
      .status(200)
      .json(new ApiResponse(data, "Assigned tickets fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Ticket detail ────────────────────────────────────────────────────────────

const getTicketDetailController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(
        new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"),
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"),
      );
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
        new ApiError(
          404,
          "TICKET_NOT_FOUND",
          "Ticket not found or access denied",
        ),
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(ticket, "Ticket fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

const deleteTicketController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(
        new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"),
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"),
      );
    }

    let query = { _id: id };

    // User can delete only their own ticket
    if (req.user.role === "user") {
      query.createdBy = req.user.id;
    }

    // Agent is not allowed to delete
    else if (req.user.role === "agent") {
      return next(
        new ApiError(
          403,
          "AGENT_DELETE_FORBIDDEN",
          "Agents are not allowed to delete tickets",
        ),
      );
    }

    // Admin can delete any ticket
    else if (!["admin", "super_admin"].includes(req.user.role)) {
      return next(new ApiError(403, "ACCESS_DENIED", "Access forbidden"));
    }

    let ticket;
    if (req.user.role === "user") {
      ticket = await Ticket.findOneAndDelete({ ...query, status: "open" });
      if (!ticket && (await Ticket.exists(query))) {
        return next(
          new ApiError(
            403,
            "TICKET_DELETE_FORBIDDEN",
            "Customers can delete only their own open tickets",
          ),
        );
      }
    } else {
      ticket = await Ticket.findOneAndDelete(query);
    }

    if (!ticket) {
      return next(
        new ApiError(
          404,
          "TICKET_NOT_FOUND",
          "Ticket not found or access denied",
        ),
      );
    }

    await createNotifications({
      userIds: [ticket.createdBy, ticket.assignedTo],
      ticketId: ticket._id,
      type: "ticket_deleted",
      message: `Ticket deleted: ${ticket.title}`,
      excludeUserId: req.user.id,
    });
    emitToUsers([ticket.createdBy, ticket.assignedTo], "ticket:deleted", {
      ticketId: ticket._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          { ticketId: ticket._id },
          "Ticket deleted successfully",
        ),
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
      return next(
        new ApiError(400, "TICKET_ID_REQUIRED", "Ticket ID is required"),
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ApiError(400, "INVALID_TICKET_ID", "Invalid ticket ID format"),
      );
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
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
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
        new ApiError(
          404,
          "TICKET_NOT_FOUND",
          "Ticket not found or access denied",
        ),
      );
    }

    if (Object.keys(value).length) {
      await createNotifications({
        userIds: [ticket.createdBy?._id, ticket.assignedTo?._id],
        ticketId: ticket._id,
        type: "ticket_updated",
        message: `Ticket updated: ${ticket.title}`,
        excludeUserId: req.user.id,
      });
      emitToUsers(
        [ticket.createdBy?._id, ticket.assignedTo?._id],
        "ticket:updated",
        ticket.toObject(),
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(ticket, "Ticket updated successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Assign ───────────────────────────────────────────────────────────────────

const assignTicketController = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { value, error } = ticketAssignSchema.validate(req.body);
    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }
    const { assignedTo } = value;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return next(
        new ApiError(400, "INVALID_ID", "Invalid ticket or assignee ID"),
      );
    }

    const [ticket, agent] = await Promise.all([
      Ticket.findById(ticketId),
      User.findOne({
        _id: assignedTo,
        role: "agent",
        isActive: { $ne: false },
      }),
    ]);

    if (!ticket) {
      return next(new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found"));
    }

    if (!agent) {
      return next(
        new ApiError(
          404,
          "AGENT_NOT_FOUND",
          "Assignee not found or is not an agent",
        ),
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { assignedTo: agent._id, assignedAt: new Date() } },
      { new: true, runValidators: true },
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    await createNotifications({
      userIds: [agent._id, ticket.createdBy],
      ticketId: updatedTicket._id,
      type: "ticket_assigned",
      message: `Ticket assigned: ${ticket.title}`,
      excludeUserId: req.user.id,
    });
    emitToUsers(
      [agent._id, ticket.createdBy],
      "ticket:assigned",
      updatedTicket.toObject(),
    );

    return res
      .status(200)
      .json(new ApiResponse(updatedTicket, "Ticket assigned successfully"));
  } catch (error) {
    next(error);
  }
};

export {
  createTicket,
  getAllTicketsController,
  getMyTicketsController,
  getAssignedTicketsController,
  getDashboardStatsController,
  getTicketDetailController,
  deleteTicketController,
  updateTicketController,
  assignTicketController,
};
