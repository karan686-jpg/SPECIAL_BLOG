import React, { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const REACTION_CONFIG = [
  {
    type: "heart",
    emoji: "❤️",
    label: "Love",
    activeClass: "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 shadow-sm",
    hoverClass: "hover:bg-red-50 dark:hover:bg-red-950/40",
  },
  {
    type: "clap",
    emoji: "👏",
    label: "Clap",
    activeClass: "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 shadow-sm",
    hoverClass: "hover:bg-amber-50 dark:hover:bg-amber-950/40",
  },
  {
    type: "insight",
    emoji: "💡",
    label: "Insightful",
    activeClass: "bg-yellow-50 dark:bg-yellow-950/60 border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 shadow-sm",
    hoverClass: "hover:bg-yellow-50 dark:hover:bg-yellow-950/40",
  },
  {
    type: "fire",
    emoji: "🔥",
    label: "Fire",
    activeClass: "bg-orange-50 dark:bg-orange-950/60 border-orange-300 dark:border-orange-800 text-orange-600 dark:text-orange-400 shadow-sm",
    hoverClass: "hover:bg-orange-50 dark:hover:bg-orange-950/40",
  },
];

const ReactionsBar = ({ blogId, initialReactions = {}, onReactionsChange }) => {
  const { axios, user, isAuth } = useContext(AppContext);
  const [reactions, setReactions] = useState({
    heart: initialReactions?.heart || [],
    clap: initialReactions?.clap || [],
    insight: initialReactions?.insight || [],
    fire: initialReactions?.fire || [],
  });
  const [animatingType, setAnimatingType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReact = async (type) => {
    if (!isAuth) {
      toast.error("Please login to react to this article.");
      return;
    }

    if (loading) return;

    // Trigger pop micro-animation
    setAnimatingType(type);
    setTimeout(() => setAnimatingType(null), 300);

    // Optimistic state update
    const currentList = reactions[type] || [];
    const userId = user?.id;
    const hasReacted = currentList.some((id) => id?.toString() === userId?.toString());
    const nextList = hasReacted
      ? currentList.filter((id) => id?.toString() !== userId?.toString())
      : [...currentList, userId];

    const updatedReactions = { ...reactions, [type]: nextList };
    setReactions(updatedReactions);
    if (onReactionsChange) onReactionsChange(updatedReactions);

    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/react", {
        blogId,
        reactionType: type,
      });
      if (data.success) {
        setReactions(data.reactions);
        if (onReactionsChange) onReactionsChange(data.reactions);
      } else {
        toast.error(data.message || "Failed to update reaction");
        // Revert
        setReactions(reactions);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to react");
      setReactions(reactions);
    } finally {
      setLoading(false);
    }
  };

  const totalReactions = Object.values(reactions).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  return (
    <div className="flex flex-wrap items-center gap-2 select-none">
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
        {REACTION_CONFIG.map(({ type, emoji, label, activeClass, hoverClass }) => {
          const list = reactions[type] || [];
          const count = list.length;
          const hasReacted = isAuth && user?.id && list.some((id) => id?.toString() === user?.id?.toString());
          const isPopping = animatingType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleReact(type)}
              title={`${label} (${count})`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-transparent text-sm font-semibold transition-all duration-200 cursor-pointer ${
                hasReacted
                  ? activeClass
                  : `text-gray-700 dark:text-gray-300 ${hoverClass}`
              } ${isPopping ? "scale-125" : "hover:scale-105 active:scale-95"}`}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span className="text-xs font-mono">{count}</span>
            </button>
          );
        })}
      </div>

      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">
        {totalReactions} {totalReactions === 1 ? "reaction" : "reactions"}
      </span>
    </div>
  );
};

export default ReactionsBar;
