import React from "react";
import {
  GripHorizontal,
  ChevronDown,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  LayoutGrid,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function HuddleHeader({
  callStatus,
  isMinimized,
  setIsMinimized,
  layoutMode,
  setLayoutMode,
  showSnapMenu,
  setShowSnapMenu,
  snapToCorner,
  handleMouseDown,
  handleTouchStart,
}) {
  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="flex items-center justify-between px-3.5 py-2.5 bg-gray-800/90 border-b border-gray-700/60 text-xs cursor-grab active:cursor-grabbing select-none"
      title="Drag me anywhere on the screen!"
    >
      <div className="flex items-center gap-2">
        <GripHorizontal className="w-4 h-4 text-gray-400 hover:text-purple-400 transition-colors" />
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-bold tracking-tight text-gray-100">Live Huddle</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-700/70 text-gray-300 font-mono">
          {callStatus === "connected" ? "Connected" : "Waiting..."}
        </span>
      </div>

      {/* Window Controls: Snap Corner, Layout Toggle, Minimize */}
      <div className="flex items-center gap-1">
        {/* Snap Position Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSnapMenu(!showSnapMenu)}
            className="p-1 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition cursor-pointer"
            title="Move / Snap to Screen Corners"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showSnapMenu && (
            <div className="absolute right-0 top-7 w-36 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-1 z-50 text-[11px] font-semibold space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
              <p className="px-2.5 py-1 text-[10px] text-gray-400 uppercase font-mono">
                Snap Position
              </p>
              <button
                onClick={() => snapToCorner("top-right")}
                className="w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-gray-700 text-gray-200"
              >
                <span>Top Right</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => snapToCorner("top-left")}
                className="w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-gray-700 text-gray-200"
              >
                <span>Top Left</span>
                <ArrowUpLeft className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => snapToCorner("bottom-right")}
                className="w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-gray-700 text-gray-200"
              >
                <span>Bottom Right</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => snapToCorner("bottom-left")}
                className="w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-gray-700 text-gray-200"
              >
                <span>Bottom Left</span>
                <ArrowDownLeft className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Grid / PiP Layout Switcher */}
        {!isMinimized && (
          <button
            type="button"
            onClick={() => setLayoutMode(layoutMode === "pip" ? "grid" : "pip")}
            className={`p-1 rounded-lg transition cursor-pointer ${
              layoutMode === "grid"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
            title={
              layoutMode === "grid"
                ? "Switch to Picture-in-Picture View"
                : "Switch to Side-by-Side Dual Video Grid"
            }
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Minimize / Maximize */}
        <button
          type="button"
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white cursor-pointer"
          title={isMinimized ? "Maximize Window" : "Minimize Window"}
        >
          {isMinimized ? (
            <Maximize2 className="w-3.5 h-3.5" />
          ) : (
            <Minimize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
