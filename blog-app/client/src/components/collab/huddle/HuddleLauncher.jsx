import React from "react";
import { Radio } from "lucide-react";

export default function HuddleLauncher({ activeRoomCall, onStart }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onStart(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
          activeRoomCall
            ? "bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse"
            : "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/80 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
        }`}
        title={
          activeRoomCall
            ? `Join ${activeRoomCall.callerName}'s active call!`
            : "Start Live Video/Audio Huddle"
        }
      >
        <Radio
          className={`w-3.5 h-3.5 ${
            activeRoomCall ? "text-white animate-ping" : "text-purple-600 dark:text-purple-400"
          }`}
        />
        <span>{activeRoomCall ? "Join Huddle (Active)" : "Huddle"}</span>
      </button>
    </div>
  );
}
