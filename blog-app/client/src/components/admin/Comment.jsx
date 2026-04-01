import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-hot-toast";

const Comment = ({ id }) => {
  const { axios, user, isAuth } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await axios.post("/api/blog/comments", { blogId: id });
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  const handleSubmit = async () => {
    if (text.trim() === "") return;
    try {
      setSubmitting(true);
      const payload = {
        blog: id,
        content: text,
      };

      if (isAuth && user) {
        payload.name = user.name;
        payload.userId = user.id;
      } else {
        payload.name = name || "Anonymous";
      }

      const { data } = await axios.post("/api/blog/add-comment", payload);
      if (data.success) {
        toast.success(data.message || "Comment submitted!");
        setName("");
        setText("");
        fetchComments(); // Refresh comments list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="CommentShow">
        <p className="font-bold text-lg mb-4 border-b pb-2">
          Comments ({comments.length})
        </p>
        {comments.length === 0 && (
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            No approved comments yet. Be the first to share your thoughts!
          </p>
        )}
        <div className="flex flex-col gap-4">
          {comments.map((c, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                {c.user?.profileImage && (
                  <img
                    src={c.user.profileImage}
                    alt="profile"
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                )}
                <strong className="text-gray-800">
                  {c.user?.name || c.name}
                </strong>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-gray-700">{c.content}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col m-3 mt-8 p-6 bg-white shadow-sm border border-gray-100 rounded-lg max-w-[80vh] mx-auto">
        <p className="font-bold mb-4 text-left w-full text-lg">
          Leave a comment
        </p>

        {!isAuth && (
          <input
            className="input mb-3 w-full border p-3 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Your Name (Optional)"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        )}

        <textarea
          className="textarea w-full border p-3 rounded h-28 mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={text}
          placeholder="Share your thoughts..."
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded transition-colors w-full sm:w-auto self-start"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? "Posting..."
            : isAuth
              ? "Post Comment"
              : "Post as Guest"}
        </button>
      </div>
    </div>
  );
};

export default Comment;
