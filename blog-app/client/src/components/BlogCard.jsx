import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Clock } from "lucide-react";

// strips HTML tags so the card shows clean plain text
const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const BlogCard = ({ blog }) => {
  const preview = stripHtml(blog.description).slice(0, 120);
  const readTime =
    Math.ceil(
      (blog.description || "").replace(/<[^>]*>?/gm, "").split(/\s+/).length /
        200,
    ) || 1;

  return (
    <Link to={`/blog/${blog._id}`} className="group h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-[16/9] w-full">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={blog.image}
            alt={blog.title}
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {blog.category}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 font-medium">
            <span>{moment(blog.createdAt).format("MMM D, YYYY")}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {readTime} min read
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
            {preview}
            {preview.length === 120 ? "…" : ""}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">
              By {blog.authorName || "Admin"}
            </span>
            <span className="text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
