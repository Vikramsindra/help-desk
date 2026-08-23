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

ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ createdAt: -1 });

const Ticket = mongoose.model("ticket", ticketSchema);

export default Ticket;
