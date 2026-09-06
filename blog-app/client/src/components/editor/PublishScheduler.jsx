import React from "react";
import { Calendar } from "lucide-react";

/**
 * 🕒 PublishScheduler
 * Renders the 3-state publish mode selector (Publish Now, Draft, Schedule)
 * and the local datetime picker when scheduling is active.
 */
export default function PublishScheduler({
  publishMode,
  setPublishMode,
  scheduledDate,
  setScheduledDate,
  minDateTime,
}) {
  return (
    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        Publishing Schedule
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setPublishMode("publish")}
          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
            publishMode === "publish"
              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400"
          }`}
        >
          <span>🚀 Publish Now</span>
          <span className="text-[10px] font-normal opacity-80">
            Live immediately
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPublishMode("draft")}
          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
            publishMode === "draft"
              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400"
          }`}
        >
          <span>📝 Save as Draft</span>
          <span className="text-[10px] font-normal opacity-80">
            Private to you
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPublishMode("schedule")}
          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
            publishMode === "schedule"
              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400"
          }`}
        >
          <span>🕒 Publish Later</span>
          <span className="text-[10px] font-normal opacity-80">
            Schedule release
          </span>
        </button>
      </div>

      {/* DateTime Picker for Scheduler */}
      {publishMode === "schedule" && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
            Pick publication release time (Local):
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <input
              type="datetime-local"
              min={minDateTime}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 font-mono outline-none focus:ring-1 focus:ring-purple-600"
              required={publishMode === "schedule"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
