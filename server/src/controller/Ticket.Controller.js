import Ticket from "../models/Ticket.Model.js";
import mongoose from "mongoose";
import {
  ticketSchema,
  updateTicketSchema,
} from "../utils/Schema.Validation.js";

const createTicket = async (req, res) => {
  try {
    const { value, error } = ticketSchema.validate(req.body);

    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const ticket = new Ticket({
      ...value,
      createdBy: req.user.id,
    });

    await ticket.save();

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllTicketsController = async (req, res) => {
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

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTickets = await Ticket.countDocuments(filter);

    return res.status(200).json({
      tickets,
      pagination: {
        page,
        limit,
        totalTickets,
        totalPages: Math.ceil(totalTickets / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMyTicketsController = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      createdBy: req.user.id,
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTicketDetailController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Ticket ID is required",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid ticket ID format",
      });
    }

    let query = { _id: id };

    if (req.user.role === "user") {
      query.createdBy = req.user.id;
    } else if (req.user.role === "agent") {
      query.assignedTo = req.user.id;
    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access forbidden",
      });
    }

    const ticket = await Ticket.findOne(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found or access denied",
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteTicketController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Ticket ID is required",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid ticket ID format",
      });
    }

    let query = { _id: id };

    // User can delete only their own ticket
    if (req.user.role === "user") {
      query.createdBy = req.user.id;
    }

    // Agent is not allowed to delete
    else if (req.user.role === "agent") {
      return res.status(403).json({
        error: "Agents are not allowed to delete tickets",
      });
    }

    // Admin can delete any ticket
    else if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access forbidden",
      });
    }

    const ticket = await Ticket.findOneAndDelete(query);

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found or access denied",
      });
    }

    return res.status(200).json({
      message: "Ticket deleted successfully",
      ticketId: ticket._id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTicketController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Ticket ID is required",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid ticket ID format",
      });
    }

    // Build query based on role
    let query = { _id: id };

    if (req.user.role === "user") {
      query.createdBy = req.user.id;
    } else if (req.user.role === "agent") {
      query.assignedTo = req.user.id;
    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access forbidden",
      });
    }

    // Validate request body
    const { value, error } = updateTicketSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    // Update ticket
    const ticket = await Ticket.findOneAndUpdate(
      query,
      { $set: value },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found or access denied",
      });
    }

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createTicket,
  getAllTicketsController,
  getMyTicketsController,
  getTicketDetailController,
  deleteTicketController,
  updateTicketController,
};
