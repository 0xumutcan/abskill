"use client";

import { useRef, useEffect, ReactNode } from "react";
import { WindowState } from "./useWindows";

const MIN_W = 280;
const MIN_H = 180;

type ResizeHandle = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

interface ResizeDrag {
  handle: ResizeHandle;
  startX: number;
  startY: number;
  startWinX: number;
  startWinY: number;
  startW: number;
  startH: number;
}

interface Props {
  win: WindowState;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (x: number, y: number, width: number, height: number) => void;
  children: ReactNode;
  isActive: boolean;
}

const HANDLE_CURSOR: Record<ResizeHandle, string> = {
  n: "n-resize", s: "s-resize",
  e: "e-resize", w: "w-resize",
  nw: "nw-resize", ne: "ne-resize",
  sw: "sw-resize", se: "se-resize",
};

export default function Window({ win, onClose, onFocus, onMinimize, onMaximize, onMove, onResize, children, isActive }: Props) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<ResizeDrag | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Move
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        onMove(
          Math.max(0, dragRef.current.winX + dx),
          Math.max(0, dragRef.current.winY + dy)
        );
        return;
      }

      // Resize
      if (resizeRef.current) {
        const r = resizeRef.current;
        const dx = e.clientX - r.startX;
        const dy = e.clientY - r.startY;

        let x = r.startWinX;
        let y = r.startWinY;
        let w = r.startW;
        let h = r.startH;

        if (r.handle.includes("e")) w = Math.max(MIN_W, r.startW + dx);
        if (r.handle.includes("s")) h = Math.max(MIN_H, r.startH + dy);
        if (r.handle.includes("w")) {
          w = Math.max(MIN_W, r.startW - dx);
          x = r.startWinX + (r.startW - w);
        }
        if (r.handle.includes("n")) {
          h = Math.max(MIN_H, r.startH - dy);
          y = r.startWinY + (r.startH - h);
        }

        onResize(x, y, w, h);
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onMove, onResize]);

  if (win.minimized) return null;

  const style = win.maximized
    ? { left: 0, top: 0, width: "100vw", height: "calc(100vh - 32px)", zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  const startResize = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (win.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWinX: win.x,
      startWinY: win.y,
      startW: win.width,
      startH: win.height,
    };
  };

  const EDGE = 5;   // px — edge strip thickness
  const CORNER = 10; // px — corner hit area

  return (
    <div
      className="absolute flex flex-col raised"
      style={{ ...style, background: "var(--win-silver)" }}
      onMouseDown={onFocus}
    >
      {/* ── Resize handles (hidden, positioned on edges) ── */}
      {!win.maximized && (
        <>
          {/* Edges */}
          <div style={{ position:"absolute", top:0, left:CORNER, right:CORNER, height:EDGE, cursor:"n-resize", zIndex:10 }}
            onMouseDown={(e) => startResize(e, "n")} />
          <div style={{ position:"absolute", bottom:0, left:CORNER, right:CORNER, height:EDGE, cursor:"s-resize", zIndex:10 }}
            onMouseDown={(e) => startResize(e, "s")} />
          <div style={{ position:"absolute", top:CORNER, bottom:CORNER, left:0, width:EDGE, cursor:"w-resize", zIndex:10 }}
            onMouseDown={(e) => startResize(e, "w")} />
          <div style={{ position:"absolute", top:CORNER, bottom:CORNER, right:0, width:EDGE, cursor:"e-resize", zIndex:10 }}
            onMouseDown={(e) => startResize(e, "e")} />
          {/* Corners */}
          <div style={{ position:"absolute", top:0, left:0, width:CORNER, height:CORNER, cursor:"nw-resize", zIndex:11 }}
            onMouseDown={(e) => startResize(e, "nw")} />
          <div style={{ position:"absolute", top:0, right:0, width:CORNER, height:CORNER, cursor:"ne-resize", zIndex:11 }}
            onMouseDown={(e) => startResize(e, "ne")} />
          <div style={{ position:"absolute", bottom:0, left:0, width:CORNER, height:CORNER, cursor:"sw-resize", zIndex:11 }}
            onMouseDown={(e) => startResize(e, "sw")} />
          <div style={{ position:"absolute", bottom:0, right:0, width:CORNER, height:CORNER, cursor:"se-resize", zIndex:11 }}
            onMouseDown={(e) => startResize(e, "se")} />
        </>
      )}

      {/* Title bar */}
      <div
        className="flex items-center gap-1 px-1 py-0.5 flex-shrink-0"
        style={{
          background: isActive
            ? "linear-gradient(to right, var(--win-titlebar), var(--win-titlebar-end))"
            : "var(--win-titlebar-inactive)",
          height: 22,
          cursor: "default",
        }}
        onMouseDown={(e) => {
          if (win.maximized) return;
          e.preventDefault();
          dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
        }}
        onDoubleClick={onMaximize}
      >
        <span className="text-white text-xs font-bold flex-1 truncate pl-0.5 select-none" style={{ fontSize: 11 }}>
          {win.type === "skills-explorer" ? "📁 " : win.type === "skill-detail" ? "📄 " : win.type === "install-guide" ? "📖 " : "ℹ️ "}
          {win.title}
        </span>
        <div className="flex gap-0.5">
          <button className="title-btn" onMouseDown={(e) => e.stopPropagation()} onClick={onMinimize}>
            <span style={{ fontSize: 8, lineHeight: 1, marginBottom: -3 }}>_</span>
          </button>
          <button className="title-btn" onMouseDown={(e) => e.stopPropagation()} onClick={onMaximize}>
            <span style={{ fontSize: 9, lineHeight: 1 }}>{win.maximized ? "❐" : "□"}</span>
          </button>
          <button className="title-btn" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
            <span style={{ fontSize: 9, fontWeight: "bold" }}>✕</span>
          </button>
        </div>
      </div>

      {/* Menu bar (only explorer) */}
      {win.type === "skills-explorer" && (
        <div className="flex gap-4 px-2 py-0.5 text-xs border-b" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
          {["File", "Edit", "View", "Help"].map((m) => (
            <span key={m} className="cursor-default hover:bg-blue-800 hover:text-white px-1">{m}</span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}
