import Notification from "../models/Notification.Model.js";
import User from "../models/User.Model.js";
import { emitToUsers } from "../realtime/socket.js";

const createNotifications = async ({
  userIds,
  userFilter,
  ticketId = null,
  type,
  message,
  excludeUserId,
}) => {
  try {
    const recipients =
      userIds ||
      (await User.find({
        ...userFilter,
        $or: [{ isActive: true }, { isActive: { $exists: false } }],
      }).distinct("_id"));
    const uniqueIds = [
      ...new Set(recipients.filter(Boolean).map(String)),
    ].filter((id) => id !== String(excludeUserId || ""));
    if (!uniqueIds.length) return;

    const notifications = await Notification.insertMany(
      uniqueIds.map((user) => ({ user, ticket: ticketId, type, message })),
      { ordered: false },
    );
    notifications.forEach((notification) => {
      emitToUsers(
        [notification.user],
        "notification:new",
        notification.toObject(),
      );
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Notification dispatch failed", error);
    }
  }
};

export { createNotifications };
