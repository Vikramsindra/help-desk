import mongoose, { Schema } from "mongoose";

const ticketSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in progress", "resolved", "closed"],
      default: "open",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { timestamps: true },
);

const Ticket = mongoose.model("ticket", ticketSchema);

export default Ticket;
