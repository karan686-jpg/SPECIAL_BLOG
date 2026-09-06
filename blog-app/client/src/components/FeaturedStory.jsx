import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Sparkles, Clock, ArrowUpRight } from "lucide-react";
import moment from "moment";
import { AppContext } from "../../context/AppContext";

const stripHtml = (html) => (html || "").replace(/<[^>]*>?/gm, " ").trim();

const FeaturedStory = ({ blog }) => {
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useContext(AppContext);

  if (!blog) return null;

  const plainText = stripHtml(blog.description);
  const wordsCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordsCount / 200) || 1;
  const teaser = blog.subTitle || blog.subtitle || plainText.slice(0, 180) + "...";
  const bookmarked = isBookmarked ? isBookmarked(blog._id) : false;

  return (
    <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pb-10 sm:pb-12 mb-8 sm:mb-12 border-b border-gray-100 dark:border-gray-800/80">
      {/* Editorial Text Content */}
      <div className="lg:col-span-7 space-y-3 sm:space-y-4">
        {/* Category & Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
          <span className="text-xs text-gray-300 dark:text-gray-700">•</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {blog.category}
          </span>
        </div>

        {/* Headline */}
        <h2
          onClick={() => navigate(`/blog/${blog._id}`)}
          className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.2] cursor-pointer group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        >
          {blog.title}
        </h2>

        {/* Teaser text */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
          {teaser}
        </p>

        {/* Author Line & Meta Info */}
        <div className="flex items-center justify-between pt-2 sm:pt-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {(blog.authorName || "A")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-200">
                {blog.authorName || "Staff Writer"}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <span>{moment(blog.createdAt).format("MMM D")}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => toggleBookmark && toggleBookmark(blog._id)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              title={bookmarked ? "Remove Bookmark" : "Save Story"}
              type="button"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  bookmarked ? "fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400" : ""
                }`}
              />
            </button>
            <button
              onClick={() => navigate(`/blog/${blog._id}`)}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1"
            >
              Read story <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cover Image (order-first on mobile for visual impact, lg:order-last) */}
      <div
        onClick={() => navigate(`/blog/${blog._id}`)}
        className="order-first lg:order-last lg:col-span-5 cursor-pointer overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 shadow-xs"
      >
        <img
          src={blog.image}
          alt={blog.title}
          loading="lazy"
          className="w-full aspect-[16/10] sm:h-72 lg:h-80 object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
    </article>
  );
};

export default FeaturedStory;
