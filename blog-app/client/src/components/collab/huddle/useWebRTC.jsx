import React, { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useEventListener } from "../liveblocks.config";

// Google Public STUN Servers for WebRTC NAT Traversal
const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export function useWebRTC({ currentUser, broadcast }) {
  // Call States
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [layoutMode, setLayoutMode] = useState("pip"); // "pip" | "grid"
  const [callStatus, setCallStatus] = useState("idle"); // "idle" | "connecting" | "connected"
  const [peerName, setPeerName] = useState("Collaborator");
  const [activeRoomCall, setActiveRoomCall] = useState(null); // { callerName, callerId }
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [micVolume, setMicVolume] = useState(0); // 0 to 100

  // Media & WebRTC Refs
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const previewVideoRef = useRef(null);
  const pcRef = useRef(null);
  const isInitiatorRef = useRef(false);

  // Audio Level Meter Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // 1. Audio Activity Meter (Sound proof)
  const startAudioMeter = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(update);
      };
      animFrameRef.current = requestAnimationFrame(update);
    } catch (e) {
      console.warn("Audio meter init error:", e);
    }
  };

  const stopAudioMeter = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicVolume(0);
  };

  // 2. Clean up Peer Connection and Media Tracks
  const cleanupCall = useCallback(() => {
    stopAudioMeter();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    remoteStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    if (previewVideoRef.current) previewVideoRef.current.srcObject = null;

    setIsInCall(false);
    setIsScreenSharing(false);
    setIsPreviewMode(false);
    setCallStatus("idle");
  }, []);

  // 3. Initialize PeerConnection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_CONFIG);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        broadcast({
          type: "webrtc-candidate",
          candidate: event.candidate,
          senderId: currentUser?.id,
        });
      }
    };

    pc.ontrack = (event) => {
      const incomingStream = event.streams[0] || new MediaStream([event.track]);
      remoteStreamRef.current = incomingStream;

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = incomingStream;
        remoteVideoRef.current.muted = false;
        remoteVideoRef.current.play().catch((err) => console.warn("Remote video play error:", err));
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = incomingStream;
        remoteAudioRef.current.play().catch((err) => console.warn("Remote audio play error:", err));
      }
      setCallStatus("connected");
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setCallStatus("connected");
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        setCallStatus("connecting");
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (track.kind === "video" && isScreenSharing && screenStreamRef.current) {
          const sTrack = screenStreamRef.current.getVideoTracks()[0];
          if (sTrack) {
            pc.addTrack(sTrack, screenStreamRef.current);
            return;
          }
        }
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pcRef.current = pc;
    return pc;
  }, [broadcast, currentUser?.id, isScreenSharing]);

  // 4. Persistent Stream-to-DOM Binding Effect
  useEffect(() => {
    if (!isInCall) return;

    if (localVideoRef.current) {
      const activeLocal = isScreenSharing && screenStreamRef.current
        ? screenStreamRef.current
        : localStreamRef.current;
      if (activeLocal && localVideoRef.current.srcObject !== activeLocal) {
        localVideoRef.current.srcObject = activeLocal;
        localVideoRef.current.play().catch(() => {});
      }
    }

    const activeRemote = isPreviewMode
      ? localStreamRef.current
      : remoteStreamRef.current;

    if (remoteVideoRef.current) {
      if (activeRemote && remoteVideoRef.current.srcObject !== activeRemote) {
        remoteVideoRef.current.srcObject = activeRemote;
        remoteVideoRef.current.muted = isPreviewMode;
        remoteVideoRef.current.play().catch((e) => console.warn("Remote play err:", e));
      }
    }

    if (remoteAudioRef.current && !isPreviewMode && remoteStreamRef.current) {
      if (remoteAudioRef.current.srcObject !== remoteStreamRef.current) {
        remoteAudioRef.current.srcObject = remoteStreamRef.current;
        remoteAudioRef.current.play().catch(() => {});
      }
    }
  }, [isInCall, layoutMode, isScreenSharing, isPreviewMode]);

  // 5. Start Call
  const startCall = async (video = true) => {
    try {
      setCallStatus("connecting");
      setIsVideoEnabled(video);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: { ideal: 640 }, height: { ideal: 480 } } : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;
      startAudioMeter(stream);

      setIsInCall(true);
      setActiveRoomCall(null);
      toast.success(video ? "Video Huddle Started!" : "Audio Huddle Started!");

      broadcast({
        type: "webrtc-join",
        senderId: currentUser?.id,
        senderName: currentUser?.name || "Co-author",
        hasVideo: video,
      });
    } catch (err) {
      console.error("Camera/Mic permission error:", err);
      toast.error("Could not access camera/mic. Please allow browser permissions.");
      cleanupCall();
    }
  };

  // 6. Leave Call
  const leaveCall = () => {
    broadcast({
      type: "webrtc-leave",
      senderId: currentUser?.id,
    });
    cleanupCall();
    toast("Left the Huddle");
  };

  // 7. Toggle Mic
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        toast(audioTrack.enabled ? "Microphone Unmuted" : "Microphone Muted", {
          icon: audioTrack.enabled ? "🎙️" : "🔇",
        });
      }
    }
  };

  // 8. Toggle Cam
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        toast(videoTrack.enabled ? "Camera Turned On" : "Camera Turned Off", {
          icon: videoTrack.enabled ? "📹" : "📷",
        });
      }
    }
  };

  // 9. Stop Screen Share
  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (localStreamRef.current) {
      const camTrack = localStreamRef.current.getVideoTracks()[0];
      if (pcRef.current && camTrack) {
        const sender = pcRef.current.getSenders().find((s) => s.track && s.track.kind === "video");
        if (sender) {
          sender.replaceTrack(camTrack).catch((err) => console.warn("Error restoring cam track:", err));
        }
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.play().catch(() => {});
      }
    }

    setIsScreenSharing(false);
    toast("Stopped screen sharing", { icon: "🖥️" });
  }, []);

  // 10. Toggle Screen Share
  const toggleScreenShare = async () => {
    if (!isInCall) {
      toast.error("Please start or join the call first!");
      return;
    }

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: true,
        });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        if (pcRef.current) {
          const sender = pcRef.current.getSenders().find((s) => s.track && s.track.kind === "video");
          if (sender) {
            await sender.replaceTrack(screenTrack);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
          localVideoRef.current.play().catch(() => {});
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
        toast.success("Sharing screen with co-authors!");
      } catch (err) {
        console.warn("Screen share cancelled or not allowed:", err);
      }
    } else {
      stopScreenShare();
    }
  };

  // 11. Toggle Preview Mode
  const togglePreviewMode = () => {
    const nextState = !isPreviewMode;
    setIsPreviewMode(nextState);
    if (nextState) {
      setPeerName("Karan (Preview Co-author)");
      setCallStatus("connected");
      if (localStreamRef.current && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = localStreamRef.current;
        remoteVideoRef.current.muted = true;
        remoteVideoRef.current.play().catch(() => {});
      }
      toast.success("Preview mode: Dual-participant layout active!");
    } else {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current || null;
        remoteVideoRef.current.muted = false;
      }
      setCallStatus(remoteStreamRef.current ? "connected" : "connecting");
      setPeerName(remoteStreamRef.current ? "Co-author" : "Collaborator");
    }
  };

  // 12. Signaling Event Listener
  useEventListener(async ({ event }) => {
    if (!event || event.senderId === currentUser?.id) return;

    switch (event.type) {
      case "webrtc-join": {
        if (!isInCall) {
          setActiveRoomCall({
            callerName: event.senderName || "Co-author",
            callerId: event.senderId,
          });
          toast(
            (t) => (
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold">
                  📞 {event.senderName || "Co-author"} started a Live Huddle!
                </span>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    startCall(true);
                  }}
                  className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Join
                </button>
              </div>
            ),
            { duration: 8000 }
          );
          return;
        }

        setPeerName(event.senderName || "Co-author");
        isInitiatorRef.current = true;

        const pc = createPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        broadcast({
          type: "webrtc-offer",
          sdp: offer,
          senderId: currentUser?.id,
          senderName: currentUser?.name || "Co-author",
        });
        break;
      }

      case "webrtc-offer": {
        if (!isInCall) {
          setActiveRoomCall({
            callerName: event.senderName || "Co-author",
            callerId: event.senderId,
          });
          return;
        }

        setPeerName(event.senderName || "Co-author");
        isInitiatorRef.current = false;

        const pc = createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(event.sdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        broadcast({
          type: "webrtc-answer",
          sdp: answer,
          senderId: currentUser?.id,
        });
        break;
      }

      case "webrtc-answer": {
        if (pcRef.current && pcRef.current.signalingState !== "closed") {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(event.sdp));
        }
        break;
      }

      case "webrtc-candidate": {
        if (pcRef.current && event.candidate) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(event.candidate));
          } catch (e) {
            console.warn("Failed to add ICE candidate", e);
          }
        }
        break;
      }

      case "webrtc-leave": {
        remoteStreamRef.current = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
        setCallStatus("connecting");
        toast(`${peerName} left the huddle`);
        break;
      }

      default:
        break;
    }
  });

  // 13. Unmount Cleanup
  useEffect(() => {
    return () => cleanupCall();
  }, [cleanupCall]);

  return {
    isInCall,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    isMinimized,
    setIsMinimized,
    layoutMode,
    setLayoutMode,
    callStatus,
    peerName,
    activeRoomCall,
    isPreviewMode,
    micVolume,
    localVideoRef,
    remoteVideoRef,
    remoteAudioRef,
    startCall,
    leaveCall,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    togglePreviewMode,
  };
}
