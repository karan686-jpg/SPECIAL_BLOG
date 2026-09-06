import React from "react";
import { Radio, VideoOff, Sparkles } from "lucide-react";

export default function HuddleVideoCanvas({
  layoutMode,
  callStatus,
  peerName,
  isPreviewMode,
  togglePreviewMode,
  localVideoRef,
  remoteVideoRef,
  isVideoEnabled,
  isScreenSharing,
}) {
  return (
    <div className="bg-black">
      {layoutMode === "grid" ? (
        /* 👥 Grid Mode: Equal Dual Tiles (Remote Peer + Local You) */
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-950 h-56">
          {/* Remote Peer Video Tile */}
          <div className="relative rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center border border-gray-800">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {callStatus !== "connected" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 bg-gray-950/90">
                <Radio className="w-5 h-5 text-purple-400 animate-pulse mb-1" />
                <p className="text-[10px] text-gray-300 font-semibold">
                  Waiting for Co-author
                </p>
              </div>
            )}
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/70 px-1.5 py-0.5 rounded text-gray-200">
              👤 {peerName}
            </span>
          </div>

          {/* Local Self Video Tile */}
          <div className="relative rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center border border-purple-500/50">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                !isVideoEnabled ? "hidden" : ""
              }`}
            />
            {!isVideoEnabled && (
              <div className="flex flex-col items-center justify-center text-gray-400 text-[10px]">
                <VideoOff className="w-4 h-4 mb-1" />
                <span>Cam Off</span>
              </div>
            )}
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/70 px-1.5 py-0.5 rounded text-gray-200 flex items-center gap-1">
              <span>👤 You</span>
              {isScreenSharing && (
                <span className="text-[8px] bg-purple-600 px-1 rounded text-white font-mono">
                  Screen
                </span>
              )}
            </span>
          </div>
        </div>
      ) : (
        /* 🖼️ PiP Mode: Remote Peer Full Canvas + Floating Self Cam */
        <div className="relative w-full h-56 bg-black flex items-center justify-center overflow-hidden">
          {/* 1. Remote Peer Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Remote Peer Name Badge (Visible when connected) */}
          {callStatus === "connected" && (
            <span className="absolute bottom-2.5 left-3 text-[10px] font-bold bg-black/75 px-2 py-0.5 rounded-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>👤 {peerName}</span>
            </span>
          )}

          {/* Placeholder if remote peer hasn't connected yet */}
          {callStatus !== "connected" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/90 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 mb-2 animate-pulse">
                <Radio className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-200">
                Waiting for co-authors to join...
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Share this room URL or test layout with preview below:
              </p>
              <button
                type="button"
                onClick={togglePreviewMode}
                className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg text-[10px] font-semibold border border-purple-700 transition cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>
                  {isPreviewMode ? "Exit Preview" : "Preview Co-Author Video"}
                </span>
              </button>
            </div>
          )}

          {/* 2. Floating Picture-in-Picture: Local Self Video */}
          <div className="absolute top-3 right-3 w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 border-purple-500/80 shadow-lg bg-gray-900 z-10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                !isVideoEnabled ? "hidden" : ""
              }`}
            />
            {!isVideoEnabled && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-[10px] text-gray-400">
                <VideoOff className="w-4 h-4 mb-1" />
                <span>Off</span>
              </div>
            )}
            <span className="absolute bottom-1 left-1.5 text-[9px] font-bold bg-black/60 px-1 rounded text-gray-300">
              {isScreenSharing ? "Screen" : "You"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
