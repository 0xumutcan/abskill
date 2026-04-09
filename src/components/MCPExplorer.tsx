"use client";

import { useState } from "react";
import { mcpServers, MCP_PROVIDERS } from "@/data/mcpServers";
import { MCPServer, MCPProvider } from "@/types/mcp";

interface Props {
  onOpenServer: (server: MCPServer) => void;
}

type View = "root" | "provider";

export default function MCPExplorer({ onOpenServer }: Props) {
  const [view, setView] = useState<View>("root");
  const [activeProvider, setActiveProvider] = useState<MCPProvider | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const serversInProvider = activeProvider
    ? mcpServers.filter((s) => s.provider === activeProvider.id)
    : [];

  const getPath = () => {
    if (view === "root") return "C:\\abSkill\\MCP Servers";
    return `C:\\abSkill\\MCP Servers\\${activeProvider?.label}`;
  };

  const handleBack = () => {
    if (view === "provider") {
      setView("root");
      setActiveProvider(null);
      setSelectedItem(null);
    }
  };

  const currentFolderLabel =
    view === "root" ? "MCP Servers" : (activeProvider?.label ?? "");

  const statusText = () => {
    if (view === "root") return `${MCP_PROVIDERS.length} provider(s), ${mcpServers.length} server(s) total`;
    return `${serversInProvider.length} server(s)`;
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--win-silver)" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-1 py-1 border-b" style={{ borderColor: "var(--win-dark)" }}>
        <button className="win-btn" style={{ minWidth: 60, fontSize: 11 }} onClick={handleBack} disabled={view === "root"}>
          ← Back
        </button>
        <div className="flex items-center gap-1 flex-1 mx-1 sunken px-1 py-0.5" style={{ background: "white", fontSize: 11 }}>
          <span>🔌</span>
          <span>{currentFolderLabel}</span>
        </div>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-1 px-2 py-0.5 border-b" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
        <span style={{ color: "var(--win-darker)" }}>Address:</span>
        <div className="flex-1 sunken px-1 py-0.5" style={{ background: "white" }}>{getPath()}</div>
      </div>

      {/* File area */}
      <div className="flex-1 overflow-auto p-2 sunken" style={{ background: "white", margin: 4 }}>

        {/* ROOT — provider folders */}
        {view === "root" && (
          <div className="flex flex-wrap gap-6 p-2">
            {MCP_PROVIDERS.map((provider) => {
              const count = mcpServers.filter((s) => s.provider === provider.id).length;
              return (
                <div
                  key={provider.id}
                  className="flex flex-col items-center gap-1 p-2 cursor-default"
                  style={{
                    width: 90,
                    background: selectedItem === provider.id ? "var(--win-blue)" : "transparent",
                    color: selectedItem === provider.id ? "white" : "var(--win-black)",
                    outline: selectedItem === provider.id ? "1px dotted white" : "none",
                  }}
                  onClick={() => setSelectedItem(provider.id)}
                  onDoubleClick={() => { setActiveProvider(provider); setView("provider"); setSelectedItem(null); }}
                >
                  {provider.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={provider.logo} alt={provider.label} style={{ width: 36, height: 36, objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: 36 }}>📁</span>
                  )}
                  <span className="text-center" style={{ fontSize: 11, lineHeight: 1.3 }}>{provider.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{count} server(s)</span>
                </div>
              );
            })}
          </div>
        )}

        {/* PROVIDER — server files */}
        {view === "provider" && (
          <div className="flex flex-wrap gap-4 p-2">
            {serversInProvider.map((server) => (
              <div
                key={server.id}
                className="flex flex-col items-center gap-1 p-2 cursor-default"
                style={{
                  width: 80,
                  background: selectedItem === server.id ? "var(--win-blue)" : "transparent",
                  color: selectedItem === server.id ? "white" : "var(--win-black)",
                  outline: selectedItem === server.id ? "1px dotted white" : "none",
                }}
                onClick={() => setSelectedItem(server.id)}
                onDoubleClick={() => onOpenServer(server)}
              >
                <span style={{ fontSize: 32 }}>🔌</span>
                <span className="text-center" style={{ fontSize: 11, lineHeight: 1.2, wordBreak: "break-word" }}>
                  {server.name}
                </span>
                {server.verified && <span style={{ fontSize: 10 }}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-2 py-0.5 border-t" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
        <div className="sunken px-2 py-0.5 flex-1">{statusText()}</div>
        <div className="sunken px-2 py-0.5">
          {selectedItem && view === "provider"
            ? mcpServers.find((s) => s.id === selectedItem)?.verified ? "Verified" : "Community"
            : ""}
        </div>
      </div>
    </div>
  );
}
