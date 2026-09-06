import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Clock, Eye } from "lucide-react";
import moment from "moment";
import { AppContext } from "../../context/AppContext";

const stripHtml = (html) => (html || "").replace(/<[^>]*>?/gm, " ").trim();

const ArticleCard = ({ blog }) => {
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useContext(AppContext);

  if (!blog) return null;

  const plainText = stripHtml(blog.description);
  const wordsCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordsCount / 200) || 1;
  const teaser = blog.subTitle || blog.subtitle || plainText.slice(0, 140) + "...";
  const bookmarked = isBookmarked ? isBookmarked(blog._id) : false;

  return (
    <article className="group py-6 border-b border-gray-100 dark:border-gray-800/80 transition-colors">
      <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-5">
        {/* Text Info */}
        <div className="flex-1 space-y-2">
          {/* Author line */}
          <div
            onClick={() => navigate(`/author/${encodeURIComponent(blog.authorName || "Author")}`)}
            className="inline-flex items-center gap-2 text-xs cursor-pointer group/auth"
          >
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-[10px] text-gray-700 dark:text-gray-300 group-hover/auth:scale-105 transition-transform">
              {(blog.authorName || "A")[0].toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover/auth:text-indigo-600 dark:group-hover/auth:text-indigo-400 transition-colors">
              {blog.authorName || "Author"}
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="text-gray-500 dark:text-gray-400">
              {moment(blog.createdAt).format("MMM D")}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => navigate(`/blog/${blog._id}`)}
            className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors leading-snug"
          >
            {blog.title}
          </h3>

          {/* Subtitle / Teaser */}
          <p
            onClick={() => navigate(`/blog/${blog._id}`)}
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed cursor-pointer font-normal"
          >
            {teaser}
          </p>

          {/* Meta row: Category, Read time, Views, Bookmark */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-[11px]">
                {blog.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min read
              </span>
              {typeof blog.views === "number" && (
                <span className="hidden sm:flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {blog.views}
                </span>
              )}
            </div>

            <button
              onClick={() => toggleBookmark && toggleBookmark(blog._id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              title={bookmarked ? "Remove Bookmark" : "Save Story"}
              type="button"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  bookmarked ? "fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Thumbnail Image */}
        {blog.image && (
          <div
            onClick={() => navigate(`/blog/${blog._id}`)}
            className="w-full sm:w-44 sm:h-28 h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 cursor-pointer border border-gray-100 dark:border-gray-800 shadow-2xs"
          >
            <img
              src={blog.image}
              alt={blog.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;
