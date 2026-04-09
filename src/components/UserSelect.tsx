"use client";

import Image from "next/image";
import { useState } from "react";

const USERS = [
  {
    id: "hermes",
    name: "Hermes",
    avatar: "/hermes.webp",
    desc: "Self-Improving Autonomous Agent by Nous Research",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    avatar: "/openclaw.webp",
    desc: "Open Source Agent Framework",
  },
];

interface Props {
  onSelect: (userId: string) => void;
  onCancel?: () => void;
}

export default function UserSelect({ onSelect, onCancel }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setSelected(id);
    setTimeout(() => onSelect(id), 900);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "var(--win-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99998,
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, sans-serif',
      }}
    >
      {/* Dialog window */}
      <div
        style={{
          background: "var(--win-silver)",
          border: "2px solid",
          borderColor: "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
          width: 420,
          display: "flex",
          flexDirection: "column",
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
          }}
        >
          <span style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>
            Begin Windows 98 Session
          </span>
          <button className="title-btn">
            <span style={{ fontSize: 9, fontWeight: "bold" }}>✕</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Icon + instruction */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>🖥️</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 3 }}>
                Select an agent type to log on to abSkill OS:
              </div>
              <div style={{ fontSize: 11, color: "var(--win-darker)" }}>
                Double-click a user to begin the session.
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 2,
            borderTop: "1px solid var(--win-darker)",
            borderBottom: "1px solid var(--win-white)",
          }} />

          {/* User list — sunken listbox style */}
          <div
            style={{
              border: "2px solid",
              borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
              background: "white",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {USERS.map((user) => (
              <div
                key={user.id}
                onDoubleClick={() => handleClick(user.id)}
                onClick={() => setSelected(user.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 8px",
                  background: selected === user.id ? "var(--win-blue)" : "transparent",
                  color: selected === user.id ? "white" : "var(--win-black)",
                  cursor: "default",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    border: "2px solid",
                    borderColor: selected === user.id
                      ? "var(--win-white)"
                      : "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                    background: "#888",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
                  />
                </div>

                {/* Info */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: "bold" }}>{user.name}</div>
                  <div style={{ fontSize: 11, opacity: selected === user.id ? 0.85 : 0.6 }}>
                    {user.desc}
                  </div>
                  {selected === user.id && (
                    <div style={{ fontSize: 10, marginTop: 2, color: "#7dd3fc" }}>
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: 2,
            borderTop: "1px solid var(--win-darker)",
            borderBottom: "1px solid var(--win-white)",
          }} />

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button
              className="win-btn"
              onClick={() => selected && handleClick(selected)}
              disabled={!selected}
              style={{ minWidth: 80, opacity: selected ? 1 : 0.5 }}
            >
              OK
            </button>
            <button className="win-btn" style={{ minWidth: 80 }} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
