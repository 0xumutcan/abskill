"use client";

import { useState, useCallback } from "react";

export type WindowType = "skills-explorer" | "skill-detail" | "mcp-explorer" | "mcp-detail" | "help" | "games-folder" | "minesweeper" | "hangman" | "solitaire" | "install-guide" | "md-editor" | "reading-list" | "submit-skill";

export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  data?: unknown;
}

let zCounter = 100;

export function useWindows() {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback((type: WindowType, data?: unknown) => {
    const configs: Record<WindowType, { title: string; width: number; height: number }> = {
      "skills-explorer": { title: "abSkill Explorer", width: 640, height: 420 },
      "skill-detail":    { title: "Skill", width: 580, height: 460 },
      "mcp-explorer":    { title: "MCP Servers", width: 640, height: 420 },
      "mcp-detail":      { title: "MCP Server", width: 560, height: 480 },
      "help":            { title: "What is? — Help Guide", width: 680, height: 500 },
      "games-folder":    { title: "Games", width: 400, height: 300 },
      "minesweeper":     { title: "Minesweeper", width: 220, height: 300 },
      "hangman":         { title: "Hangman", width: 420, height: 420 },
      "solitaire":       { title: "Solitaire", width: 740, height: 540 },
      "install-guide":   { title: "Installation Guide", width: 660, height: 520 },
      "md-editor":       { title: "editor.md", width: 820, height: 560 },
      "reading-list":    { title: "Recommended Readings", width: 700, height: 480 },
      "submit-skill":    { title: "Submit a Skill", width: 480, height: 320 },
    };

    const cfg = configs[type];
    const offset = windows.length * 24;

    setWindows((prev) => {
      if (type !== "skill-detail") {
        const existing = prev.find((w) => w.type === type);
        if (existing) {
          zCounter++;
          return prev.map((w) =>
            w.id === existing.id ? { ...w, zIndex: zCounter, minimized: false } : w
          );
        }
      }

      zCounter++;
      const id = `${type}-${Date.now()}`;
      return [
        ...prev,
        {
          id,
          type,
          title: type === "skill-detail"
            ? (data as { name: string })?.name ?? cfg.title
            : type === "install-guide"
            ? `${(data as { platform: string })?.platform === "openclaw" ? "OpenClaw" : "Hermes"} Installation Guide`
            : cfg.title,
          x: 80 + offset,
          y: 60 + offset,
          width: cfg.width,
          height: cfg.height,
          zIndex: zCounter,
          minimized: false,
          maximized: false,
          data,
        },
      ];
    });
  }, [windows.length]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    zCounter++;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter } : w))
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const resizeWindow = useCallback((id: string, x: number, y: number, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y, width, height } : w))
    );
  }, []);

  return { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow, resizeWindow };
}
