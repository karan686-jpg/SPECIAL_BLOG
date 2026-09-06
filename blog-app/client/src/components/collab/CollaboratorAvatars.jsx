import React from "react";
import { useOthers, useSelf, useStatus } from "./liveblocks.config";
import { Users, Wifi, WifiOff } from "lucide-react";

const CollaboratorAvatars = () => {
  const others = useOthers();
  const self = useSelf();
  const status = useStatus();

  const totalCollaborators = (others ? others.length : 0) + (self ? 1 : 0);

  const getRoleBadge = (role) => {
    switch (role) {
      case "owner":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
      case "editor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";
      case "viewer":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Live Connection Status */}
      <div className="hidden md:flex items-center gap-1.5 text-xs font-medium">
        {status === "connected" ? (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synced</span>
          </span>
        ) : status === "connecting" ? (
          <span className="flex items-center gap-1 text-amber-500">
            <Wifi className="w-3.5 h-3.5 animate-spin" />
            <span>Connecting...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-rose-500">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline</span>
          </span>
        )}
      </div>

      {/* Overlapping Avatar Stack */}
      <div className="flex items-center -space-x-2 overflow-hidden py-1">
        {/* Current User */}
        {self && (
          <div
            className="relative group cursor-pointer"
            title={`${self.presence?.name || "You"} (You - ${self.presence?.role || "Editor"})`}
          >
            <div
              style={{ borderColor: self.presence?.color || "#8B5CF6" }}
              className="w-8 h-8 rounded-full border-2 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-xs ring-2 ring-white dark:ring-gray-950 transition-transform hover:scale-110"
            >
              <img
                src={
                  self.presence?.avatar ||
                  `https://api.dicebear.com/7.x/notionists/svg?seed=You`
                }
                alt={self.presence?.name || "You"}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950" />

            {/* Custom Tooltip */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
              <div className="bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-1.5">
                <span>{self.presence?.name || "You"}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${getRoleBadge(
                    self.presence?.role || "editor"
                  )}`}
                >
                  {self.presence?.role || "editor"}
                </span>
                <span className="text-gray-400 text-[10px]">(You)</span>
              </div>
            </div>
          </div>
        )}

        {/* Other Active Collaborators */}
        {others &&
          others.map(({ connectionId, presence }) => (
            <div
              key={connectionId}
              className="relative group cursor-pointer"
              title={`${presence?.name || "Anonymous"} (${presence?.role || "Collaborator"})`}
            >
              <div
                style={{ borderColor: presence?.color || "#3B82F6" }}
                className="w-8 h-8 rounded-full border-2 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-xs ring-2 ring-white dark:ring-gray-950 transition-transform hover:scale-110"
              >
                <img
                  src={
                    presence?.avatar ||
                    `https://api.dicebear.com/7.x/notionists/svg?seed=${connectionId}`
                  }
                  alt={presence?.name || "Collaborator"}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950" />

              {/* Custom Tooltip */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                <div className="bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-1.5">
                  <span>{presence?.name || `Collaborator #${connectionId}`}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${getRoleBadge(
                      presence?.role || "editor"
                    )}`}
                  >
                    {presence?.role || "editor"}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
        <Users className="w-3.5 h-3.5" />
        <span>{totalCollaborators} live</span>
      </div>
    </div>
  );
};

export default CollaboratorAvatars;
