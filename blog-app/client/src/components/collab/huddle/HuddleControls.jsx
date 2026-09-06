import React from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from "lucide-react";

export default function HuddleControls({
  isAudioEnabled,
  toggleAudio,
  micVolume,
  isVideoEnabled,
  toggleVideo,
  isScreenSharing,
  toggleScreenShare,
  isMinimized,
  leaveCall,
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 bg-gray-900 border-t border-gray-800">
      <div className="flex items-center gap-1.5">
        {/* Mic Mute/Unmute */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`p-2 rounded-full transition cursor-pointer ${
            isAudioEnabled
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isAudioEnabled ? (
            <Mic className="w-3.5 h-3.5" />
          ) : (
            <MicOff className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Live Mic Activity Visualizer (Sound proof) */}
        {isAudioEnabled && (
          <div
            className="flex items-end gap-0.5 h-4 px-1 py-0.5 rounded bg-gray-800/80 border border-gray-700/50"
            title="Microphone live voice activity"
          >
            <span
              className={`w-0.5 rounded-full transition-all duration-75 ${
                micVolume > 5 ? "bg-emerald-400" : "bg-gray-600"
              }`}
              style={{
                height: `${Math.max(3, Math.min(12, (micVolume * 12) / 100))}px`,
              }}
            />
            <span
              className={`w-0.5 rounded-full transition-all duration-75 ${
                micVolume > 15 ? "bg-emerald-400" : "bg-gray-600"
              }`}
              style={{
                height: `${Math.max(4, Math.min(14, (micVolume * 14) / 100))}px`,
              }}
            />
            <span
              className={`w-0.5 rounded-full transition-all duration-75 ${
                micVolume > 25 ? "bg-emerald-400" : "bg-gray-600"
              }`}
              style={{
                height: `${Math.max(3, Math.min(10, (micVolume * 10) / 100))}px`,
              }}
            />
          </div>
        )}

        {/* Camera On/Off */}
        <button
          type="button"
          onClick={toggleVideo}
          className={`p-2 rounded-full transition cursor-pointer ${
            isVideoEnabled
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
        >
          {isVideoEnabled ? (
            <Video className="w-3.5 h-3.5" />
          ) : (
            <VideoOff className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Screen Share */}
        {!isMinimized && (
          <button
            type="button"
            onClick={toggleScreenShare}
            className={`p-2 rounded-full transition cursor-pointer ${
              isScreenSharing
                ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400/50"
                : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
            title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isMinimized && (
          <span className="text-[10px] text-gray-400 font-mono">
            Drag header to move
          </span>
        )}

        {/* End Call Button */}
        <button
          type="button"
          onClick={leaveCall}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
          title="Leave Huddle"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}
