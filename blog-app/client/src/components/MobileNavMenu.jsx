import React from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  SquarePen,
  BarChart2,
  Shield,
  Compass,
} from "lucide-react";
import Logout from "./admin/Logout";

/**
 * 📱 MobileNavMenu
 * Slide-down navigation drawer for mobile viewport (< sm).
 * Includes quick links to Saved list, Forum, Collab Studio, role-based dashboards, and Auth.
 */
export default function MobileNavMenu({
  isOpen,
  onClose,
  isAuth,
  user,
  bookmarks = [],
  navigate,
}) {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md px-4 py-5 space-y-3 transition-all animate-in slide-in-from-top-2 duration-200">
      {/* Bookmarks */}
      <button
        onClick={() => {
          navigate("/bookmarks");
          onClose();
        }}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Bookmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Saved Reading List</span>
        </div>
        {bookmarks && bookmarks.length > 0 && (
          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {bookmarks.length}
          </span>
        )}
      </button>

      {/* Discussion Forum */}
      <button
        onClick={() => {
          navigate("/discussions");
          onClose();
        }}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-indigo-500" />
          <span>Discussion Forum</span>
        </div>
        <span className="text-[10px] uppercase font-bold bg-indigo-200 dark:bg-indigo-900 px-2 py-0.5 rounded-full">
          Agora
        </span>
      </button>

      {/* Collab Studio */}
      <button
        onClick={() => {
          navigate("/collab");
          onClose();
        }}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-sm font-semibold border border-purple-200/60 dark:border-purple-800/60 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Collab Studio (Liveblocks)</span>
        </div>
        <span className="text-[10px] uppercase font-bold bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded-full">
          Multiplayer
        </span>
      </button>

      {/* Write Story (Authenticated) */}
      {isAuth && (
        <button
          onClick={() => {
            navigate("/create-blog");
            onClose();
          }}
          className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
          <span>Write a New Story</span>
        </button>
      )}

      {/* Admin Panel */}
      {isAuth && user?.role === "admin" && (
        <button
          onClick={() => {
            navigate("/admin");
            onClose();
          }}
          className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
        >
          <Shield className="w-4 h-4 text-indigo-500" />
          <span>Admin Dashboard</span>
        </button>
      )}

      {/* Analytics (User) */}
      {isAuth && user?.role === "user" && (
        <button
          onClick={() => {
            navigate("/analytics");
            onClose();
          }}
          className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
        >
          <BarChart2 className="w-4 h-4 text-emerald-500" />
          <span>Your Analytics</span>
        </button>
      )}

      {/* Auth Actions */}
      {!isAuth ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            to="/auth"
            onClick={onClose}
            className="w-full py-3 text-center rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="w-full py-3 text-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold shadow-xs"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <Logout />
        </div>
      )}
    </div>
  );
}
