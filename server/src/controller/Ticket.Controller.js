import Ticket from "../models/Ticket.Model.js";
import { ticketSchema } from "../utils/Schema.Validation";

const createTicket = async (req, res) => {
    try {

        const { value, error } = ticketSchema.validate(req.body);

        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const ticket = new Ticket({
            ...value,
            createdBy: req.user.id
        });

        await ticket.save();

        return res.status(201).json({
            message: "Ticket created successfully",
            ticket
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
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
                totalPages: Math.ceil(totalTickets / limit)
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getMyTicketsController = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            createdBy: req.user.id
        })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            tickets
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export { createTicket, getAllTicketsController, getMyTicketsController };