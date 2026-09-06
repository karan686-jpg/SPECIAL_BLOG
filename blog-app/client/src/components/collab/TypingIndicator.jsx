import React from "react";
import { useOthers } from "./liveblocks.config";

const TypingIndicator = () => {
  const others = useOthers();

  const typingUsers = others
    ? others.filter((other) => other.presence?.isTyping && other.presence?.name)
    : [];

  if (typingUsers.length === 0) return null;

  let text = "";
  if (typingUsers.length === 1) {
    text = `${typingUsers[0].presence.name} is typing`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0].presence.name} and ${typingUsers[1].presence.name} are typing`;
  } else {
    text = `${typingUsers[0].presence.name} and ${typingUsers.length - 1} others are typing`;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-lg text-xs text-gray-700 dark:text-gray-300 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="font-medium">{text}...</span>
    </div>
  );
};

export default TypingIndicator;
