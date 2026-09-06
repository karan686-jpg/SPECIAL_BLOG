import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  UserPlus,
  Shield,
  Edit3,
  Eye,
  Crown,
  Share2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { COLLAB_PALETTE } from "./liveblocks.config";

const InviteCollaboratorsModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  activeCollaborators = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [invitedRole, setInvitedRole] = useState("editor");

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("role", invitedRole);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    toast.success(`Share link copied for ${invitedRole.toUpperCase()} role!`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Collaborate on Story
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Invite teammates to co-author and review in real time
            </p>
          </div>
        </div>

        {/* Your Profile in this session */}
        <div className="p-3.5 mb-5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Your Pen Identity
            </span>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              Role: {currentUser?.role?.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: currentUser?.color }}
            />
            <div className="flex-1">
              <input
                type="text"
                value={currentUser?.name || ""}
                onChange={(e) =>
                  onUpdateCurrentUser({
                    ...currentUser,
                    name: e.target.value,
                  })
                }
                placeholder="Your display name"
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <span className="text-[11px] text-gray-500 block mb-1.5">
              Live Cursor Color:
            </span>
            <div className="flex items-center gap-2">
              {COLLAB_PALETTE.map((pal) => (
                <button
                  type="button"
                  key={pal.hex}
                  onClick={() =>
                    onUpdateCurrentUser({ ...currentUser, color: pal.hex })
                  }
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    currentUser?.color === pal.hex
                      ? "ring-2 ring-offset-2 ring-purple-600 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: pal.hex }}
                  title={pal.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Invite Link & Role Selector */}
        <div className="space-y-3 mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Select Role for Link
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setInvitedRole("owner")}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                invitedRole === "owner"
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Owner</span>
            </button>

            <button
              type="button"
              onClick={() => setInvitedRole("editor")}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                invitedRole === "editor"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Edit3 className="w-4 h-4 text-purple-500" />
              <span>Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setInvitedRole("viewer")}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                invitedRole === "viewer"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Eye className="w-4 h-4 text-blue-500" />
              <span>Viewer</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Invite Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Invite Link ({invitedRole.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>

        {/* Active Collaborators In Room */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Active in this room ({activeCollaborators.length})
          </span>
          <div className="max-h-36 overflow-y-auto space-y-2">
            {activeCollaborators.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color || "#8B5CF6" }}
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {c.name} {c.isSelf && "(You)"}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {c.role || "editor"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteCollaboratorsModal;
