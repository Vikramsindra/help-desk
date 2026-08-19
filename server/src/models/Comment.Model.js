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
  },
  { timestamps: true },
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
