"use client";

import { WindowState } from "./useWindows";
import { useEffect, useState } from "react";

interface Props {
  windows: WindowState[];
  onTaskClick: (id: string) => void;
  onStartClick: () => void;
  activeUser?: string | null;
}

export default function Taskbar({ windows, onTaskClick, onStartClick, activeUser }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center gap-1 px-1 raised"
      style={{
        height: 32,
        background: "var(--win-silver)",
        zIndex: 9999,
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
      }}
    >
      {/* Start button */}
      <button
        className="raised flex items-center gap-1 px-2 font-bold"
        style={{
          height: 22,
          fontSize: 11,
          background: "var(--win-silver)",
          minWidth: 54,
        }}
        onClick={onStartClick}
      >
        <span style={{ fontSize: 14 }}>⊞</span>
        <span>Start</span>
      </button>

      <div className="w-px self-stretch mx-0.5" style={{ background: "var(--win-dark)" }} />

      {/* Open windows */}
      <div className="flex items-center gap-1 flex-1 overflow-hidden">
        {windows.map((w) => (
          <button
            key={w.id}
            className="flex items-center gap-1 px-2 truncate"
            style={{
              height: 22,
              fontSize: 11,
              minWidth: 80,
              maxWidth: 160,
              background: "var(--win-silver)",
              border: "2px solid",
              borderColor: w.minimized
                ? "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)"
                : "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
            }}
            onClick={() => onTaskClick(w.id)}
          >
            <span>{w.type === "skills-explorer" ? "📁" : w.type === "skill-detail" ? "📄" : w.type === "mcp-explorer" ? "🔌" : w.type === "mcp-detail" ? "🔌" : w.type === "install-guide" ? "📖" : "ℹ️"}</span>
            <span className="truncate">{w.title}</span>
          </button>
        ))}
      </div>

      {/* Active user */}
      {activeUser && (
        <>
          <div className="w-px self-stretch mx-0.5" style={{ background: "var(--win-dark)" }} />
          <div className="sunken px-2 flex items-center gap-1" style={{ height: 22, fontSize: 11 }}>
            <span>{activeUser === "hermes" ? "🪽" : "🦅"}</span>
            <span style={{ textTransform: "capitalize" }}>{activeUser}</span>
          </div>
        </>
      )}

      {/* Clock */}
      <div
        className="sunken px-2 flex items-center"
        style={{ height: 22, fontSize: 11, minWidth: 50, justifyContent: "center" }}
      >
        {time}
      </div>
    </div>
  );
}
