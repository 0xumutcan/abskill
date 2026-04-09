"use client";

import { useState } from "react";
import { Skill } from "@/types/skill";

interface Props {
  skill: Skill;
}

export default function SkillDetail({ skill }: Props) {
  const [copied, setCopied] = useState<"md" | "cmd" | null>(null);

  const copy = async (text: string, type: "md" | "cmd") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--win-silver)" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b" style={{ borderColor: "var(--win-dark)" }}>
        <button className="win-btn" style={{ minWidth: 120 }} onClick={() => copy(skill.skillMd, "md")}>
          {copied === "md" ? "✓ Copied!" : "📋 Copy skill.md"}
        </button>
        <button className="win-btn" style={{ minWidth: 130 }} onClick={() => copy(skill.installCmd, "cmd")}>
          {copied === "cmd" ? "✓ Copied!" : "⚡ Copy install cmd"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div
          className="flex flex-col gap-0 border-r overflow-y-auto flex-shrink-0"
          style={{ width: 170, borderColor: "var(--win-dark)", background: "var(--win-silver)" }}
        >
          <div className="px-2 py-1 font-bold text-xs border-b" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
            Properties
          </div>

          {[
            ["Category", skill.category],
            ["Version", `v${skill.version}`],
            ["Author", skill.author],
            ["Network", skill.network.join(", ")],
            ["Verified", skill.verified ? "Yes ✓" : "No"],
            ["Examples", skill.hasExamples ? "Yes" : "No"],
            ["Docs", skill.hasDocs ? "Yes" : "No"],
            ["Updated", skill.updatedAt],
          ].map(([k, v]) => (
            <div key={k} className="px-2 py-1 border-b" style={{ borderColor: "#e0e0e0", fontSize: 11 }}>
              <div style={{ color: "var(--win-darker)", fontSize: 10 }}>{k}</div>
              <div style={{ fontWeight: "bold" }}>{v}</div>
            </div>
          ))}

          <div className="px-2 py-1 border-b" style={{ borderColor: "#e0e0e0", fontSize: 11 }}>
            <div style={{ color: "var(--win-darker)", fontSize: 10 }}>Tags</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {skill.tags.map((t) => (
                <span key={t} className="sunken px-1" style={{ fontSize: 10 }}>#{t}</span>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="px-2 py-1 border-b" style={{ borderColor: "#e0e0e0", fontSize: 11 }}>
            <div style={{ color: "var(--win-darker)", fontSize: 10, marginBottom: 3 }}>Capabilities</div>
            <div className="flex flex-col gap-1">
              {skill.capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-1" style={{ fontSize: 10 }}>
                  <span style={{ color: "green", flexShrink: 0 }}>✓</span>
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Install */}
          <div className="px-2 py-1" style={{ fontSize: 11 }}>
            <div style={{ color: "var(--win-darker)", fontSize: 10 }}>Install</div>
            <div
              className="sunken px-1 py-0.5 mt-1 break-all"
              style={{ fontSize: 10, background: "white", fontFamily: "monospace" }}
            >
              {skill.installCmd}
            </div>
          </div>
        </div>

        {/* Right panel: skill.md */}
        <div className="flex-1 overflow-auto" style={{ background: "white" }}>
          <pre
            className="p-3 text-xs leading-relaxed"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 11,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {skill.skillMd}
          </pre>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-2 px-2 py-0.5 border-t text-xs"
        style={{ borderColor: "var(--win-dark)", fontSize: 11 }}
      >
        <div className="sunken px-2 py-0.5 flex-1">{skill.name}</div>
        <div className="sunken px-2 py-0.5">{skill.category}</div>
        <div className="sunken px-2 py-0.5">{skill.verified ? "✓ Verified" : "Community"}</div>
      </div>
    </div>
  );
}
