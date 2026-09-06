import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
      default: "Anonymous Thinker",
    },
    authorAvatar: {
      type: String,
      default: "",
    },
    authorRole: {
      type: String,
      default: "Member",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    authorName: {
      type: String,
      required: true,
      default: "Anonymous Thinker",
    },
    authorAvatar: {
      type: String,
      default: "",
    },
    authorRole: {
      type: String,
      default: "Writer",
    },
    category: {
      type: String,
      required: true,
      default: "Ideas",
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    replies: [replySchema],
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

discussionSchema.index({ category: 1, createdAt: -1 });
discussionSchema.index({ upvotes: -1, createdAt: -1 });
discussionSchema.index({ title: "text", content: "text" });

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;
