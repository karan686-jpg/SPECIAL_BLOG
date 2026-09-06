import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorName: {
      type: String,
      default: "Admin",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
      reactions: {
        heart: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        clap: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        insight: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        fire: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
      scheduledFor: {
        type: Date,
        default: null,
      },
      dailyViews: [
        {
          date: { type: String, required: true },
          count: { type: Number, default: 0 },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  blogSchema.index({ isPublished: 1, createdAt: -1 });
  blogSchema.index({ isPublished: 1, scheduledFor: 1, createdAt: -1 });
  blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ title: "text", subtitle: "text", category: "text" });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
