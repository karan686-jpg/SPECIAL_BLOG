import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const AuthorCard = ({ name = "Author", role = "Contributor", avatar, bio, totalPosts = 1 }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    toast.success(isFollowing ? `Unfollowed ${name}` : `Following ${name}!`);
  };

  return (
    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex items-center justify-between gap-4">
      <div
        onClick={() => navigate(`/author/${encodeURIComponent(name)}`)}
        className="flex items-center gap-3 min-w-0 cursor-pointer group/author"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover/author:scale-105 transition-transform">
          {(name || "A")[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover/author:text-indigo-600 dark:group-hover/author:text-indigo-400 transition-colors">
            {name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {bio || `${totalPosts} stories published`}
          </p>
        </div>
      </div>

      <button
        onClick={handleFollow}
        type="button"
        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          isFollowing
            ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
        }`}
      >
        {isFollowing ? (
          <>
            <UserCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus className="w-3 h-3" />
            <span>Follow</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AuthorCard;
