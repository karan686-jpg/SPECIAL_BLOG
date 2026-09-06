import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Share2,
  MessageSquare,
  History,
  Activity,
  Sun,
  Moon,
  Lock,
  Send,
} from "lucide-react";
import CollaboratorAvatars from "./CollaboratorAvatars";
import CollabHuddle from "./CollabHuddle";

/**
 * 🚀 StudioHeader
 * Top navigation and real-time collaboration control bar:
 * - Room navigation and logo
 * - Live avatars presence stack
 * - WebRTC P2P Voice/Video Huddle trigger
 * - Invite, Comments, History, and Activity drawer triggers
 * - Light/Dark theme toggle & Story Publisher
 */
export default function StudioHeader({
  currentUser,
  isViewer,
  isPublishing,
  handlePublish,
  isInviteOpen,
  setIsInviteOpen,
  isCommentsOpen,
  setIsCommentsOpen,
  unresolvedCommentsCount = 0,
  isHistoryOpen,
  setIsHistoryOpen,
  isActivityOpen,
  setIsActivityOpen,
  theme,
  toggleTheme,
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/90 dark:bg-[#0c0e17]/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Back & Room Meta */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-base font-black tracking-tight text-gray-900 dark:text-white hover:opacity-80 transition"
          >
            Blogify
          </Link>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Collab Studio</span>
          </span>
        </div>
      </div>

      {/* Center / Right: Live Avatars & Studio Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Collaborators Presence Stack */}
        <CollaboratorAvatars />

        {/* 📹 Live WebRTC Audio/Video Huddle */}
        <CollabHuddle currentUser={currentUser} />

        {/* Invite Collaborators Button */}
        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition cursor-pointer"
          title="Invite collaborators & manage roles"
        >
          <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="hidden sm:inline">Invite</span>
        </button>

        {/* Comments Panel Trigger */}
        <button
          type="button"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            isCommentsOpen
              ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
          title="Comments & Discussions"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Comments</span>
          {unresolvedCommentsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unresolvedCommentsCount}
            </span>
          )}
        </button>

        {/* Version History Button */}
        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition cursor-pointer"
          title="Version History & Snapshots"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>

        {/* Activity Feed Button */}
        <button
          type="button"
          onClick={() => setIsActivityOpen(!isActivityOpen)}
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition cursor-pointer"
          title="Room Activity Feed"
        >
          <Activity className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Publish Story Button */}
        <button
          type="button"
          disabled={isPublishing || isViewer}
          onClick={handlePublish}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
          title={
            isViewer
              ? "Viewers cannot publish"
              : "Publish story directly to Blogify"
          }
        >
          {isViewer ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>View Only</span>
            </>
          ) : isPublishing ? (
            <span>Publishing...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Publish</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
