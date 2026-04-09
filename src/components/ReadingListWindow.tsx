"use client";

import { READINGS, ReadingType } from "@/data/readings";

const TYPE_ICONS: Record<ReadingType, string> = {
  article: "📰",
  doc: "📋",
  video: "🎬",
  book: "📚",
};

const TYPE_COLORS: Record<ReadingType, string> = {
  article: "#000080",
  doc:     "#1a6b3c",
  video:   "#8b0000",
  book:    "#4b0082",
};

export default function ReadingListWindow() {
  return (
    <div className="flex flex-col h-full" style={{ background: "white", fontSize: 11 }}>
      {/* Header */}
      <div style={{
        background: "#000080",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 28 }}>📖</span>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>Recommended Readings</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto" style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 1 }}>
        {READINGS.length === 0 ? (
          <div style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--win-darker)",
            fontSize: 12,
          }}>
            No resources yet.
          </div>
        ) : (
          READINGS.map((reading, i) => (
            <div
              key={reading.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "8px 10px",
                background: i % 2 === 0 ? "white" : "#f5f5f5",
                border: "1px solid transparent",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#dde8f5";
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--win-blue)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? "white" : "#f5f5f5";
                (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
              }}
              onDoubleClick={() => window.open(reading.url, "_blank")}
            >
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{TYPE_ICONS[reading.type]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: 12,
                      color: TYPE_COLORS[reading.type],
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(reading.url, "_blank")}
                  >
                    {reading.title}
                  </span>
                  {reading.tag && (
                    <span style={{
                      fontSize: 9,
                      background: TYPE_COLORS[reading.type],
                      color: "white",
                      padding: "1px 5px",
                      flexShrink: 0,
                    }}>
                      {reading.tag}
                    </span>
                  )}
                </div>
                <div style={{ color: "#444", lineHeight: 1.5, fontSize: 11 }}>
                  {reading.description}
                </div>
              </div>
              <button
                onClick={() => window.open(reading.url, "_blank")}
                style={{
                  flexShrink: 0,
                  padding: "3px 8px",
                  fontSize: 10,
                  background: "var(--win-silver)",
                  border: "2px solid",
                  borderColor: "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                  cursor: "default",
                  whiteSpace: "nowrap",
                }}
              >
                Open ↗
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
