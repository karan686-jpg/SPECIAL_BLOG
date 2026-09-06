import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, FastForward } from "lucide-react";

const AudioPlayer = ({ title, contentText, readTime }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const keepAliveIntervalRef = useRef(null);

  const cleanFullText = `${title || ""}. ${contentText || ""}`.trim();

  // Clear Chromium keepalive timer
  const clearKeepAlive = () => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  };

  // Chromium bug workaround: keeps speech synthesis alive during long articles
  const startKeepAlive = () => {
    clearKeepAlive();
    keepAliveIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  // Cleanup when navigating away or unmounting
  useEffect(() => {
    return () => {
      clearKeepAlive();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (rate) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech audio.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanFullText);
    utterance.rate = rate;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Online"))) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      clearKeepAlive();
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      // "interrupted" or "canceled" are normal when user pauses or resets
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.error("SpeechSynthesis error:", e);
      }
      clearKeepAlive();
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    startKeepAlive();
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePlay = () => {
    if (!("speechSynthesis" in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      startKeepAlive();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      speakText(playbackRate);
    }
  };

  const handlePause = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      clearKeepAlive();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      clearKeepAlive();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleSpeedChange = () => {
    const nextRates = [1, 1.25, 1.5, 2];
    const currentIndex = nextRates.indexOf(playbackRate);
    const nextRate = nextRates[(currentIndex + 1) % nextRates.length];
    setPlaybackRate(nextRate);

    if (isPlaying || isPaused) {
      speakText(nextRate);
    }
  };

  if (!cleanFullText) return null;

  return (
    <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-200/80 dark:border-purple-900/40 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md">
      {/* Left Info: Icon & Article details */}
      <div className="flex items-center gap-3.5">
        <div
          className={`p-3 rounded-xl transition-all duration-300 ${
            isPlaying
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105"
              : "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
          }`}
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Listen to this article
            </h4>
            {isPlaying && (
              <span className="flex items-end gap-0.5 h-3.5 px-1" title="Playing">
                <span className="w-1 h-3.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce"></span>
                <span className="w-1 h-2 bg-indigo-500 dark:bg-indigo-300 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-1 h-3 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {readTime ? `${readTime} min audio narration` : "Instant narration"} • Web Speech
          </p>
        </div>
      </div>

      {/* Right Controls: Play/Pause, Reset, Speed */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-purple-500/25 cursor-pointer"
          title={isPlaying ? "Pause narration" : "Play narration"}
          type="button"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{isPaused ? "Resume" : "Play"}</span>
            </>
          )}
        </button>

        {/* Reset / Stop Button */}
        {(isPlaying || isPaused) && (
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Stop and reset to start"
            type="button"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Speed Toggle Pill */}
        <button
          onClick={handleSpeedChange}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 transition-all cursor-pointer shadow-2xs"
          title="Change playback speed"
          type="button"
        >
          <FastForward className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{playbackRate}x</span>
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
