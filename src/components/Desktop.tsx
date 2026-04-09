"use client";

import React, { useState, useCallback } from "react";
import { useWindows } from "./useWindows";
import Window from "./Window";
import Taskbar from "./Taskbar";
import SkillsExplorer from "./SkillsExplorer";
import SkillDetail from "./SkillDetail";
import MCPExplorer from "./MCPExplorer";
import MCPDetail from "./MCPDetail";
import HelpWindow from "./HelpWindow";
import BootScreen from "./BootScreen";
import UserSelect from "./UserSelect";
import GamesFolder from "./games/GamesFolder";
import Minesweeper from "./games/Minesweeper";
import Hangman from "./games/Hangman";
import Solitaire from "./games/Solitaire";
import InstallGuideWindow from "./InstallGuideWindow";
import MdEditorWindow from "./MdEditorWindow";
import DesktopChecklist from "./DesktopChecklist";
import ReadingListWindow from "./ReadingListWindow";
import { Skill } from "@/types/skill";
import { MCPServer } from "@/types/mcp";

const DESKTOP_ICONS = [
  { id: "skills-explorer", label: "Skills", icon: "📁" },
  { id: "mcp-explorer", label: "MCP Servers", icon: "🔌" },
];

export default function Desktop() {
  const [booted, setBooted] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [switchingUser, setSwitchingUser] = useState(false);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [highlightedIcon, setHighlightedIcon] = useState<string | null>(null);
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow, resizeWindow } = useWindows();
  const maxZ = Math.max(0, ...windows.map((w) => w.zIndex));
  const handleBootDone = useCallback(() => setBooted(true), []);
  const handleUserSelect = useCallback((id: string) => {
    setActiveUser(id);
    setUserSelected(true);
    setSwitchingUser(false);
  }, []);

  const handleOpenSkill = (skill: Skill) => {
    openWindow("skill-detail", skill);
  };

  const handleOpenMCP = (server: MCPServer) => {
    openWindow("mcp-detail", server);
  };

  const handleTaskClick = (id: string) => {
    const w = windows.find((w) => w.id === id);
    if (!w) return;
    if (w.minimized) {
      minimizeWindow(id);
      focusWindow(id);
    } else {
      minimizeWindow(id);
    }
  };

  if (!booted) {
    return <BootScreen onDone={handleBootDone} />;
  }

  if (!userSelected) {
    return (
      <UserSelect onSelect={handleUserSelect} />
    );
  }

  const wallpapers: Record<string, string> = {
    hermes: "/hermes.webp",
    openclaw: "/openclaw.webp",
  };

  const wallpaper = activeUser ? wallpapers[activeUser] : null;

  return (
    <>
      <div
        className="relative w-screen overflow-hidden"
        style={{ height: "calc(100vh - 32px)", background: "var(--win-bg)" }}
      >
        {/* Tiled wallpaper overlay */}
        {wallpaper && (
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${wallpaper})`,
            backgroundRepeat: "repeat",
            backgroundSize: "150px",
            opacity: 0.06,
            pointerEvents: "none",
            zIndex: 0,
          }} />
        )}
        {/* Getting Started checklist — top right */}
        <DesktopChecklist onHighlight={setHighlightedIcon} />

        {/* Desktop — deselect on background click */}
        <div
          className="flex flex-col gap-8 p-3"
          style={{ position: "relative", zIndex: 1 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedIcon(null); }}
        >
          {/* 1. What is? */}
          <div
            className="flex flex-col items-center gap-1 cursor-default p-1"
            style={{ width: 72 }}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon("help"); }}
            onDoubleClick={() => openWindow("help")}
          >
            <span style={{
              fontSize: 36,
              filter: selectedIcon === "help"
                ? "drop-shadow(1px 1px 0 rgba(0,0,0,0.5)) brightness(0.6) sepia(1) hue-rotate(180deg) saturate(4)"
                : "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))",
            }}>❓</span>
            <span className="text-center px-0.5" style={{
              fontSize: 11, lineHeight: 1.3, color: "white",
              textShadow: selectedIcon === "help" ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
              background: selectedIcon === "help" ? "var(--win-blue)" : "transparent",
              outline: selectedIcon === "help" ? "1px dotted rgba(255,255,255,0.8)" : "none",
            }}>What is?</span>
          </div>

          {/* 2. Install Guide — platform specific icon */}
          <div
            className="flex flex-col items-center gap-1 cursor-default p-1"
            style={{ width: 72, position: "relative" }}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon("install-guide"); }}
            onDoubleClick={() => openWindow("install-guide", { platform: activeUser })}
          >
            {highlightedIcon === "install-guide" && (
              <div className="icon-bounce-arrow" style={{
                position: "absolute", top: -26, left: 0, right: 0, textAlign: "center",
                fontSize: 14, color: "white", textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                zIndex: 20, pointerEvents: "none", lineHeight: 1,
              }}>▼</div>
            )}
            <div style={{
              width: 36,
              height: 36,
              position: "relative",
              filter: selectedIcon === "install-guide"
                ? "drop-shadow(1px 1px 0 rgba(0,0,0,0.5)) brightness(0.5)"
                : "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeUser === "openclaw" ? "/openclaw.webp" : "/hermes.webp"}
                alt="Install Guide"
                style={{ width: 36, height: 36, objectFit: "contain" }}
              />
              <div style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                background: "#1e90ff",
                fontSize: 8,
                lineHeight: "12px",
                textAlign: "center",
                border: "1px solid #808080",
                color: "white",
                fontWeight: "bold",
              }}>?</div>
            </div>
            <span className="text-center px-0.5" style={{
              fontSize: 11, lineHeight: 1.3, color: "white",
              textShadow: selectedIcon === "install-guide" ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
              background: selectedIcon === "install-guide" ? "var(--win-blue)" : "transparent",
              outline: selectedIcon === "install-guide" ? "1px dotted rgba(255,255,255,0.8)" : "none",
            }}>
              {activeUser === "openclaw" ? "OpenClaw Guide" : "Hermes Guide"}
            </span>
          </div>

          {/* 3. editor.md */}
          <div
            className="flex flex-col items-center gap-1 cursor-default p-1"
            style={{ width: 72, position: "relative" }}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon("md-editor"); }}
            onDoubleClick={() => openWindow("md-editor", { platform: activeUser })}
          >
            {highlightedIcon === "md-editor" && (
              <div className="icon-bounce-arrow" style={{
                position: "absolute", top: -26, left: 0, right: 0, textAlign: "center",
                fontSize: 14, color: "white", textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                zIndex: 20, pointerEvents: "none", lineHeight: 1,
              }}>▼</div>
            )}
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              background: "#1e1e1e",
              border: "2px solid",
              borderColor: selectedIcon === "md-editor"
                ? "var(--win-blue)"
                : "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
              display: "flex", alignItems: "center", justifyContent: "center",
              filter: selectedIcon === "md-editor" ? "brightness(0.6)" : "none",
            }}>
              <span style={{ fontSize: 10, fontWeight: "bold", color: "#4ec9b0", fontFamily: "monospace", lineHeight: 1.2, textAlign: "center" }}>.md</span>
            </div>
            <span className="text-center px-0.5" style={{
              fontSize: 11, lineHeight: 1.3, color: "white",
              textShadow: selectedIcon === "md-editor" ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
              background: selectedIcon === "md-editor" ? "var(--win-blue)" : "transparent",
              outline: selectedIcon === "md-editor" ? "1px dotted rgba(255,255,255,0.8)" : "none",
            }}>editor.md</span>
          </div>

          {/* 4. Claw Council */}
          <div
            className="flex flex-col items-center gap-1 cursor-default p-1"
            style={{ width: 72, position: "relative" }}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon("clawcouncil"); }}
            onDoubleClick={() => window.open("https://claw-council.vercel.app/skill.md", "_blank")}
          >
            {highlightedIcon === "clawcouncil" && (
              <div className="icon-bounce-arrow" style={{
                position: "absolute", top: -26, left: 0, right: 0, textAlign: "center",
                fontSize: 14, color: "white", textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                zIndex: 20, pointerEvents: "none", lineHeight: 1,
              }}>▼</div>
            )}
            <div style={{
              width: 36, height: 36, position: "relative",
              filter: selectedIcon === "clawcouncil"
                ? "drop-shadow(1px 1px 0 rgba(0,0,0,0.5)) brightness(0.5)"
                : "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/clawcouncil.webp" alt="Claw Council" style={{ width: 36, height: 36, objectFit: "contain" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                width: 10, height: 10, background: "white",
                fontSize: 8, lineHeight: "10px", textAlign: "center", border: "1px solid #808080",
              }}>↗</div>
            </div>
            <span className="text-center px-0.5" style={{
              fontSize: 11, lineHeight: 1.3, color: "white",
              textShadow: selectedIcon === "clawcouncil" ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
              background: selectedIcon === "clawcouncil" ? "var(--win-blue)" : "transparent",
              outline: selectedIcon === "clawcouncil" ? "1px dotted rgba(255,255,255,0.8)" : "none",
            }}>Claw Council</span>
          </div>

          {/* 5-6. Skills & MCP Servers */}
          {DESKTOP_ICONS.map((icon) => (
            <div
              key={icon.id}
              className="flex flex-col items-center gap-1 cursor-default p-1"
              style={{ width: 72, position: "relative" }}
              onClick={(e) => { e.stopPropagation(); setSelectedIcon(icon.id); }}
              onDoubleClick={() => openWindow(icon.id as "skills-explorer" | "mcp-explorer")}
            >
              {highlightedIcon === icon.id && (
                <div className="icon-bounce-arrow" style={{
                  position: "absolute", top: -26, left: 0, right: 0, textAlign: "center",
                  fontSize: 14, color: "white", textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                  zIndex: 20, pointerEvents: "none", lineHeight: 1,
                }}>▼</div>
              )}
              <span style={{
                fontSize: 36,
                filter: selectedIcon === icon.id
                  ? "drop-shadow(1px 1px 0 rgba(0,0,0,0.5)) brightness(0.6) sepia(1) hue-rotate(180deg) saturate(4)"
                  : "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))",
              }}>{icon.icon}</span>
              <span className="text-center px-0.5" style={{
                fontSize: 11, lineHeight: 1.3, color: "white",
                textShadow: selectedIcon === icon.id ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
                background: selectedIcon === icon.id ? "var(--win-blue)" : "transparent",
                outline: selectedIcon === icon.id ? "1px dotted rgba(255,255,255,0.8)" : "none",
              }}>{icon.label}</span>
            </div>
          ))}

          {/* 7. Readings */}
          <div
            className="flex flex-col items-center gap-1 cursor-default p-1"
            style={{ width: 72 }}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon("reading-list"); }}
            onDoubleClick={() => openWindow("reading-list")}
          >
            <span style={{
              fontSize: 36,
              filter: selectedIcon === "reading-list"
                ? "drop-shadow(1px 1px 0 rgba(0,0,0,0.5)) brightness(0.6) sepia(1) hue-rotate(180deg) saturate(4)"
                : "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))",
            }}>📚</span>
            <span className="text-center px-0.5" style={{
              fontSize: 11, lineHeight: 1.3, color: "white",
              textShadow: selectedIcon === "reading-list" ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
              background: selectedIcon === "reading-list" ? "var(--win-blue)" : "transparent",
              outline: selectedIcon === "reading-list" ? "1px dotted rgba(255,255,255,0.8)" : "none",
            }}>Readings</span>
          </div>

          {/* 8. Submit Skill */}
          <div
            className="flex flex-col items-center gap-1 cursor-default p-1"
            style={{ width: 72 }}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon("submit-skill"); }}
            onDoubleClick={() => openWindow("submit-skill")}
          >
            <span style={{
              fontSize: 36,
              filter: selectedIcon === "submit-skill"
                ? "drop-shadow(1px 1px 0 rgba(0,0,0,0.5)) brightness(0.6) sepia(1) hue-rotate(180deg) saturate(4)"
                : "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))",
            }}>📤</span>
            <span className="text-center px-0.5" style={{
              fontSize: 11, lineHeight: 1.3, color: "white",
              textShadow: selectedIcon === "submit-skill" ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
              background: selectedIcon === "submit-skill" ? "var(--win-blue)" : "transparent",
              outline: selectedIcon === "submit-skill" ? "1px dotted rgba(255,255,255,0.8)" : "none",
            }}>Submit Skill</span>
          </div>

          {/* 9. Games */}
          <div
            className="flex flex-col items-center gap-1 cursor-default p-1"
            style={{ width: 72 }}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon("games-folder"); }}
            onDoubleClick={() => openWindow("games-folder")}
          >
            <span style={{
              fontSize: 36,
              filter: selectedIcon === "games-folder"
                ? "drop-shadow(1px 1px 0 rgba(0,0,0,0.5)) brightness(0.6) sepia(1) hue-rotate(180deg) saturate(4)"
                : "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))",
            }}>🎮</span>
            <span className="text-center px-0.5" style={{
              fontSize: 11, lineHeight: 1.3, color: "white",
              textShadow: selectedIcon === "games-folder" ? "none" : "1px 1px 1px rgba(0,0,0,0.8)",
              background: selectedIcon === "games-folder" ? "var(--win-blue)" : "transparent",
              outline: selectedIcon === "games-folder" ? "1px dotted rgba(255,255,255,0.8)" : "none",
            }}>Games</span>
          </div>
        </div>

        {/* Windows */}
        {windows.map((win) => (
          <Window
            key={win.id}
            win={win}
            isActive={win.zIndex === maxZ}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onMove={(x, y) => moveWindow(win.id, x, y)}
            onResize={(x, y, w, h) => resizeWindow(win.id, x, y, w, h)}
          >
            {win.type === "skills-explorer" && <SkillsExplorer onOpenSkill={handleOpenSkill} />}
            {win.type === "skill-detail" && <SkillDetail skill={win.data as Skill} />}
            {win.type === "mcp-explorer" && <MCPExplorer onOpenServer={handleOpenMCP} />}
            {win.type === "mcp-detail" && <MCPDetail server={win.data as MCPServer} />}
            {win.type === "help" && <HelpWindow />}
            {win.type === "games-folder" && <GamesFolder onOpen={(t) => openWindow(t)} />}
            {win.type === "minesweeper" && <Minesweeper />}
            {win.type === "hangman" && <Hangman />}
            {win.type === "solitaire" && <Solitaire />}
            {win.type === "install-guide" && <InstallGuideWindow platform={(win.data as { platform: string })?.platform ?? "openclaw"} />}
            {win.type === "md-editor" && <MdEditorWindow platform={(win.data as { platform: string })?.platform ?? "openclaw"} />}
            {win.type === "reading-list" && <ReadingListWindow />}
            {win.type === "submit-skill" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, background: "var(--win-silver)", fontSize: 11 }}>
                <span style={{ fontSize: 48 }}>🚧</span>
                <div style={{ fontWeight: "bold", fontSize: 16 }}>Work in Progress</div>
                <div style={{ color: "var(--win-darker)", fontSize: 12 }}>The skill submission interface is coming soon.</div>
              </div>
            )}
          </Window>
        ))}
      </div>

      {switchingUser && (
        <UserSelect onSelect={handleUserSelect} onCancel={() => setSwitchingUser(false)} />
      )}

      <Taskbar
        windows={windows}
        onTaskClick={handleTaskClick}
        onStartClick={() => setSwitchingUser(true)}
        activeUser={activeUser}
      />
    </>
  );
}
