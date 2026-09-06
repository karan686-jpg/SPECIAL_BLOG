import { useState, useRef, useEffect } from "react";

export function useDraggable({ isMinimized, layoutMode }) {
  const [position, setPosition] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    const h = typeof window !== "undefined" ? window.innerHeight : 768;
    return {
      x: Math.max(16, w - 420),
      y: Math.max(80, h - 400),
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleStartDrag = (clientX, clientY) => {
    setIsDragging(true);
    dragOffsetRef.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    handleStartDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    if (e.touches && e.touches[0]) {
      handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;
      const cardWidth = isMinimized ? 300 : layoutMode === "grid" ? 440 : 380;
      const cardHeight = isMinimized ? 56 : 360;
      const maxX = Math.max(10, window.innerWidth - cardWidth - 10);
      const maxY = Math.max(10, window.innerHeight - cardHeight - 10);

      const newX = Math.max(10, Math.min(maxX, clientX - dragOffsetRef.current.x));
      const newY = Math.max(10, Math.min(maxY, clientY - dragOffsetRef.current.y));

      setPosition({ x: newX, y: newY });
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onEndDrag = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onEndDrag);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onEndDrag);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEndDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEndDrag);
    };
  }, [isDragging, isMinimized, layoutMode]);

  const snapToCorner = (corner) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cardWidth = isMinimized ? 300 : layoutMode === "grid" ? 440 : 380;
    const cardHeight = isMinimized ? 56 : 360;

    switch (corner) {
      case "top-right":
        setPosition({ x: w - cardWidth - 20, y: 74 });
        break;
      case "top-left":
        setPosition({ x: 20, y: 74 });
        break;
      case "bottom-left":
        setPosition({ x: 20, y: h - cardHeight - 20 });
        break;
      case "bottom-right":
      default:
        setPosition({ x: w - cardWidth - 20, y: h - cardHeight - 20 });
        break;
    }
    setShowSnapMenu(false);
  };

  const dragStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isDragging ? "none" : "transform 0.15s ease-out",
  };

  return {
    position,
    isDragging,
    showSnapMenu,
    setShowSnapMenu,
    handleMouseDown,
    handleTouchStart,
    snapToCorner,
    dragStyle,
  };
}
