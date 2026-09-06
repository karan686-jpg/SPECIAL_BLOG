import React from "react";
import { RotateCcw, Trash2 } from "lucide-react";

/**
 * 🛡️ DraftRecoveryBanner
 * Shows an unobtrusive restore alert when an unsaved local draft is detected.
 */
export default function DraftRecoveryBanner({ draft, onRestore, onDiscard }) {
  if (!draft) return null;

  return (
    <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-xl text-purple-600 dark:text-purple-300">
          <RotateCcw className="w-5 h-5 animate-spin-reverse" />
        </div>
        <div>
          <p className="text-xs font-bold text-purple-900 dark:text-purple-100">
            Unsaved local draft found!
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            Saved at {draft.savedAt || "earlier"}: "{draft.title || "Untitled story"}"
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onDiscard}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Discard</span>
        </button>
        <button
          type="button"
          onClick={onRestore}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Draft</span>
        </button>
      </div>
    </div>
  );
}
