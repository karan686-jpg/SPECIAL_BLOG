import React from "react";
import { Activity, X, UserCheck, MessageSquare, Save, History, Sparkles } from "lucide-react";

const ActivityFeedDrawer = ({ isOpen, onClose, activities = [] }) => {
  if (!isOpen) return null;

  const getActivityIcon = (type) => {
    switch (type) {
      case "join":
        return <UserCheck className="w-3.5 h-3.5 text-blue-500" />;
      case "comment":
        return <MessageSquare className="w-3.5 h-3.5 text-purple-500" />;
      case "snapshot":
        return <History className="w-3.5 h-3.5 text-amber-500" />;
      case "publish":
        return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Save className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <aside className="fixed top-16 right-0 w-80 sm:w-96 h-[calc(100vh-4rem)] z-40 bg-white/95 dark:bg-[#0c0e17]/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col transition-all animate-in slide-in-from-right-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Room Activity Feed
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <Activity className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-xs font-medium">No activity yet</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Collaborator actions and revisions will be logged here.
            </p>
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3 text-xs">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 mt-0.5">
                {getActivityIcon(act.type)}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200 leading-snug">
                  <span className="font-bold">{act.author}</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {act.action}
                  </span>
                </p>
                <span className="text-[10px] text-gray-400 font-mono">
                  {act.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default ActivityFeedDrawer;
