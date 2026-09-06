import Discussion from "../models/discussion.js";
import sanitizeHtml from "sanitize-html";

const sanitizeDiscussionContent = (value) => sanitizeHtml(value || "", {
  allowedTags: ["p", "br", "h1", "h2", "h3", "h4", "strong", "em", "u", "blockquote", "ul", "ol", "li", "a", "code", "pre", "span"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }) },
});

const sanitizePlainText = (value) => sanitizeHtml(value || "", {
  allowedTags: [],
  allowedAttributes: {},
}).trim();

// GET all discussions (with filter, search, sort)
export const getAllDiscussions = async (req, res) => {
  try {
    const { category, sort = "latest", search } = req.query;

    const query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
        { tags: { $regex: search.trim(), $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "top") {
      sortOption = { upvotes: -1, createdAt: -1 };
    } else if (sort === "replies") {
      sortOption = { "replies.length": -1, createdAt: -1 };
    }

    const discussions = await Discussion.find(query).sort(sortOption).limit(50);
    return res.json({ success: true, discussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch discussions" });
  }
};

// GET discussion by ID (increments views)
export const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    const discussion = await Discussion.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!discussion) {
      return res.status(404).json({ success: false, message: "Discussion topic not found" });
    }

    return res.json({ success: true, discussion });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch discussion" });
  }
};

// POST create discussion
export const createDiscussion = async (req, res) => {
  try {
    const { title, content, authorName, authorAvatar, authorRole, category, tags } = req.body;

    const cleanTitle = sanitizePlainText(title);
    const cleanContent = sanitizeDiscussionContent(content);

    if (!cleanTitle || !cleanContent) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required for a discussion topic.",
      });
    }

    const cleanAuthorName = sanitizePlainText(authorName) || "Independent Thinker";
    const cleanCategory = sanitizePlainText(category) || "Ideas";
    const rawTags = Array.isArray(tags) ? tags : tags ? String(tags).split(",").map((t) => t.trim()) : [];
    const cleanTags = rawTags.map((t) => sanitizePlainText(t)).filter(Boolean);

    const newDiscussion = new Discussion({
      title: cleanTitle,
      content: cleanContent,
      authorName: cleanAuthorName,
      authorAvatar: authorAvatar || "",
      authorRole: sanitizePlainText(authorRole) || "Contributor",
      category: cleanCategory,
      tags: cleanTags,
    });

    await newDiscussion.save();
    return res.status(201).json({ success: true, discussion: newDiscussion });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return res.status(500).json({ success: false, message: "Failed to create discussion" });
  }
};

// POST add reply
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, authorName, authorAvatar, authorRole } = req.body;

    const cleanContent = sanitizeDiscussionContent(content);
    if (!cleanContent) {
      return res.status(400).json({ success: false, message: "Reply content cannot be empty" });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ success: false, message: "Discussion topic not found" });
    }

    const newReply = {
      content: cleanContent,
      authorName: sanitizePlainText(authorName) || "Community Voice",
      authorAvatar: authorAvatar || "",
      authorRole: sanitizePlainText(authorRole) || "Member",
      upvotes: 0,
      upvotedBy: [],
    };

    discussion.replies.push(newReply);
    await discussion.save();

    return res.status(201).json({ success: true, discussion });
  } catch (error) {
    console.error("Error adding reply:", error);
    return res.status(500).json({ success: false, message: "Failed to post reply" });
  }
};

// POST toggle upvote
export const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId = "guest_" + req.ip } = req.body;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ success: false, message: "Discussion not found" });
    }

    const hasUpvoted = discussion.upvotedBy.includes(userId);
    if (hasUpvoted) {
      discussion.upvotes = Math.max(0, discussion.upvotes - 1);
      discussion.upvotedBy = discussion.upvotedBy.filter((u) => u !== userId);
    } else {
      discussion.upvotes += 1;
      discussion.upvotedBy.push(userId);
    }

    await discussion.save();
    return res.json({ success: true, upvotes: discussion.upvotes, hasUpvoted: !hasUpvoted });
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return res.status(500).json({ success: false, message: "Failed to toggle upvote" });
  }
};
