import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import moment from "moment";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext.jsx";
import Comment from "../src/components/admin/Comment.jsx";
import { Helmet } from "react-helmet-async";

const BlogDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { axios, user, isAuth } = useContext(AppContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) {
        setBlog(data.blog);
        setLikes(data.blog.likes || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!isAuth) {
      toast.error("Please login to like this blog.");
      return;
    }
    try {
      const { data } = await axios.post("/api/blog/like", { blogId: id });
      if (data.success) {
        setLikes(data.likes);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found.</div>;

  const readTime =
    Math.ceil(
      (blog.description || "").replace(/<[^>]*>?/gm, "").split(/\s+/).length /
        200,
    ) || 1;

  const stripHtml = (html) => (html ? html.replace(/<[^>]*>?/gm, "") : "");
  const cleanDescription = stripHtml(blog.description).substring(0, 160);

  return (
    <div>
      <Helmet>
        <title>{blog.title} | Blogify</title>
        <meta name="description" content={cleanDescription} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Navbar />
      <button className="back" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="blog-card">
        <div className="flex items-center gap-2 text-xs text-gray-500 p-5 font-medium">
          <span>{moment(blog.createdAt).format("MMMM D, YYYY")}</span>
          <span className="mx-1">•</span>
          <span>{blog.views || 0} views</span>
          <span className="mx-1">•</span>
          <span>{readTime} min read</span>
          <span className="mx-1">•</span>
          <span>
            By{" "}
            <strong className="text-gray-800">
              {blog.authorName || "Admin"}
            </strong>
          </span>
        </div>
        <img src={blog.image} alt={blog.title} />
        <div>
          <div className="blog-category">{blog.category}</div>
          <div className="blog-title">{blog.title}</div>
          {blog.subtitle && (
            <div className="blog-subtitle">{blog.subtitle}</div>
          )}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          <div className="flex gap-4 mt-8 mb-4 border-t pt-4">
            <button
              className={`px-4 py-2 rounded font-semibold transition-colors ${likes.includes(user?.id) ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={handleLike}
            >
              ♥ {likes.length} {likes.length === 1 ? "Like" : "Likes"}
            </button>
            <button
              className="px-4 py-2 bg-gray-100 font-semibold text-gray-800 rounded transition-colors hover:bg-gray-200"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
      <Comment id={id} />
    </div>
  );
};

export default BlogDetails;
