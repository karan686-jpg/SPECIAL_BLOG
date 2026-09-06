import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import {
  Clock,
  BookOpen,
  Bookmark,
  Share2,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import Navbar from "../src/components/Navbar";
import Comment from "../src/components/admin/Comment.jsx";
import ReadingProgressBar from "../src/components/ReadingProgressBar.jsx";
import TableOfContents from "../src/components/TableOfContents.jsx";
import ReactionsBar from "../src/components/ReactionsBar.jsx";
import ShareModal from "../src/components/ShareModal.jsx";
import AudioPlayer from "../src/components/AudioPlayer.jsx";
import { AppContext } from "../context/AppContext.jsx";

const BlogDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { axios, toggleBookmark, isBookmarked } = useContext(AppContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const contentRef = useRef(null);

  const fetchBlog = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) {
        setBlog(data.blog);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [axios, id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchBlog();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchBlog]);

  // Highlight syntax and attach copy buttons to code blocks
  useEffect(() => {
    if (!blog?.description || !contentRef.current) return;

    // Run Prism highlighting
    Prism.highlightAll();

    // Attach copy buttons to all <pre> code blocks
    const preBlocks = contentRef.current.querySelectorAll("pre");
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return; // already has button

      pre.style.position = "relative";
      const button = document.createElement("button");
      button.className =
        "code-copy-btn absolute top-3 right-3 px-2.5 py-1 text-xs font-mono rounded-md bg-gray-800/80 hover:bg-gray-700 text-gray-200 border border-gray-600/50 backdrop-blur-sm transition-all duration-150 flex items-center gap-1 shadow-sm cursor-pointer z-10";
      button.innerHTML = "<span>Copy</span>";

      button.addEventListener("click", () => {
        const code = pre.querySelector("code")?.innerText || pre.innerText;
        navigator.clipboard.writeText(code).then(() => {
          button.innerHTML = "<span>✓ Copied!</span>";
          button.classList.add("bg-emerald-700", "text-white");
          setTimeout(() => {
            button.innerHTML = "<span>Copy</span>";
            button.classList.remove("bg-emerald-700", "text-white");
          }, 2000);
        });
      });

      pre.appendChild(button);
    });
  }, [blog?.description]);

  const stripHtml = (html) => (html ? html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim() : "");

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="text-center py-32">
          <h2 className="text-2xl font-bold">Blog not found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const plainText = stripHtml(blog.description);
  const wordsCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordsCount / 200) || 1;
  const cleanDescription = plainText.substring(0, 160);
  const bookmarked = isBookmarked(blog._id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Helmet>
        <title>{blog.title} | Blogify</title>
        <meta name="description" content={cleanDescription} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ⚡ Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      <Navbar />

      <article className="max-w-[760px] mx-auto px-4 sm:px-6 py-10">
        {/* Navigation & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to stories</span>
          </button>

          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
            {blog.category}
          </span>
        </div>

        {/* Blog Article Header */}
        <header className="mb-10">
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.14] mb-4">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="font-editorial text-lg sm:text-2xl text-gray-600 dark:text-gray-400 font-normal mb-6 leading-relaxed">
              {blog.subtitle}
            </p>
          )}

          {/* Author & Reading Metadata Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 dark:border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                {(blog.authorName || "A")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {blog.authorName || "Staff Writer"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {moment(blog.createdAt).format("MMM D, YYYY")}
                  </span>
                  <span>•</span>
                  <span>{blog.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Reading Time Badge */}
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{readTime} min read</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{wordsCount} words</span>
              </span>
            </div>
          </div>

          {/* 🎧 Listen to Article (Audio Player) */}
          <AudioPlayer
            title={blog.title}
            contentText={plainText}
            readTime={readTime}
          />
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="mb-10">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-[460px] object-cover rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800"
            />
          </div>
        )}

        {/* Table of Contents Accordion */}
        <div className="mb-8 p-4 rounded-xl bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
          <TableOfContents />
        </div>

        {/* Article Body */}
        <main>
          <div
            ref={contentRef}
            className="article-prose leading-relaxed text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

            {/* Reader Action Bar: Multi-Emoji Reactions, Bookmark, Social Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-12 py-6 border-y border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap items-center gap-4">
                {/* 💬 Multi-Emoji Reactions Bar */}
                <ReactionsBar
                  blogId={id}
                  initialReactions={blog.reactions}
                  onReactionsChange={(newReactions) =>
                    setBlog((prev) => ({ ...prev, reactions: newReactions }))
                  }
                />

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => toggleBookmark(blog)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    bookmarked
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
                  />
                  <span>{bookmarked ? "Saved" : "Save story"}</span>
                </button>
              </div>

              {/* Social Share Modal Trigger */}
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition cursor-pointer"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <Comment id={id} />
            </div>
          </main>
      </article>

      {/* 🔗 Social Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        blog={blog}
      />
    </div>
  );
};

export default BlogDetails;
