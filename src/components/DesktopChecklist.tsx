"use client";

import { useState } from "react";

// Maps checklist item id → desktop icon id (null = no icon to highlight)
const ICON_MAP: Record<string, string | null> = {
  comms:        "install-guide",
  "md-editor":  "md-editor",
  agw:          null,
  "claw-council": "clawcouncil",
  skills:       "skills-explorer",
  "share-skill": null,
};

const ITEMS = [
  {
    id: "comms",
    label: "Communication with your agent",
    sub: "Can you talk to your agent via terminal or Telegram/Discord? If you're having issues, check the installation guide.",
  },
  {
    id: "md-editor",
    label: "Edit your .md files",
    sub: "Use the built-in MD editor to customize your skill files.",
  },
  {
    id: "agw",
    label: "Get an AGW via AGW CLI",
    sub: "💡 Pro tip: if you're on a VPS, you'll need an SSH tunnel.",
  },
  {
    id: "claw-council",
    label: "Complete Claw Council missions",
    sub: "Follow the missions in order.",
  },
  {
    id: "skills",
    label: "Experiment with official skills & MCPs",
    sub: "You're ready — start experimenting with official skills or MCPs. Don't forget to share your wins on Discord!",
  },
  {
    id: "share-skill",
    label: "Share your own skill",
    sub: "If your agent has a capability the community doesn't have yet, share it with us. Documentation and a skill submission interface are coming soon.",
  },
];

interface Props {
  onHighlight: (iconId: string | null) => void;
}

export default function DesktopChecklist({ onHighlight }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 230,
        zIndex: 10,
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, sans-serif',
        fontSize: 11,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "linear-gradient(to right, var(--win-titlebar), var(--win-titlebar-end))",
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px 0 6px",
          cursor: "default",
          userSelect: "none",
        }}
        onDoubleClick={() => setCollapsed((c) => !c)}
      >
        <span style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>
          ✅ Getting Started
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          <button
            className="title-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <span style={{ fontSize: 9, fontWeight: "bold", lineHeight: 1 }}>
              {collapsed ? "▼" : "▲"}
            </span>
          </button>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div
          style={{
            background: "var(--win-silver)",
            border: "2px solid",
            borderColor: "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
            borderTop: "none",
          }}
        >
          {/* Progress bar */}
          <div style={{ padding: "6px 8px 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: "var(--win-darker)" }}>Progress</span>
              <span style={{ fontSize: 10, fontWeight: "bold", color: "var(--win-darker)" }}>
                {doneCount}/{ITEMS.length}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: "white",
                border: "2px solid",
                borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(doneCount / ITEMS.length) * 100}%`,
                  background: doneCount === ITEMS.length ? "#1a6b3c" : "var(--win-blue)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--win-darker)", margin: "0 8px" }} />
          <div style={{ height: 1, background: "var(--win-white)", margin: "0 8px 2px" }} />

          {/* Checklist items */}
          <div style={{ padding: "2px 0 6px" }}>
            {ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                onMouseEnter={() => {
                  setHoveredItem(item.id);
                  const iconId = ICON_MAP[item.id];
                  if (iconId) onHighlight(iconId);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  onHighlight(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 7,
                  padding: "4px 8px",
                  cursor: "default",
                  background: hoveredItem === item.id ? "var(--win-blue)" : "transparent",
                  color: hoveredItem === item.id ? "white" : "var(--win-black)",
                }}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: 13,
                    height: 13,
                    border: "2px solid",
                    borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                    background: "white",
                    flexShrink: 0,
                    marginTop: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  {checked[item.id] ? "✓" : ""}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: checked[item.id] ? "normal" : "bold",
                      textDecoration: checked[item.id] ? "line-through" : "none",
                      opacity: checked[item.id] ? 0.55 : 1,
                      lineHeight: 1.3,
                      fontSize: 11,
                    }}
                  >
                    {item.label}
                  </div>
                  {!checked[item.id] && (
                    <div
                      style={{
                        fontSize: 10,
                        opacity: 0.75,
                        lineHeight: 1.4,
                        marginTop: 1,
                        color: hoveredItem === item.id ? "rgba(255,255,255,0.85)" : "var(--win-darker)",
                      }}
                    >
                      {item.sub}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* All done message */}
          {doneCount === ITEMS.length && (
            <>
              <div style={{ height: 1, background: "var(--win-darker)", margin: "0 8px" }} />
              <div style={{ height: 1, background: "var(--win-white)", margin: "0 8px 4px" }} />
              <div
                style={{
                  padding: "5px 8px 8px",
                  textAlign: "center",
                  fontSize: 11,
                  color: "#1a6b3c",
                  fontWeight: "bold",
                }}
              >
                🎉 All done! You&apos;re ready to build.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
