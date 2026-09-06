import React, { useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  CheckCircle,
  RotateCcw,
  CornerDownRight,
  MessageCircleQuestion,
} from "lucide-react";
import { useBroadcastEvent, useEventListener } from "./liveblocks.config";

const CollabCommentsPanel = ({
  isOpen,
  onClose,
  currentUser,
  comments = [],
  onAddComment,
  onReplyComment,
  onToggleResolve,
}) => {
  const [newCommentText, setNewCommentText] = useState("");
  const [replyTextMap, setReplyTextMap] = useState({});
  const [filter, setFilter] = useState("all"); // 'all' | 'open' | 'resolved'

  if (!isOpen) return null;

  const handleSubmitNew = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment({
      id: `c_${Date.now()}`,
      author: currentUser?.name || "Author",
      avatar: currentUser?.avatar,
      color: currentUser?.color || "#8B5CF6",
      text: newCommentText.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      resolved: false,
      replies: [],
    });

    setNewCommentText("");
  };

  const handleReplySubmit = (commentId) => {
    const text = replyTextMap[commentId]?.trim();
    if (!text) return;

    onReplyComment(commentId, {
      id: `r_${Date.now()}`,
      author: currentUser?.name || "Author",
      avatar: currentUser?.avatar,
      color: currentUser?.color || "#8B5CF6",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setReplyTextMap((prev) => ({ ...prev, [commentId]: "" }));
  };

  const filteredComments = comments.filter((c) => {
    if (filter === "open") return !c.resolved;
    if (filter === "resolved") return c.resolved;
    return true;
  });

  return (
    <aside className="fixed top-16 right-0 w-80 sm:w-96 h-[calc(100vh-4rem)] z-40 bg-white/95 dark:bg-[#0c0e17]/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col transition-all animate-in slide-in-from-right-2 duration-200">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Discussions & Comments
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
            {comments.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs font-semibold px-4 py-2 gap-2 bg-gray-50/60 dark:bg-gray-900/40">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-2.5 py-1 rounded-md transition ${
            filter === "all"
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xs"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          All ({comments.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("open")}
          className={`px-2.5 py-1 rounded-md transition ${
            filter === "open"
              ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-2xs"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          Open ({comments.filter((c) => !c.resolved).length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("resolved")}
          className={`px-2.5 py-1 rounded-md transition ${
            filter === "resolved"
              ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-2xs"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          Resolved ({comments.filter((c) => c.resolved).length})
        </button>
      </div>

      {/* Comment Thread List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredComments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <MessageCircleQuestion className="w-10 h-10 mb-2 opacity-60" />
            <p className="text-xs font-medium">No comments in this filter</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Leave suggestions, feedback, or editorial notes below!
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3.5 rounded-xl border transition-all ${
                comment.resolved
                  ? "bg-gray-50/80 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800/80 opacity-75"
                  : "bg-white dark:bg-gray-800/60 border-purple-200 dark:border-purple-900/60 shadow-xs"
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-6 h-6 rounded-full border"
                    style={{ borderColor: comment.color }}
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1.5 font-mono">
                      {comment.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleResolve(comment.id)}
                  className={`p-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition ${
                    comment.resolved
                      ? "text-gray-400 hover:text-purple-600"
                      : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  }`}
                  title={
                    comment.resolved ? "Reopen discussion" : "Mark as resolved"
                  }
                >
                  {comment.resolved ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reopen</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </>
                  )}
                </button>
              </div>

              {/* Comment Body */}
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                {comment.text}
              </p>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-6 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
                  {comment.replies.map((rep) => (
                    <div key={rep.id} className="text-xs">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <img
                          src={rep.avatar}
                          alt={rep.author}
                          className="w-4 h-4 rounded-full border"
                          style={{ borderColor: rep.color }}
                        />
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                          {rep.author}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {rep.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 pl-5">
                        {rep.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              {!comment.resolved && (
                <div className="mt-3 pl-8 flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Reply to thread..."
                    value={replyTextMap[comment.id] || ""}
                    onChange={(e) =>
                      setReplyTextMap((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleReplySubmit(comment.id);
                      }
                    }}
                    className="flex-1 text-[11px] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleReplySubmit(comment.id)}
                    className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                    title="Send reply"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Comment Input Box */}
      <form
        onSubmit={handleSubmitNew}
        className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-2"
      >
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add an editorial note or comment..."
          className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-600 shadow-2xs"
        />
        <button
          type="submit"
          disabled={!newCommentText.trim()}
          className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl transition shadow-xs cursor-pointer"
          title="Post comment"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
};

export default CollabCommentsPanel;
