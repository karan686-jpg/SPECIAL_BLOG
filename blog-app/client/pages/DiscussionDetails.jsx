import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import {
  ArrowLeft,
  ArrowBigUp,
  MessageSquare,
  Eye,
  Tag,
  Send,
  ShieldCheck,
  Sparkles,
  Share2,
} from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function DiscussionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, user } = useContext(AppContext);
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setAuthorName(user.name);
    } else {
      setAuthorName(localStorage.getItem("userName") || "");
    }
  }, [user]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/discussions/${id}`);
      if (data.success) {
        setDiscussion(data.discussion);
      }
    } catch (err) {
      console.error("Failed to fetch discussion", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const handleUpvoteTopic = async () => {
    try {
      const currentUserId = user?._id || user?.id || localStorage.getItem("userId") || "guest";
      const { data } = await axios.post(`/api/discussions/${id}/upvote`, {
        userId: currentUserId,
      });
      if (data.success) {
        setDiscussion((prev) => ({ ...prev, upvotes: data.upvotes }));
      }
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      setIsSubmittingReply(true);
      const resolvedName = authorName.trim() || user?.name || "Thoughtful Contributor";
      const { data } = await axios.post(`/api/discussions/${id}/reply`, {
        content: replyContent.trim(),
        authorName: resolvedName,
        authorRole: user?.role === "admin" ? "Admin" : "Participant",
      });
      if (data.success) {
        setDiscussion(data.discussion);
        setReplyContent("");
      }
    } catch (err) {
      console.error("Failed to add reply", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 py-16 px-4 text-center">
        <h2 className="text-xl font-bold">Discussion not found</h2>
        <Link
          to="/discussions"
          className="mt-4 inline-block text-xs font-medium text-indigo-400 hover:underline"
        >
          ← Return to Discussions
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(discussion.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070a12] text-gray-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/discussions")}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Discussions</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share Topic"}</span>
          </button>
        </div>

        {/* Main Discussion Post Card */}
        <article className="rounded-2xl border border-slate-800/90 bg-[#0d121f] p-6 md:p-8 shadow-xl">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {discussion.category}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-semibold text-slate-200">
              {discussion.authorName}
            </span>
            {discussion.authorRole && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {discussion.authorRole}
              </span>
            )}
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{formattedDate}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight leading-snug mb-5">
            {discussion.title}
          </h1>

          {/* Body Content */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line border-b border-slate-800/80 pb-6 mb-6 font-normal">
            {discussion.content}
          </div>

          {/* Tags */}
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {discussion.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50"
                >
                  <Tag className="w-3 h-3 text-slate-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer with Upvote & Views */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpvoteTopic}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all font-semibold active:scale-95"
              >
                <ArrowBigUp className="w-4 h-4" />
                <span>Upvote ({discussion.upvotes})</span>
              </button>

              <div className="flex items-center gap-1 text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                <span>{discussion.views} views</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{discussion.replies?.length || 0} responses</span>
            </div>
          </div>
        </article>

        {/* Reply Composer Box with Civil Etiquette Banner */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c111e] p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">Share Your Perspective</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Ground your critique in reason and evidence. Conciseness is appreciated by all readers.
          </p>

          <form onSubmit={handleAddReply} className="space-y-3">
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name / Handle"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <textarea
              rows={4}
              required
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="What are your thoughts on this? Add your perspective or counter-argument..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-all"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingReply || !replyContent.trim()}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmittingReply ? "Posting..." : "Post Response"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Replies List */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">
            Discussion Responses ({discussion.replies?.length || 0})
          </h3>

          {!discussion.replies || discussion.replies.length === 0 ? (
            <div className="text-center py-10 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
              No replies yet. Start the conversation above!
            </div>
          ) : (
            discussion.replies.map((reply, idx) => (
              <div
                key={reply._id || idx}
                className="rounded-xl border border-slate-800/80 bg-[#0d121f]/90 p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{reply.authorName}</span>
                    {reply.authorRole && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {reply.authorRole}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(reply.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                  {reply.content}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
