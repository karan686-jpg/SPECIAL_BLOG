import React, { useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Clock, Bookmark, BookOpen } from "lucide-react";
import { AppContext } from "../../context/AppContext";

// strips HTML tags so the card shows clean plain text
const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const BlogCard = ({ blog }) => {
  const { toggleBookmark, isBookmarked } = useContext(AppContext);
  const plainText = stripHtml(blog.description);
  const wordsCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordsCount / 200) || 1;
  const preview = plainText.slice(0, 120);
  const bookmarked = isBookmarked(blog._id);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(blog);
  };

  return (
    <Link to={`/blog/${blog._id}`} className="group h-full">
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full transform hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-[16/9] w-full">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={blog.image}
            alt={blog.title}
            loading="lazy"
          />
          {/* Category Pill */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 dark:bg-gray-900/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {blog.category}
            </span>
          </div>

          {/* Quick Bookmark Action Button */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
              bookmarked
                ? "bg-purple-600 text-white shadow-purple-500/30 scale-105"
                : "bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:scale-110"
            }`}
            title={bookmarked ? "Remove from bookmarks" : "Save for later"}
            aria-label="Bookmark"
          >
            <Bookmark
              className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {/* Metadata Bar */}
          <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium flex-wrap">
            <span>{moment(blog.createdAt).format("MMM D, YYYY")}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              {readTime} min read
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              {wordsCount} words
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
            {preview}
            {preview.length === 120 ? "…" : ""}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              By {blog.authorName || "Admin"}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
