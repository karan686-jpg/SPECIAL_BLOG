import React from "react";
import { cn } from "../lib/utils";

const TagChip = ({ label, active = false, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer select-none",
        active
          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
          : "bg-gray-100 dark:bg-gray-800/70 text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70"
      )}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
            active
              ? "bg-white/20 text-white dark:bg-black/10 dark:text-gray-900"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TagChip;
