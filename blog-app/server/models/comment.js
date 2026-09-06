import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ blog: 1, isApproved: 1, createdAt: -1 });
commentSchema.index({ blog: 1, parentId: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
