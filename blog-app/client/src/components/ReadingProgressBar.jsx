import React, { useEffect, useState } from "react";

const ReadingProgressBar = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(3)) * 100);
      }
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 w-full h-1.5 bg-gray-200/40 dark:bg-gray-800/40 z-[60] backdrop-blur-sm pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(completion)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
