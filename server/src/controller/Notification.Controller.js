import mongoose from "mongoose";
import Notification from "../models/Notification.Model.js";
import { notificationListQuerySchema } from "../utils/Schema.Validation.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getNotificationsController = async (req, res, next) => {
  try {
    const { value, error } = notificationListQuerySchema.validate(req.query);
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

    const filter = { user: req.user.id };
    const skip = (value.page - 1) * value.limit;
    const [items, totalItems] = await Promise.all([
      Notification.find(filter)
        .populate("ticket", "title status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(value.limit),
      Notification.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalItems / value.limit);

    return res.status(200).json(
      new ApiResponse(
        {
          items,
          pagination: {
            page: value.page,
            limit: value.limit,
            totalItems,
            totalPages,
            hasNextPage: value.page < totalPages,
            hasPreviousPage: value.page > 1,
          },
        },
        "Notifications fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const markNotificationReadController = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return next(new ApiError(400, "INVALID_ID", "Invalid notification ID"));
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user.id },
      { $set: { isRead: true } },
      { returnDocument: "after", runValidators: true },
    ).populate("ticket", "title status");

    if (!notification) {
      return next(
        new ApiError(404, "NOTIFICATION_NOT_FOUND", "Notification not found"),
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(notification, "Notification marked as read"));
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsReadController = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } },
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          { updatedCount: result.modifiedCount },
          "Notifications marked as read",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
};
