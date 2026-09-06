import express from "express";
import {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  addReply,
  toggleUpvote,
} from "../controllers/discussionController.js";

const discussionRouter = express.Router();

discussionRouter.get("/", getAllDiscussions);
discussionRouter.get("/:id", getDiscussionById);
discussionRouter.post("/", createDiscussion);
discussionRouter.post("/:id/reply", addReply);
discussionRouter.post("/:id/upvote", toggleUpvote);

export default discussionRouter;
