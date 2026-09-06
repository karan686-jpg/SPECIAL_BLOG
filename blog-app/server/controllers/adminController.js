import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const issueAdminToken = () => jwt.sign(
  { role: "admin" }, process.env.JWT_SECRET,
  { subject: "admin", expiresIn: "2h", issuer: "blogify-api", audience: "blogify-client" },
);

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: "Invalid administrator credentials" });
  return res.json({ success: true, token: issueAdminToken(), user: { id: "admin", role: "admin", name: "Admin", email } });
};

export const getAllBlogsAdmin = async (_req, res) => {
  try {
    return res.json({ success: true, blogs: await Blog.find({}).sort({ createdAt: -1 }).limit(100) });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load blogs" });
  }
};

export const getAllComments = async (_req, res) => {
  try {
    return res.json({ success: true, comments: await Comment.find({}).populate("blog", "title").sort({ createdAt: -1 }).limit(200) });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load comments" });
  }
};

export const getDashboard = async (_req, res) => {
  try {
    const [recentBlogs, blogs, comments, drafts] = await Promise.all([Blog.find({}).sort({ createdAt: -1 }).limit(5), Blog.countDocuments(), Comment.countDocuments(), Blog.countDocuments({ isPublished: false })]);
    return res.json({ success: true, dashboardData: { blogs, comments, drafts, recentBlogs } });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load dashboard" });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.body.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    await Promise.all([
      Comment.findByIdAndDelete(req.body.id),
      Comment.deleteMany({ parentId: req.body.id }),
    ]);
    return res.json({ success: true, message: "Comment deleted successfully" });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid comment id" });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.body.id, { isApproved: true }, { new: true });
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    return res.json({ success: true, message: "Comment approved successfully" });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid comment id" });
  }
};
