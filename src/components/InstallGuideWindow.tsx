"use client";

import { useState } from "react";

function CopyCommand({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ position: "relative", marginBottom: 3 }}>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#4ec9b0",
          padding: "5px 60px 5px 8px",
          fontSize: 10,
          fontFamily: "monospace",
          border: "1px solid #444",
          overflowX: "auto",
          margin: 0,
        }}
      >
        {cmd}
      </pre>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: 3,
          right: 4,
          padding: "1px 7px",
          fontSize: 9,
          cursor: "pointer",
          background: copied ? "#1a6b3c" : "#2d2d2d",
          color: copied ? "#fff" : "#aaa",
          border: "1px solid #555",
          fontFamily: "monospace",
          transition: "background 0.15s",
        }}
      >
        {copied ? "✓" : "copy"}
      </button>
    </div>
  );
}

function LabeledBlock({ label, content, copyable }: { label: string; content: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const isOutput = label === "Terminal Output";

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#2d2d2d",
        padding: "2px 8px",
        borderBottom: "1px solid #444",
      }}>
        <span style={{ fontSize: 9, color: "#aaa", fontFamily: "monospace" }}>{label}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            style={{
              padding: "1px 7px", fontSize: 9, cursor: "pointer",
              background: copied ? "#1a6b3c" : "#2d2d2d",
              color: copied ? "#fff" : "#aaa",
              border: "1px solid #555", fontFamily: "monospace",
            }}
          >
            {copied ? "✓" : "Copy"}
          </button>
        )}
      </div>
      <pre style={{
        background: "#1e1e1e",
        color: isOutput ? "#888" : "#4ec9b0",
        padding: "6px 8px",
        fontSize: 10,
        fontFamily: "monospace",
        border: "1px solid #444",
        borderTop: "none",
        margin: 0,
        overflowX: "auto",
        fontStyle: isOutput ? "italic" : "normal",
      }}>
        {content}
      </pre>
    </div>
  );
}

type Tab = "guide" | "video";

interface Block {
  label: string;
  content: string;
  copyable?: boolean;
}

interface StepSection {
  text?: string;
  block?: Block;
}

interface Step {
  title: string;
  commands?: string[];
  blocks?: Block[];
  sections?: StepSection[];
  notes?: string[];
  links?: { label: string; url: string }[];
  description?: string;
}

interface GuideContent {
  title: string;
  icon: string;
  color: string;
  intro: string;
  author?: { name: string; url: string };
  steps: Step[];
  videos: { title: string; url: string; description: string; videoAuthor?: { name: string; url: string } }[];
  usefulLinks: { label: string; url: string; description: string }[];
}

const OPENCLAW_GUIDE: GuideContent = {
  title: "OpenClaw Installation Guide",
  icon: "🐾",
  color: "#1a6b3c",
  intro:
    "OpenClaw is an AI agent framework that lets you run autonomous bots on Abstract Chain. This guide walks you through deploying your own OpenClaw agent — no coding background required.",
  author: { name: "Arcanum", url: "https://x.com/maneritory" },
  steps: [
    {
      title: "Step 1 — Choose Your Deployment",
      description:
        "You can run OpenClaw on your local machine (free) or on a VPS (recommended for 24/7 uptime).",
      notes: [
        "Local Machine: zero cost, direct file access — but risks downtime and exposes your home IP",
        "VPS (Recommended): 24/7 uptime, static IP, scalable — costs $5–$15/mo",
        "Shortcut: Kimi Allegretto subscription ($39/mo) includes a pre-configured OpenClaw bot with 5000 skills",
      ],
    },
    {
      title: "Step 2 — Get a VPS (if using VPS)",
      description: "Two recommended providers:",
      notes: [
        "Hetzner Cloud — CX22 plan: €3.79/mo · 2 vCPU · 4 GB RAM · 40 GB disk",
        "DigitalOcean — Droplets from $4/mo · 1–2 vCPU + 2–4 GB RAM recommended",
      ],
      links: [
        { label: "Hetzner Cloud", url: "https://hetzner.com" },
        { label: "DigitalOcean", url: "https://digitalocean.com" },
      ],
    },
    {
      title: "Step 3 — Connect to Your VPS via SSH",
      description: "Once you have your VPS credentials, save them somewhere safe:\n- \"root@xxx.xxx.x.xxx\"\n- \"password: xxxxx\"\n\nOn Windows open PowerShell. On Mac open Terminal. Then paste:",
      sections: [
        { block: { label: "Terminal", content: "ssh root@YOUR_SERVER_IP", copyable: true } },
        { text: "Paste your password — you won't see it typed in the terminal, that's normal. Just right-click to paste, then press Enter:" },
        { block: { label: "Terminal Output", content: "root@YOUR_SERVER_IP's password:...", copyable: false } },
        { text: "If it asks \"Are you sure you want to continue connecting?\", type:" },
        { block: { label: "Input", content: "yes", copyable: true } },
      ],
      notes: [
        "💡 Tip: right-click to paste in most terminals (Ctrl+V may not work).",
      ],
    },
    {
      title: "Step 4 — Secure Your Server",
      description: "Run these commands one by one:",
      commands: [
        "apt update && apt -y upgrade",
        "apt -y install ufw fail2ban curl",
        "ufw allow OpenSSH",
        "ufw enable",
      ],
    },
    {
      title: "Step 5 — Install OpenClaw",
      description: "Run the official install script, then launch the setup wizard:",
      commands: [
        "curl -fsSL https://openclaw.ai/install.sh | bash",
        "openclaw onboard --install-daemon",
      ],
      notes: [
        "The setup wizard walks you through every configuration step interactively",
        "Use 'openclaw gateway status' to verify the agent is running",
      ],
    },
    {
      title: "Step 6 — Access the Dashboard",
      description:
        "The UI is kept private (not exposed to the internet). Create an SSH tunnel to access it locally:",
      commands: [
        "ssh -N -L [port]:[IP]:[port] root@[SERVER_IP]",
      ],
      notes: [
        "Then open http://localhost:18789/#token=[token] in your browser",
        "The token is shown at the end of the 'openclaw onboard' setup",
      ],
    },
    {
      title: "Step 7 — Configure LLM (OpenRouter)",
      description:
        "OpenRouter gives you access to 200+ AI models through a single API key — pay-as-you-go, no subscriptions.",
      notes: [
        "Register at openrouter.ai and add at least $5 balance",
        "Create an API key and paste it during the OpenClaw setup wizard",
      ],
      links: [
        { label: "OpenRouter", url: "https://openrouter.ai" },
      ],
    },
    {
      title: "Step 8 — Connect Telegram",
      description: "Create a Telegram bot so you can chat with your agent:",
      notes: [
        "Open Telegram and find @BotFather",
        "Send /newbot and follow the prompts",
        "Copy the bot token and paste it when prompted during OpenClaw setup",
      ],
    },
    {
      title: "Step 9 — Connect to Abstract",
      description:
        "Use Skills (plugin modules) and MCP (Model Context Protocol) to connect your agent to Abstract Chain tools:",
      notes: [
        "Skills let your agent interact with Abstract apps without writing code",
        "MCP gives your agent wallet tools: check balances, track XP, execute onchain actions",
      ],
      links: [
        { label: "Abstract Skills (GitHub)", url: "https://github.com/Abstract-Foundation/abstract-skills" },
        { label: "MCP Setup", url: "https://mcp.abs.xyz" },
        { label: "OpenClaw Docs", url: "https://docs.openclaw.ai" },
      ],
    },
  ],
  videos: [
    {
      title: "OpenClaw Setup Walkthrough",
      url: "",
      description: "Full video guide coming soon. Check the OpenClaw docs for the latest tutorials.",
    },
  ],
  usefulLinks: [
    { label: "openclaw.ai", url: "https://openclaw.ai", description: "Official OpenClaw website" },
    { label: "docs.openclaw.ai", url: "https://docs.openclaw.ai", description: "Full documentation" },
    { label: "openrouter.ai", url: "https://openrouter.ai", description: "LLM API (200+ models)" },
    { label: "Abstract Skills", url: "https://github.com/Abstract-Foundation/abstract-skills", description: "Skill packages for Abstract apps" },
    { label: "MCP for Abstract", url: "https://mcp.abs.xyz", description: "Model Context Protocol setup" },
    { label: "Hetzner Cloud", url: "https://hetzner.com", description: "VPS provider (recommended)" },
    { label: "DigitalOcean", url: "https://digitalocean.com", description: "Alternative VPS provider" },
  ],
};

const HERMES_GUIDE: GuideContent = {
  title: "Hermes Installation Guide",
  icon: "⚡",
  color: "#4b0082",
  intro:
    "Hermes is an open-source autonomous agent by Nous Research (MIT License) that runs on your own server. Unlike IDE copilots or chatbot wrappers, Hermes is a long-running system with persistent memory and auto-generated skills — it learns your projects and gets smarter over time.",
  steps: [
    {
      title: "Step 1 — Choose Your Deployment",
      description:
        "Hermes runs on your own server, not in the cloud. You can use your local machine or a VPS for 24/7 uptime.",
      notes: [
        "Local Machine: free, direct access — but risks downtime when your computer is off",
        "VPS (Recommended): 24/7 uptime, always-on agent — costs $4–$15/mo",
        "Hetzner Cloud — CX22 plan: €3.79/mo · 2 vCPU · 4 GB RAM · 40 GB disk",
        "DigitalOcean — Droplets from $4/mo · 1–2 vCPU + 2–4 GB RAM recommended",
      ],
      links: [
        { label: "Hetzner Cloud", url: "https://hetzner.com" },
        { label: "DigitalOcean", url: "https://digitalocean.com" },
      ],
    },
    {
      title: "Step 2 — Install Hermes",
      description: "Run the official one-line install script on your server:",
      commands: [
        "curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash",
      ],
      notes: [
        "This installs the Hermes CLI and all required dependencies",
        "MIT licensed — fully open source, no vendor lock-in",
        "Current version: v0.8.0",
      ],
      links: [
        { label: "GitHub Repository", url: "https://github.com/NousResearch/hermes-agent" },
      ],
    },
    {
      title: "Step 3 — Run Setup",
      description: "Launch the interactive setup wizard to configure your agent:",
      commands: [
        "hermes setup",
      ],
      notes: [
        "The wizard walks you through LLM selection, communication channels, and sandboxing",
        "Hermes supports multi-model reasoning — you can mix different LLMs per task",
        "Configuration is saved locally on your server",
      ],
    },
    {
      title: "Step 4 — Configure Your LLM",
      description:
        "Hermes supports multi-model reasoning — you can use different LLMs per task. The easiest way to get started is via OpenRouter, which gives you 200+ models through a single API key:",
      notes: [
        "Register at openrouter.ai and add at least $5 balance to start",
        "Create an API key and enter it when hermes setup asks for your LLM provider",
        "Pay-as-you-go pricing — no subscriptions, no monthly fees",
        "You can assign different models to different task types (e.g. fast model for search, powerful model for code)",
        "Alternatively: use a local model via Ollama, or connect directly to OpenAI / Anthropic",
      ],
      links: [
        { label: "OpenRouter", url: "https://openrouter.ai" },
      ],
    },
    {
      title: "Step 5 — Connect a Communication Channel",
      description:
        "Hermes supports 14+ messaging platforms through a unified gateway — connect the one you prefer:",
      notes: [
        "Telegram — most popular, works great on mobile",
        "Discord — ideal if you already run a server",
        "Slack — best for team/workspace setups",
        "WhatsApp, Signal, Matrix, Mattermost, SMS, Email — also supported",
        "CLI — direct terminal access without any messaging app",
        "Real-time voice interaction available on supported platforms",
        "You can switch between channels at any time without losing context",
      ],
    },
    {
      title: "Step 6 — Choose a Terminal Backend",
      description:
        "Hermes runs code in isolated environments. Pick the backend that fits your setup (6 options available):",
      notes: [
        "Local — fastest, runs directly on your machine (least isolated)",
        "Docker — recommended for most users, strong container isolation",
        "SSH — run agent tasks on a separate remote machine",
        "Daytona — serverless, cost-efficient during idle periods",
        "Singularity — HPC / scientific computing environments",
        "Modal — serverless cloud execution for heavy workloads",
      ],
    },
    {
      title: "Step 7 — Explore Tools, MCP & Skills",
      description:
        "Hermes comes with 47 built-in tools out of the box and supports MCP server integration for extending capabilities:",
      notes: [
        "47 built-in tools: web search, browser automation, vision, image generation, TTS, batch processing, and more",
        "MCP server integration lets you plug in any Model Context Protocol-compatible tool",
        "Skills Hub: community-built skills you can install to teach Hermes new capabilities",
        "Hermes auto-generates its own skills as it works — it learns and improves over time",
        "User modeling via Honcho dialectic system — Hermes adapts to your preferences",
      ],
      links: [
        { label: "MCP Setup", url: "https://mcp.abs.xyz" },
        { label: "GitHub Repository", url: "https://github.com/NousResearch/hermes-agent" },
      ],
    },
    {
      title: "Step 8 — Schedule Tasks & Automate",
      description:
        "Tell Hermes what to automate using plain English — no cron syntax needed:",
      notes: [
        "\"Send me a daily briefing every morning at 9am\"",
        "\"Run a backup of my project every night\"",
        "\"Monitor this wallet and alert me if anything changes\"",
        "Hermes converts your instructions into scheduled jobs automatically",
        "Isolated subagents handle parallel tasks with independent terminals and memory",
        "Trajectory export lets you review and audit everything the agent did",
      ],
    },
    {
      title: "Step 9 — Verify & Start Using",
      description: "Confirm Hermes is running and start giving it tasks:",
      commands: [
        "hermes status",
      ],
      notes: [
        "A healthy status means your agent is live and ready",
        "Start simple: ask Hermes to search the web or summarize a document",
        "As Hermes runs, it builds a closed learning loop — it gets smarter the longer it operates",
        "Full-text search with LLM summarization keeps cross-session memory organized",
      ],
    },
  ],
  videos: [
    {
      title: "Hermes Setup Walkthrough",
      url: "https://www.youtube.com/embed/tm4h8dG-xlI",
      description: "Hermes installation and setup by",
      videoAuthor: { name: "Theo", url: "https://x.com/Theo_jpeg" },
    },
  ],
  usefulLinks: [
    { label: "hermes-agent.nousresearch.com", url: "https://hermes-agent.nousresearch.com", description: "Official Hermes website" },
    { label: "Hermes Docs", url: "https://hermes-agent.nousresearch.com/docs", description: "Full documentation" },
    { label: "GitHub — NousResearch/hermes-agent", url: "https://github.com/NousResearch/hermes-agent", description: "Source code (MIT License)" },
    { label: "Nous Research", url: "https://nousresearch.com", description: "The team behind Hermes" },
    { label: "Hetzner Cloud", url: "https://hetzner.com", description: "VPS provider (recommended)" },
    { label: "DigitalOcean", url: "https://digitalocean.com", description: "Alternative VPS provider" },
  ],
};

export default function InstallGuideWindow({ platform }: { platform: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("guide");
  const [expandedStep, setExpandedStep] = useState<number>(0);

  const guide = platform === "openclaw" ? OPENCLAW_GUIDE : HERMES_GUIDE;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--win-silver)", fontSize: 11 }}>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid var(--win-darker)",
          background: "var(--win-silver)",
          paddingTop: 4,
          paddingLeft: 4,
          gap: 2,
        }}
      >
        {(["guide", "video"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "4px 14px",
              fontSize: 11,
              cursor: "default",
              background: activeTab === tab ? "var(--win-silver)" : "var(--win-dark-silver)",
              border: "2px solid",
              borderColor:
                activeTab === tab
                  ? "var(--win-white) var(--win-darker) transparent var(--win-white)"
                  : "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
              marginBottom: activeTab === tab ? -2 : 0,
              fontWeight: activeTab === tab ? "bold" : "normal",
              color: "var(--win-black)",
              zIndex: activeTab === tab ? 1 : 0,
              position: "relative",
            }}
          >
            {tab === "guide" ? "📄 Guide" : "▶ Video"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto" style={{ background: "white" }}>
        {activeTab === "guide" && (
          <div>
            {/* Header */}
            <div
              style={{
                background: guide.color,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 28 }}>{guide.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontWeight: "bold", fontSize: 13 }}>{guide.title}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, marginTop: 2 }}>{guide.intro}</div>
                {guide.author && (
                  <div style={{ marginTop: 5, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>
                    ✍ Written by{" "}
                    <a
                      href={guide.author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {guide.author.name}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Steps */}
            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: "bold", fontSize: 10, color: "var(--win-darker)", marginBottom: 4, paddingLeft: 2 }}>
                INSTALLATION STEPS
              </div>

              {guide.steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    border: "2px solid",
                    borderColor:
                      expandedStep === i
                        ? "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)"
                        : "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                  }}
                >
                  {/* Step header */}
                  <button
                    onClick={() => setExpandedStep(expandedStep === i ? -1 : i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "6px 10px",
                      background: expandedStep === i ? guide.color : "var(--win-silver)",
                      color: expandedStep === i ? "white" : "var(--win-black)",
                      border: "none",
                      cursor: "default",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ fontSize: 10, width: 10 }}>{expandedStep === i ? "▼" : "▶"}</span>
                    {step.title}
                  </button>

                  {/* Step body */}
                  {expandedStep === i && (
                    <div style={{ padding: "8px 12px", background: "white", display: "flex", flexDirection: "column", gap: 8 }}>
                      {step.description && (
                        <p style={{ lineHeight: 1.6, color: "var(--win-black)" }}>{step.description}</p>
                      )}

                      {step.sections && step.sections.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {step.sections.map((section, si) =>
                            section.block ? (
                              <LabeledBlock key={si} label={section.block.label} content={section.block.content} copyable={section.block.copyable} />
                            ) : (
                              <p key={si} style={{ lineHeight: 1.6, color: "var(--win-black)", margin: 0 }}>{section.text}</p>
                            )
                          )}
                        </div>
                      )}

                      {step.commands && step.commands.length > 0 && (
                        <div>
                          <div style={{ fontSize: 10, color: "var(--win-darker)", fontWeight: "bold", marginBottom: 4 }}>
                            COMMANDS (copy &amp; paste):
                          </div>
                          {step.commands.map((cmd, ci) => (
                            <CopyCommand key={ci} cmd={cmd} />
                          ))}
                        </div>
                      )}

                      {step.notes && step.notes.length > 0 && (
                        <ul style={{ paddingLeft: 16, lineHeight: 1.9, color: "var(--win-black)" }}>
                          {step.notes.map((note, ni) => (
                            <li key={ni}>{note}</li>
                          ))}
                        </ul>
                      )}

                      {step.links && step.links.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {step.links.map((link, li) => (
                            <a
                              key={li}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "2px 8px",
                                background: guide.color,
                                color: "white",
                                fontSize: 10,
                                textDecoration: "none",
                                border: "2px solid",
                                borderColor: "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                              }}
                            >
                              ↗ {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Useful links */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: "bold", fontSize: 10, color: "var(--win-darker)", marginBottom: 6, paddingLeft: 2 }}>
                  USEFUL LINKS
                </div>
                <div
                  style={{
                    border: "2px solid",
                    borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                    background: "var(--win-silver)",
                  }}
                >
                  {guide.usefulLinks.map((link, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "5px 10px",
                        borderBottom: i < guide.usefulLinks.length - 1 ? "1px solid var(--win-dark-silver)" : "none",
                      }}
                    >
                      <span style={{ fontSize: 10 }}>🔗</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: guide.color,
                          textDecoration: "underline",
                          fontWeight: "bold",
                          minWidth: 130,
                          fontSize: 11,
                        }}
                      >
                        {link.label}
                      </a>
                      <span style={{ color: "var(--win-darker)", fontSize: 10 }}>{link.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div>
            {/* Header */}
            <div
              style={{
                background: guide.color,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 28 }}>▶</span>
              <div>
                <div style={{ color: "white", fontWeight: "bold", fontSize: 13 }}>Video Tutorials</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, marginTop: 2 }}>
                  Video guides for {guide.title}
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {guide.videos.map((video, i) => (
                <div
                  key={i}
                  style={{
                    border: "2px solid",
                    borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                  }}
                >
                  {/* Video title bar */}
                  <div
                    style={{
                      background: guide.color,
                      padding: "5px 10px",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>▶</span> {video.title}
                  </div>

                  {/* Video embed or placeholder */}
                  <div style={{ background: "white", padding: 10 }}>
                    {video.url ? (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          paddingBottom: "56.25%",
                          background: "#000",
                        }}
                      >
                        <iframe
                          src={video.url}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            top: 0, left: 0,
                            width: "100%", height: "100%",
                            border: "none",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          height: 180,
                          background: "#1e1e1e",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          border: "1px solid #444",
                        }}
                      >
                        <span style={{ fontSize: 32 }}>🎬</span>
                        <span style={{ color: "#888", fontSize: 11 }}>Video coming soon</span>
                      </div>
                    )}

                    {video.description && (
                      <p style={{ marginTop: 8, color: "var(--win-darker)", lineHeight: 1.6, fontSize: 11 }}>
                        {video.description}{" "}
                        {video.videoAuthor && (
                          <a
                            href={video.videoAuthor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: guide.color, fontWeight: "bold", textDecoration: "underline" }}
                          >
                            {video.videoAuthor.name}
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
