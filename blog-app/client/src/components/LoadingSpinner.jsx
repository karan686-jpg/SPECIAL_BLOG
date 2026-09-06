import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4 transition-colors">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse ring */}
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 dark:border-purple-900/40 border-t-purple-600 dark:border-t-purple-500 animate-spin"></div>
        {/* Inner subtle glow */}
        <div className="absolute w-4 h-4 rounded-full bg-purple-600 dark:bg-purple-400 animate-ping opacity-60"></div>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;
