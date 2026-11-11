import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.ObjectId,
      ref: "ticket",
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

commentSchema.index({ ticket: 1, createdAt: 1 });

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
