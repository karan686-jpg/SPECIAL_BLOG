import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ArrowBigUp, Eye, Tag, Pin } from "lucide-react";

export default function DiscussionCard({ discussion, onUpvote }) {
  const {
    _id,
    title,
    content,
    authorName,
    authorAvatar,
    authorRole,
    category,
    tags,
    upvotes = 0,
    views = 0,
    replies = [],
    isPinned,
    createdAt,
  } = discussion;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative rounded-xl border border-slate-800/80 bg-[#0d121f]/90 p-5 md:p-6 transition-all duration-200 hover:border-slate-700 hover:bg-[#111728] shadow-sm hover:shadow-md">
      {isPinned && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
          <Pin className="w-3 h-3" />
          <span>Pinned</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Upvote Button Column */}
        <div className="flex flex-col items-center shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onUpvote(_id);
            }}
            aria-label="Upvote this discussion"
            className="flex flex-col items-center justify-center w-11 h-13 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all text-slate-300 active:scale-95 group/btn"
          >
            <ArrowBigUp className="w-5 h-5 text-slate-400 group-hover/btn:text-white group-hover/btn:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-bold leading-none mt-0.5">{upvotes}</span>
          </button>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {category}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-medium">{authorName}</span>
            {authorRole && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {authorRole}
              </span>
            )}
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{formattedDate}</span>
          </div>

          <Link to={`/discussions/${_id}`} className="block group-hover:text-indigo-400 transition-colors">
            <h2 className="text-lg md:text-xl font-semibold text-slate-100 tracking-tight leading-snug line-clamp-2">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed font-normal">
              {content}
            </p>
          </Link>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700/40"
                >
                  <Tag className="w-2.5 h-2.5 text-slate-500" />
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Meta footer */}
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 font-medium">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>{replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <Eye className="w-4 h-4" />
              <span>{views} views</span>
            </div>

            <Link
              to={`/discussions/${_id}`}
              className="ml-auto text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Join Discussion →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
