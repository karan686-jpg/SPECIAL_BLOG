import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { MessageSquare, CornerDownRight, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../../context/AppContext";

const Comment = ({ id }) => {
  const { axios, isAuth } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Nested reply state
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/blog/comments", { blogId: id });
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  }, [axios, id]);

  useEffect(() => {
    if (!id) return undefined;
    const timer = window.setTimeout(() => {
      void fetchComments();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id, fetchComments]);

  // Main comment submission
  const handleSubmit = async () => {
    if (text.trim() === "") return;
    try {
      setSubmitting(true);
      const payload = {
        blog: id,
        content: text,
      };

      if (!isAuth) {
        payload.name = name || "Anonymous";
      }

      const { data } = await axios.post("/api/blog/add-comment", payload);
      if (data.success) {
        toast.success(data.message || "Comment submitted!");
        setName("");
        setText("");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reply submission
  const handleReplySubmit = async (parentId) => {
    if (replyText.trim() === "") return;
    try {
      setSubmittingReply(true);
      const payload = {
        blog: id,
        parentId,
        content: replyText,
      };

      if (!isAuth) {
        payload.name = replyName || "Anonymous";
      }

      const { data } = await axios.post("/api/blog/add-comment", payload);
      if (data.success) {
        toast.success(data.message || "Reply submitted!");
        setReplyName("");
        setReplyText("");
        setReplyingToId(null);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmittingReply(false);
    }
  };

  // Organize comments into parent and children threads
  const { topLevelComments, repliesMap } = useMemo(() => {
    const top = [];
    const replies = {};

    comments.forEach((c) => {
      if (!c.parentId) {
        top.push(c);
      } else {
        const pId = c.parentId.toString();
        if (!replies[pId]) replies[pId] = [];
        replies[pId].push(c);
      }
    });

    return { topLevelComments: top, repliesMap: replies };
  }, [comments]);

  return (
    <div>
      {/* Comments Thread Section */}
      <div className="CommentShow mt-10">
        <div className="flex items-center gap-2 font-bold text-xl mb-6 border-b border-gray-100 dark:border-gray-800 pb-3 text-gray-900 dark:text-white">
          <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>Discussion ({comments.length})</span>
        </div>

        {comments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
            No approved comments yet. Be the first to start the conversation!
          </p>
        )}

        <div className="space-y-6">
          {topLevelComments.map((parent) => {
            const childReplies = repliesMap[parent._id.toString()] || [];
            const isReplying = replyingToId === parent._id;

            return (
              <div
                key={parent._id}
                className="bg-gray-50/70 dark:bg-gray-900/60 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
              >
                {/* Parent Comment Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    {parent.user?.profileImage ? (
                      <img
                        src={parent.user.profileImage}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center">
                        {(parent.name || "A")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <strong className="text-gray-900 dark:text-gray-100 text-sm block leading-none">
                        {parent.user?.name || parent.name}
                      </strong>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {new Date(parent.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Reply Button Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingToId(isReplying ? null : parent._id);
                      setReplyText("");
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 px-2.5 py-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Parent Content */}
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-10 mb-2">
                  {parent.content}
                </div>

                {/* Inline Reply Form */}
                {isReplying && (
                  <div className="ml-10 mt-3 p-4 bg-white dark:bg-gray-950 rounded-xl border border-purple-200 dark:border-purple-900/60 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <span>Replying to {parent.name}</span>
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {!isAuth && (
                      <input
                        className="w-full mb-2 border border-gray-200 dark:border-gray-800 p-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-600"
                        placeholder="Your Name (Optional)"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                      />
                    )}

                    <textarea
                      className="w-full border border-gray-200 dark:border-gray-800 p-2.5 text-xs rounded-lg h-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      placeholder="Write a constructive reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />

                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={submittingReply}
                        onClick={() => handleReplySubmit(parent._id)}
                        className="px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition shadow-sm"
                      >
                        {submittingReply ? "Replying..." : "Post Reply"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Threaded Replies */}
                {childReplies.length > 0 && (
                  <div className="border-l-2 border-purple-200 dark:border-purple-900/60 pl-4 ml-6 sm:ml-10 mt-4 space-y-3">
                    {childReplies.map((reply) => (
                      <div
                        key={reply._id}
                        className="bg-white dark:bg-gray-950 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {reply.user?.profileImage ? (
                            <img
                              src={reply.user.profileImage}
                              alt="reply avatar"
                              className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center">
                              {(reply.name || "A")[0].toUpperCase()}
                            </div>
                          )}
                          <strong className="text-gray-900 dark:text-gray-100 text-xs">
                            {reply.user?.name || reply.name}
                          </strong>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed pl-8">
                          {reply.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Comment Creation Box */}
      <div className="flex flex-col mt-12 p-6 bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl max-w-3xl w-full">
        <p className="font-bold mb-4 text-left w-full text-lg text-gray-900 dark:text-white">
          Join the discussion
        </p>

        {!isAuth && (
          <input
            className="input mb-3 w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            placeholder="Your Name (Optional)"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        )}

        <textarea
          className="textarea w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl h-28 mb-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
          value={text}
          placeholder="Share your perspectives, insights, or questions..."
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-purple-500/20 w-full sm:w-auto self-start text-sm"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? "Posting..."
            : isAuth
              ? "Post Comment"
              : "Submit for review"}
        </button>
      </div>
    </div>
  );
};

export default Comment;
