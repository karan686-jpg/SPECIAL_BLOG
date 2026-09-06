import React from "react";
import { XCircle, Clock, CheckCircle2, FileText, Zap } from "lucide-react";
import moment from "moment";

const BlogTableItem = ({ blog, index, onUnpublish, onDelete }) => {
  const isScheduled =
    blog.isPublished && blog.scheduledFor && new Date(blog.scheduledFor) > new Date();
  const isLive =
    blog.isPublished && (!blog.scheduledFor || new Date(blog.scheduledFor) <= new Date());

  return (
    <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors border-b border-gray-100 dark:border-gray-800/80 text-xs sm:text-sm">
      <td className="px-6 py-4 text-gray-400 font-mono font-medium">{index + 1}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0"
            />
          )}
          <span className="text-gray-900 dark:text-gray-100 font-semibold line-clamp-1">
            {blog.title}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
        {blog.authorName || "Admin"}
      </td>

      {/* Status Badge Column */}
      <td className="px-6 py-4">
        {isScheduled ? (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 w-fit">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Scheduled</span>
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
              {moment(blog.scheduledFor).format("MMM D, h:mm A")}
            </span>
          </div>
        ) : isLive ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Live</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 w-fit">
            <FileText className="w-3 h-3" />
            <span>Draft</span>
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
        {moment(blog.createdAt).format("MMM D, YYYY")}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => onUnpublish(blog._id)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isScheduled
                ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-2xs"
                : blog.isPublished
                ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-2xs"
            }`}
            title={isScheduled ? "Publish live right now" : blog.isPublished ? "Unpublish story" : "Publish story"}
          >
            {isScheduled && <Zap className="w-3 h-3" />}
            <span>{isScheduled ? "Publish Now" : blog.isPublished ? "Unpublish" : "Publish"}</span>
          </button>

          <button
            onClick={() => onDelete(blog._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
            title="Delete Story"
            type="button"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BlogTableItem;
