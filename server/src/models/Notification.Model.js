import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    ticket: {
      type: mongoose.Schema.ObjectId,
      ref: "ticket",
      default: null,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: [
        "ticket_created",
        "ticket_assigned",
        "ticket_updated",
        "ticket_deleted",
        "comment_added",
      ],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
