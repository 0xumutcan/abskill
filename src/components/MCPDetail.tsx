"use client";

import { MCPServer } from "@/types/mcp";
import { useState } from "react";

interface Props {
  server: MCPServer;
}

const AGW_POLICY_PRESETS = [
  { preset: "payments",         caps: "Token transfers, balance reads" },
  { preset: "trading",          caps: "Swaps, transfers, contract writes" },
  { preset: "gaming",           caps: "In-game transactions" },
  { preset: "contract_write",   caps: "Arbitrary contract interactions" },
  { preset: "deploy",           caps: "Contract deployment" },
  { preset: "signing",          caps: "Message and transaction signing" },
  { preset: "full_app_control", caps: "All capabilities" },
  { preset: "custom",           caps: "Fine-grained tool selection" },
];

const AGW_SKILLS = [
  { skill: "authenticating-with-agw",      desc: "Session bootstrap, inspection, troubleshooting" },
  { skill: "reading-agw-wallet",            desc: "Wallet identity, balances, token inventory" },
  { skill: "executing-agw-transactions",    desc: "Preview-first execution rules for signing and sends" },
  { skill: "discovering-abstract-portal",   desc: "App and Portal stream discovery" },
  { skill: "trading-on-aborean",            desc: "Aborean Finance protocol workflows" },
  { skill: "trading-on-uniswap",            desc: "Uniswap V2+V3 swaps and liquidity on Abstract" },
  { skill: "bridging-to-abstract",          desc: "Native bridge and third-party bridge options" },
  { skill: "building-on-abstract",          desc: "Deployment, paymasters, session keys" },
  { skill: "managing-agent-identity",       desc: "ERC-8004 agent registration and reputation" },
  { skill: "upvoting-on-abstract",          desc: "Abstract Portal on-chain voting" },
  { skill: "mining-with-bigcoin",           desc: "Bigcoin virtual mining simulator" },
];

const TOOL_GROUPS = [
  { group: "wallet",   color: "#1a6b3c" },
  { group: "tx",       color: "#8b4513" },
  { group: "contract", color: "#4b0082" },
  { group: "auth",     color: "#8b0000" },
  { group: "session",  color: "#00688b" },
  { group: "app",      color: "#2f4f4f" },
  { group: "portal",   color: "#556b2f" },
  { group: "schema",   color: "#4a4a4a" },
];

function getGroupColor(toolName: string) {
  const group = TOOL_GROUPS.find((g) => toolName.startsWith(g.group));
  return group?.color ?? "#333";
}

type Tab = "overview" | "tools" | "config" | "skills";

export default function MCPDetail({ server }: Props) {
  const [copied, setCopied] = useState<"config" | "install" | null>(null);
  const [tab, setTab] = useState<Tab>("overview");

  const handleCopy = (text: string, key: "config" | "install") => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const isAGW = server.id === "agw-cli";

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--win-silver)", fontSize: 11 }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-2"
        style={{ borderBottom: "1px solid var(--win-darker)", background: "white" }}
      >
        {server.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={server.logo} alt={server.name} style={{ width: 32, height: 32, objectFit: "contain" }} />
        )}
        <div className="flex-1">
          <div style={{ fontWeight: "bold", fontSize: 13 }}>{server.name}</div>
          <div style={{ color: "var(--win-darker)" }}>
            v{server.version} · {server.verified ? "✓ Verified" : "Community"} · {server.provider}
          </div>
        </div>
        {(server.github || server.docs) && (
          <div style={{ display: "flex", gap: 4 }}>
            {server.github && (
              <button className="win-btn" style={{ minWidth: 0, padding: "2px 8px", fontSize: 10 }}
                onClick={() => window.open(server.github, "_blank")}>GitHub ↗</button>
            )}
            {server.docs && (
              <button className="win-btn" style={{ minWidth: 0, padding: "2px 8px", fontSize: 10 }}
                onClick={() => window.open(server.docs, "_blank")}>Docs ↗</button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-darker)", background: "var(--win-silver)" }}>
        {(["overview", "tools", "config", ...(isAGW ? ["skills"] : [])] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "4px 12px",
              fontSize: 11,
              border: "none",
              borderRight: "1px solid var(--win-darker)",
              background: tab === t ? "white" : "var(--win-silver)",
              borderBottom: tab === t ? "1px solid white" : "none",
              fontWeight: tab === t ? "bold" : "normal",
              cursor: "default",
              marginBottom: tab === t ? -1 : 0,
            }}
          >
            {t === "overview" ? "📋 Overview" : t === "tools" ? `🔧 Tools (${server.tools.length})` : t === "config" ? "⚙️ Config" : "📚 Skills"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto" style={{ padding: 10 }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="sunken" style={{ padding: 8, background: "white", lineHeight: 1.6 }}>
              {server.description}
            </div>

            {isAGW && (
              <>
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>🔐 Security Model</div>
                  <div className="sunken" style={{ padding: 8, background: "white", lineHeight: 1.6 }}>
                    Wallet private key managed by <b>Privy TEE</b> — never exposed to CLI or agent.
                    Device authorization key (P-256) proves machine identity only.
                    All writes are <b>default-deny</b>; policy-enforced server-side.
                    State-changing commands require explicit <code>--execute</code> after <code>--dry-run</code>.
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>📋 Policy Presets</div>
                  <div className="sunken" style={{ background: "white" }}>
                    {AGW_POLICY_PRESETS.map((p) => (
                      <div key={p.preset} style={{ padding: "3px 8px", borderBottom: "1px solid #eee", display: "flex", gap: 8 }}>
                        <code style={{ minWidth: 140, color: "var(--win-blue)", fontWeight: "bold" }}>{p.preset}</code>
                        <span style={{ color: "var(--win-darker)" }}>{p.caps}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>🔗 Compatible Hosts</div>
                  <div className="sunken" style={{ padding: 8, background: "white", display: "flex", gap: 6 }}>
                    <span style={{ background: "#e8f0fe", border: "1px solid #c5d0e8", padding: "2px 8px" }}>Claude Code</span>
                    <span style={{ background: "#e8f0fe", border: "1px solid #c5d0e8", padding: "2px 8px" }}>Gemini</span>
                    <span style={{ background: "#e8f0fe", border: "1px solid #c5d0e8", padding: "2px 8px" }}>Any MCP host</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TOOLS */}
        {tab === "tools" && (
          <div className="sunken" style={{ background: "white" }}>
            {server.tools.map((tool) => (
              <div key={tool.name} style={{ padding: "4px 8px", borderBottom: "1px solid #eee", display: "flex", gap: 8 }}>
                <code style={{ minWidth: 180, fontWeight: "bold", color: getGroupColor(tool.name) }}>
                  {tool.name}
                </code>
                <span style={{ color: "var(--win-darker)" }}>{tool.description}</span>
              </div>
            ))}
          </div>
        )}

        {/* CONFIG */}
        {tab === "config" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontWeight: "bold", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>MCP Config (npx — no install needed)</span>
                <button className="win-btn" style={{ minWidth: 60, fontSize: 10 }}
                  onClick={() => handleCopy(server.configJson, "config")}>
                  {copied === "config" ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              <pre style={{
                background: "#1e1e1e", color: "#d4d4d4", padding: 10, fontSize: 10,
                fontFamily: "monospace", overflowX: "auto", lineHeight: 1.6,
                border: "2px solid", borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
              }}>
                {server.configJson}
              </pre>
            </div>

            {server.installCmd && (
              <div>
                <div style={{ fontWeight: "bold", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Global Install</span>
                  <button className="win-btn" style={{ minWidth: 60, fontSize: 10 }}
                    onClick={() => handleCopy(server.installCmd!, "install")}>
                    {copied === "install" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <pre style={{
                  background: "#1e1e1e", color: "#98c379", padding: 10, fontSize: 10,
                  fontFamily: "monospace", lineHeight: 1.6,
                  border: "2px solid", borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                }}>
                  {server.installCmd}
                </pre>
              </div>
            )}

            {isAGW && (
              <div>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>After Install — Authenticate</div>
                <pre style={{
                  background: "#1e1e1e", color: "#61afef", padding: 10, fontSize: 10,
                  fontFamily: "monospace", lineHeight: 1.8,
                  border: "2px solid", borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                }}>
{`# 1. Authenticate (opens companion app in browser)
agw-cli auth init --json '{"chainId":2741}' --execute

# 2. Verify session
agw-cli session status --json '{"fields":["status","readiness","accountAddress"]}'

# 3. Start MCP server
agw-cli mcp serve --sanitize strict`}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* SKILLS (AGW only) */}
        {tab === "skills" && isAGW && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--win-darker)" }}>Install all skills at once:</span>
              <button className="win-btn" style={{ fontSize: 10 }}
                onClick={() => handleCopy("npx skills add https://github.com/Abstract-Foundation/agw-cli/tree/main/packages/agw-cli/skills -y", "install")}>
                {copied === "install" ? "✓ Copied!" : "📋 Copy cmd"}
              </button>
            </div>
            <pre style={{
              background: "#1e1e1e", color: "#98c379", padding: 8, fontSize: 10,
              fontFamily: "monospace",
              border: "2px solid", borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
            }}>
              {"npx skills add https://github.com/Abstract-Foundation/agw-cli/tree/main/packages/agw-cli/skills -y"}
            </pre>
            <div className="sunken" style={{ background: "white" }}>
              {AGW_SKILLS.map((s) => (
                <div key={s.skill} style={{ padding: "4px 8px", borderBottom: "1px solid #eee", display: "flex", gap: 8 }}>
                  <code style={{ minWidth: 220, fontWeight: "bold", color: "var(--win-blue)", fontSize: 10 }}>{s.skill}</code>
                  <span style={{ color: "var(--win-darker)" }}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
