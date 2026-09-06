import React from "react";
import { useBroadcastEvent } from "./liveblocks.config";
import { useWebRTC } from "./huddle/useWebRTC";
import { useDraggable } from "./huddle/useDraggable";
import HuddleLauncher from "./huddle/HuddleLauncher";
import HuddleHeader from "./huddle/HuddleHeader";
import HuddleVideoCanvas from "./huddle/HuddleVideoCanvas";
import HuddleControls from "./huddle/HuddleControls";

/**
 * 🎙️ CollabHuddle Orchestrator Component
 *
 * Modularized Architecture:
 * - useWebRTC: Media streams, STUN, signaling, screen share, and mic level analysis
 * - useDraggable: Viewport-clamped drag coordinates and corner snap presets
 * - HuddleLauncher: Header trigger button (pulsing presence indicator)
 * - HuddleHeader: Window header, snap dropdown, and mode switchers
 * - HuddleVideoCanvas: 50/50 Grid vs. PiP video rendering
 * - HuddleControls: Bottom toolbar with mic equalizer, cam, screen share, and leave
 */
export default function CollabHuddle({ currentUser }) {
  const broadcast = useBroadcastEvent();

  // 1. WebRTC & Media Lifecycle Hook
  const webrtc = useWebRTC({ currentUser, broadcast });

  // 2. Window Drag & Snap Physics Hook
  const draggable = useDraggable({
    isMinimized: webrtc.isMinimized,
    layoutMode: webrtc.layoutMode,
  });

  // 3. Render Launcher in Studio Header when not in call
  if (!webrtc.isInCall) {
    return (
      <HuddleLauncher
        activeRoomCall={webrtc.activeRoomCall}
        onStart={webrtc.startCall}
      />
    );
  }

  // 4. Floating Movable Video Huddle Window
  return (
    <>
      <div
        style={draggable.dragStyle}
        className="fixed top-0 left-0 z-50 flex flex-col select-none touch-none"
      >
        <div
          className={`bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transition-all ${
            webrtc.isMinimized
              ? "w-72 sm:w-80 shadow-lg"
              : webrtc.layoutMode === "grid"
              ? "w-[340px] sm:w-[460px]"
              : "w-80 sm:w-96"
          }`}
        >
          {/* Header Bar */}
          <HuddleHeader
            callStatus={webrtc.callStatus}
            isMinimized={webrtc.isMinimized}
            setIsMinimized={webrtc.setIsMinimized}
            layoutMode={webrtc.layoutMode}
            setLayoutMode={webrtc.setLayoutMode}
            showSnapMenu={draggable.showSnapMenu}
            setShowSnapMenu={draggable.setShowSnapMenu}
            snapToCorner={draggable.snapToCorner}
            handleMouseDown={draggable.handleMouseDown}
            handleTouchStart={draggable.handleTouchStart}
          />

          {/* Dual Video Canvas */}
          {!webrtc.isMinimized && (
            <HuddleVideoCanvas
              layoutMode={webrtc.layoutMode}
              callStatus={webrtc.callStatus}
              peerName={webrtc.peerName}
              isPreviewMode={webrtc.isPreviewMode}
              togglePreviewMode={webrtc.togglePreviewMode}
              localVideoRef={webrtc.localVideoRef}
              remoteVideoRef={webrtc.remoteVideoRef}
              isVideoEnabled={webrtc.isVideoEnabled}
              isScreenSharing={webrtc.isScreenSharing}
            />
          )}

          {/* Call Controls Toolbar */}
          <HuddleControls
            isAudioEnabled={webrtc.isAudioEnabled}
            toggleAudio={webrtc.toggleAudio}
            micVolume={webrtc.micVolume}
            isVideoEnabled={webrtc.isVideoEnabled}
            toggleVideo={webrtc.toggleVideo}
            isScreenSharing={webrtc.isScreenSharing}
            toggleScreenShare={webrtc.toggleScreenShare}
            isMinimized={webrtc.isMinimized}
            leaveCall={webrtc.leaveCall}
          />
        </div>
      </div>

      {/* Persistent Audio Tag for Remote Peer Voice */}
      <audio
        ref={webrtc.remoteAudioRef}
        autoPlay
        playsInline
        className="hidden"
      />
    </>
  );
}
