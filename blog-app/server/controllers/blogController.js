import imagekit from "../config/imagekit.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sanitizeHtml from "sanitize-html";
import { toFile } from "@imagekit/nodejs";

const categories = new Set(["Lifestyle", "Technology", "Startup", "Finance", "Creative"]);
const sanitizeArticle = (value) => sanitizeHtml(value || "", {
  allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "em", "u", "blockquote", "ul", "ol", "li", "a", "code", "pre"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }) },
});

const sanitizeComment = (value) => sanitizeHtml(value || "", {
  allowedTags: ["b", "i", "em", "strong", "code", "pre", "br", "p", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https"],
  transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }) },
});

const sanitizePlainText = (value) => sanitizeHtml(value || "", {
  allowedTags: [],
  allowedAttributes: {},
}).trim();

const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
const isAdmin = (req) => req.auth?.role === "admin";
const canManage = (req, blog) => isAdmin(req) || (req.user && blog.author?.toString() === req.user);

export const addBlog = async (req, res) => {
  try {
    const payload = JSON.parse(req.body.blog || "{}");
    const title = sanitizePlainText(payload.title);
    const subtitle = sanitizePlainText(payload.subtitle || "");
    const category = sanitizePlainText(payload.category);
    const description = sanitizeArticle(payload.description);
    if (!title || !description || !category || !req.file) return res.status(400).json({ success: false, message: "A title, category, article body, and supported image are required" });
    if (title.length > 180 || subtitle.length > 300) return res.status(400).json({ success: false, message: "Title or subtitle is too long" });

    const uploaded = await imagekit.files.upload({ file: await toFile(req.file.buffer, req.file.originalname, { type: req.file.mimetype }), fileName: req.file.originalname, folder: "/blogs" });
    const image = imagekit.helper.buildSrc({ urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, src: uploaded.filePath, transformation: [{ format: "webp", width: 1280, quality: "auto" }] });
    const author = isAdmin(req) ? null : req.user;
    const user = author ? await User.findById(author).select("name") : null;
    let scheduledFor = null;
    if (payload.scheduledFor) {
      const parsedDate = new Date(payload.scheduledFor);
      if (!Number.isNaN(parsedDate.getTime())) {
        scheduledFor = parsedDate;
      }
    }
    const blog = await Blog.create({
      title,
      subtitle,
      category,
      description,
      image,
      isPublished: payload.isPublished === true,
      scheduledFor,
      author,
      authorName: user?.name || "Admin",
    });
    return res.status(201).json({ success: true, blog, message: "Blog added successfully" });
  } catch (error) {
    if (error instanceof SyntaxError) return res.status(400).json({ success: false, message: "Invalid blog payload" });
    return res.status(500).json({ success: false, message: "Unable to add blog" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);
    const query = req.query.q?.trim();
    const now = new Date();
    const filter = {
      isPublished: true,
      $or: [{ scheduledFor: null }, { scheduledFor: { $lte: now } }],
    };
    if (req.query.category && typeof req.query.category === "string" && req.query.category !== "All") {
      filter.category = req.query.category.trim().slice(0, 50);
    }
    if (query) filter.$text = { $search: query.slice(0, 100) };
    const [blogs, total] = await Promise.all([Blog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Blog.countDocuments(filter)]);
    return res.json({ success: true, blogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load blogs" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId).populate("author", "name profileImage");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    const isLive = blog.isPublished && (!blog.scheduledFor || new Date(blog.scheduledFor) <= new Date());
    if (!isLive && !canManage(req, blog)) return res.status(404).json({ success: false, message: "Blog not found" });
    if (isLive) {
      const today = new Date().toISOString().slice(0, 10);
      const hasToday = (blog.dailyViews || []).some((d) => d.date === today);
      if (hasToday) {
        await Blog.updateOne({ _id: blog._id, "dailyViews.date": today }, { $inc: { views: 1, "dailyViews.$.count": 1 } });
      } else {
        await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 }, $push: { dailyViews: { date: today, count: 1 } } });
      }
    }
    const blogObj = blog.toObject();
    if (!blogObj.reactions) {
      blogObj.reactions = { heart: blogObj.likes || [], clap: [], insight: [], fire: [] };
    }
    return res.json({ success: true, blog: { ...blogObj, views: blog.views + (isLive ? 1 : 0) } });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid blog id" });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.body.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (!canManage(req, blog)) return res.status(403).json({ success: false, message: "You cannot delete this blog" });
    await Promise.all([blog.deleteOne(), Comment.deleteMany({ blog: blog._id })]);
    return res.json({ success: true, message: "Blog deleted successfully" });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid blog id" });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.body.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (!canManage(req, blog)) return res.status(403).json({ success: false, message: "You cannot change this blog" });

    // If blog is currently scheduled for the future, make it live immediately
    if (blog.scheduledFor && new Date(blog.scheduledFor) > new Date()) {
      blog.scheduledFor = null;
      blog.isPublished = true;
      await blog.save();
      return res.json({ success: true, message: "Scheduled story published live immediately!", blog });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();
    return res.json({ success: true, message: `Blog ${blog.isPublished ? "published" : "unpublished"}`, blog });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid blog id" });
  }
};

export const addComment = async (req, res) => {
  try {
    const blogId = req.body.blog;
    const parentId = req.body.parentId || null;
    const rawContent = req.body.content?.trim();
    if (!rawContent || rawContent.length > 2000) return res.status(400).json({ success: false, message: "Comment must contain 1–2000 characters" });
    const content = sanitizeComment(rawContent);
    if (!content) return res.status(400).json({ success: false, message: "Comment content is invalid" });
    const blog = await Blog.findOne({ _id: blogId, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (parentId) {
      const parentExists = await Comment.exists({ _id: parentId, blog: blog._id });
      if (!parentExists) return res.status(400).json({ success: false, message: "Parent comment not found" });
    }
    let name = sanitizePlainText(req.body.name?.trim() || "Anonymous");
    let user = null;
    if (req.user) {
      if (isAdmin(req)) {
        name = "Admin";
      } else {
        user = await User.findById(req.user).select("name");
        name = user?.name || "Member";
      }
    }
    const comment = await Comment.create({ blog: blog._id, parentId, name: name.slice(0, 80), content, user: user?._id, isApproved: Boolean(req.user) });
    return res.status(201).json({ success: true, comment, message: req.user ? "Comment posted" : "Comment submitted for review" });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid comment data" });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.body.blogId, isApproved: true }).populate("user", "name profileImage").sort({ createdAt: 1 }).limit(200);
    return res.json({ success: true, comments });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid blog id" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    if (isAdmin(req)) {
      return res.status(400).json({ success: false, message: "Admin accounts cannot like posts" });
    }
    const blog = await Blog.findOne({ _id: req.body.blogId, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    const alreadyLiked = blog.likes.some((id) => id.toString() === req.user);
    const update = alreadyLiked ? { $pull: { likes: req.user } } : { $addToSet: { likes: req.user } };
    const updatedBlog = await Blog.findByIdAndUpdate(blog._id, update, { new: true });
    return res.json({ success: true, likes: updatedBlog.likes });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid blog id" });
  }
};

export const toggleReaction = async (req, res) => {
  try {
    if (isAdmin(req)) {
      return res.status(400).json({ success: false, message: "Admin accounts cannot react to posts" });
    }
    const { blogId, reactionType } = req.body;
    const validTypes = new Set(["heart", "clap", "insight", "fire"]);
    if (!validTypes.has(reactionType)) {
      return res.status(400).json({ success: false, message: "Invalid reaction type" });
    }

    const blog = await Blog.findOne({ _id: blogId, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (!blog.reactions) {
      blog.reactions = { heart: blog.likes || [], clap: [], insight: [], fire: [] };
    }

    const currentList = blog.reactions[reactionType] || [];
    const alreadyReacted = currentList.some((id) => id.toString() === req.user);
    const field = `reactions.${reactionType}`;
    const update = alreadyReacted
      ? { $pull: { [field]: req.user } }
      : { $addToSet: { [field]: req.user } };

    if (reactionType === "heart") {
      if (alreadyReacted) update.$pull.likes = req.user;
      else update.$addToSet.likes = req.user;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blog._id, update, { new: true });
    return res.json({ success: true, reactions: updatedBlog.reactions, likes: updatedBlog.likes });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid reaction request" });
  }
};

export const getAnalytics = async (req, res) => {
  if (isAdmin(req)) return res.status(403).json({ success: false, message: "Analytics are available for authors" });
  try {
    const blogs = await Blog.find({ author: req.user }).select("title subtitle image views likes category dailyViews createdAt");
    const totalViews = blogs.reduce((total, blog) => total + blog.views, 0);
    const totalLikes = blogs.reduce((total, blog) => total + (blog.likes?.length || 0), 0);
    const mostPopularBlog = blogs.reduce((best, blog) => !best || blog.views > best.views ? blog : best, null);

    // Get total comments and per-blog comments
    const blogIds = blogs.map((b) => b._id);
    const commentCounts = await Comment.aggregate([
      { $match: { blog: { $in: blogIds } } },
      { $group: { _id: "$blog", count: { $sum: 1 } } },
    ]);
    const commentCountMap = {};
    let totalComments = 0;
    commentCounts.forEach((c) => {
      commentCountMap[c._id.toString()] = c.count;
      totalComments += c.count;
    });

    // 7-day views trend
    const viewsTrend7d = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      let dayViews = 0;
      blogs.forEach((b) => {
        const found = (b.dailyViews || []).find((v) => v.date === dateStr);
        if (found) dayViews += found.count;
      });
      viewsTrend7d.push({ date: label, views: dayViews });
    }

    // Fallback for trend curve if totalViews > 0 but newly tracked
    const trendSum = viewsTrend7d.reduce((sum, item) => sum + item.views, 0);
    if (trendSum === 0 && totalViews > 0) {
      viewsTrend7d[viewsTrend7d.length - 1].views = totalViews;
    }

    // Engagement breakdown (Likes vs Comments per blog)
    const engagementBreakdown = blogs.map((b) => ({
      name: b.title.length > 16 ? b.title.slice(0, 14) + "..." : b.title,
      fullTitle: b.title,
      likes: b.likes?.length || 0,
      comments: commentCountMap[b._id.toString()] || 0,
      views: b.views || 0,
    }));

    return res.json({
      success: true,
      analytics: {
        totalViews,
        totalLikes,
        totalComments,
        totalBlogs: blogs.length,
        mostPopularBlog,
        viewsTrend7d,
        engagementBreakdown,
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load analytics" });
  }
};

export const generateAIContent = async (req, res) => {
  const prompt = req.body.prompt?.trim();
  if (!prompt || prompt.length > 200) return res.status(400).json({ success: false, message: "Provide a topic up to 200 characters" });
  const safePrompt = escapeHtml(prompt);
  const fallbackHtml = `<h2>Introduction to ${safePrompt}</h2><p>Use this draft as a starting point, then add your own research, examples, and point of view.</p><h3>Key ideas</h3><ul><li>Define the topic clearly.</li><li>Support claims with credible sources.</li><li>End with practical next steps.</li></ul>`;
  if (!process.env.GEMINI_API_KEY) return res.json({ success: true, content: fallbackHtml, source: "template" });
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const result = await genAI.getGenerativeModel({ model: "gemini-3.6-flash" }).generateContent(`Write a factual blog draft about: "${prompt}". Return only safe semantic HTML using h2, h3, p, ul, ol, li, strong, em, and a tags. Do not include scripts, styles, iframes, or event handlers.`);
    let rawText = result.response.text().trim();
    rawText = rawText.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    return res.json({ success: true, content: sanitizeArticle(rawText), source: "gemini" });
  } catch {
    return res.json({ success: true, content: fallbackHtml, source: "template" });
  }
};

export const aiBlogAssistant = async (req, res) => {
  try {
    const { action, text, title } = req.body;
    const cleanText = (text || "").replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

    if (!cleanText || cleanText.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please write at least a sentence in the article editor first.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured on the server.",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: action === "readability" ? "text/plain" : "application/json",
      },
    });

    let prompt = "";
    if (action === "grammar") {
      prompt = `You are a professional copyeditor. Analyze this article text for grammar, spelling, typos, and phrasing flaws.
Return a JSON array of objects with keys:
- "original": the text with the issue
- "suggestion": the corrected replacement text
- "explanation": a concise reason for the correction
If there are no grammar issues, return an empty array [].
Text to check:
"""${cleanText.slice(0, 4000)}"""`;
    } else if (action === "readability") {
      prompt = `You are an elite blog writing editor. Rewrite this blog article text to maximize engagement, clarity, flow, and modern readability.
Improve paragraph cadence, eliminate fluff, and make headings punchy.
Preserve semantic HTML formatting (<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>).
Do NOT include backticks or markdown fences.
Original Content:
"""${text.slice(0, 5000)}"""`;
    } else if (action === "titles") {
      prompt = `Based on this blog article, generate 5 catchy, high-CTR, SEO-optimized title ideas in distinct styles (e.g. Action-Oriented, Question, Ultimate Guide, Deep Dive, Curiosity).
Return a JSON array of 5 title strings:
["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]
Content:
"""${cleanText.slice(0, 3000)}"""`;
    } else if (action === "summarize") {
      prompt = `Summarize this blog article for readers.
Return JSON with this exact schema:
{
  "tldr": "A sharp 1-2 sentence executive summary",
  "keyTakeaways": ["Key bullet 1", "Key bullet 2", "Key bullet 3"]
}
Content:
"""${cleanText.slice(0, 4000)}"""`;
    } else if (action === "seo") {
      prompt = `Generate an optimal SEO meta description (strictly 130 to 160 characters long) and 4 focus keywords for search engines.
Return JSON with this exact schema:
{
  "metaDescription": "Concise 130-160 character description...",
  "focusKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "seoTip": "Brief tip on ranking this post"
}
Title: "${(title || "").slice(0, 150)}"
Content:
"""${cleanText.slice(0, 3000)}"""`;
    } else if (action === "tags") {
      prompt = `Suggest 6 to 8 trending, relevant tags/topics for this blog post.
Return a JSON array of strings:
["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]
Title: "${(title || "").slice(0, 150)}"
Content:
"""${cleanText.slice(0, 3000)}"""`;
    } else if (action === "duplicate") {
      const existingBlogs = await Blog.find({}, "title description").limit(20).lean();
      const existingSnippets = existingBlogs.map((b) => ({
        title: b.title,
        excerpt: (b.description || "").replace(/<[^>]*>?/gm, " ").slice(0, 120),
      }));

      prompt = `You are a blog uniqueness and similarity detection agent.
Compare this draft against existing articles on this platform:
Existing platform posts: ${JSON.stringify(existingSnippets)}

Current Draft Title: "${(title || "").slice(0, 150)}"
Current Draft Text: """${cleanText.slice(0, 3000)}"""

Evaluate if this draft is a duplicate, copy, or too similar to an existing post.
Return JSON with this exact schema:
{
  "riskLevel": "Low" | "Moderate" | "High",
  "similarityScore": number between 0 and 100,
  "verdict": "Clear summary of uniqueness status",
  "matchedTitles": ["Title of any matched existing post, or empty array"],
  "recommendation": "Advice on how to make this post unique"
}`;
    } else {
      return res.status(400).json({ success: false, message: "Invalid assistant action requested." });
    }

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();

    if (action === "readability") {
      rawText = rawText
        .replace(/^```html\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return res.json({ success: true, action, content: sanitizeArticle(rawText) });
    }

    let parsedData;
    try {
      const cleanJson = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = { raw: rawText };
    }

    return res.json({ success: true, action, data: parsedData });
  } catch (error) {
    console.error("aiBlogAssistant error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI suggestions.",
    });
  }
};
