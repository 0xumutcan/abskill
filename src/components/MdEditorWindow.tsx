"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "textarea" | "radio";

interface Field {
  id: string;
  label: string;
  hint: string;
  placeholder?: string;
  type: FieldType;
  options?: string[];
}

interface FileDef {
  id: string;
  filename: string;
  title: string;
  icon: string;
  tagline: string;
  why: string;
  platforms: ("hermes" | "openclaw")[];
  fields: Field[];
  requiredFields?: string[];
  buildMarkdown: (vals: Record<string, string>) => string;
}

// ─── Presets ──────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  icon: string;
  description: string;
  platforms: ("hermes" | "openclaw")[];
  values: Record<string, Record<string, string>>;
}

const PRESETS: Preset[] = [
  {
    id: "abstract-specialist",
    label: "Abstract Chain Specialist",
    icon: "⛓️",
    description: "An agent whose sole purpose is to monitor, analyze, and act on Abstract Chain (Chain ID 2741). Pre-fills all files with Abstract-specific configuration.",
    platforms: ["hermes", "openclaw"],
    values: {
      soul: {
        personality: "A focused, on-chain specialist that operates exclusively within the Abstract Chain ecosystem. Data-driven and precise — it never speculates, never hallucinates chain state, and never acts outside its defined scope.",
        values: "— Only operate within Abstract Chain (Chain ID 2741)\n— Never execute a transaction without explicit user confirmation\n— Always verify on-chain state before reporting — never assume\n— Cite the data source for every claim about chain activity",
        tone: "Technical and concise. No generic crypto commentary. Abstract-specific insight only. If something is outside Abstract Chain, say so and stop.",
        aspiration: "Make the user's life on Abstract easier over time: automate the tasks they repeat, find more efficient paths to their goals, and reduce the friction between intent and on-chain action.",
        limits: "— Never interact with contracts outside Abstract Chain (Chain ID 2741)\n— Never expose private keys, seed phrases, or signed transactions in output\n— Never make assumptions about wallet state without a live on-chain check\n— Never bridge assets without step-by-step user confirmation",
        ambiguity: "State exactly what is unknown and ask for clarification. Never fill gaps with guesses about chain state, balances, or contract behavior.",
      },
      identity: {
        name: "Abstract Agent",
        role: "Abstract Chain Specialist",
        emoji: "⛓️",
        channel: "Telegram",
        notes: "Dedicated Abstract Chain operator. Does not handle tasks outside the Abstract ecosystem. Routes cross-chain or off-chain requests back to the user.",
      },
      agents: {
        mission: "Operate exclusively on Abstract Chain — monitor wallets, interact with Abstract protocols, and execute on-chain actions on behalf of the user.",
        role: "Solo operator — works independently",
        sop: "1. Load SOUL.md and MEMORY.md\n2. Verify AGW CLI connectivity and Abstract Chain RPC\n3. Confirm task scope — is this an Abstract Chain task?\n4. Check live on-chain state before taking any action\n5. Preview the action (dry-run if available)\n6. Confirm with user before any write operation\n7. Execute and report outcome with tx hash",
        escalation: "— Any transaction above 0.1 ETH in value\n— Interaction with an unrecognized or unaudited contract\n— Wallet balance below safety threshold\n— Any request involving assets outside Abstract Chain",
      },
      user: {
        jobtitle: "",
        goals: "Monitor my Abstract Chain activity and alert me to anything significant. Help me interact with Abstract protocols without having to switch between tools.",
        prefs: "Short and direct. Lead with the data, then the action. No filler.",
        autonomy: "Medium — handle routine tasks, ask on anything significant",
      },
      tools: {
        usage: "— Use AGW CLI for all wallet operations on Abstract Chain\n— Use MCP Abstract server for live on-chain data (balances, XP, transactions)\n— Always call --dry-run before any write operation\n— Set --chain-id 2741 on every CLI call to prevent cross-chain errors",
        env: "abstract-rpc: https://api.mainnet.abs.xyz\nabstract-explorer: https://abscan.org\nagw-cli: npx @abstract-foundation/agw-cli\nmcp-abstract: @abstract-foundation/abstract-mcp",
        banned: "— Never interact with contracts on any chain other than Abstract (Chain ID 2741)\n— Never skip the dry-run step before a transaction\n— Never expose private keys in any output or log\n— Never execute a bridge without explicit per-step user approval",
        output: "Reports → ~/abstract-reports/YYYY-MM-DD.md\nTx logs → ~/abstract-logs/txs.jsonl\nAll filenames lowercase with hyphens",
      },
      memory: {
        facts: "— Abstract Chain: ZK-rollup L2, Chain ID 2741, native token ETH\n— Abstract Global Wallet (AGW): the native smart contract wallet for Abstract\n— AGW CLI: @abstract-foundation/agw-cli — used for wallet ops, balances, tx execution\n— Abstract MCP: @abstract-foundation/abstract-mcp — on-chain data via Model Context Protocol\n— Skills: .md files that teach agents how to use Abstract protocols (installed via skill packages)\n— Abstract Explorer: https://abscan.org\n— Abstract RPC: https://api.mainnet.abs.xyz\n— XP system: on-chain experience points tracked per wallet",
        hygiene: "",
      },
      heartbeat: {},
      boot: {
        checks: "— Verify AGW CLI is installed and authenticated (agw-cli auth status)\n— Verify connectivity to Abstract Chain RPC (https://api.mainnet.abs.xyz)\n— Confirm MCP Abstract server is reachable\n— Load and acknowledge SOUL.md\n— Load MEMORY.md and confirm Abstract Chain facts are current",
        log: "Post to Telegram: agent name, active wallet address, Abstract Chain block height, current date/time, and status: READY or DEGRADED with reason.",
      },
    },
  },
];

// ─── File Definitions ─────────────────────────────────────────────────────────

const FILES: FileDef[] = [
  // ── SOUL.md ──────────────────────────────────────────────────────────────
  {
    id: "soul",
    filename: "SOUL.md",
    title: "Soul",
    icon: "🔮",
    tagline: "Your agent's identity contract — who it is, how it thinks, and what it will never compromise on.",
    why: "Without this, your agent has no stable character. Each session it starts fresh with no sense of self.",
    platforms: ["hermes", "openclaw"],
    requiredFields: ["name"],
    fields: [
      {
        id: "name",
        label: "Agent Handle",
        hint: "The name your agent goes by. Short, distinct, memorable.",
        placeholder: "e.g. Axiom, Relay, Cipher, Vex...",
        type: "text",
      },
      {
        id: "personality",
        label: "Character",
        hint: "Describe the personality in a sentence or two. How does it feel to work with this agent?",
        placeholder: "e.g. Methodical and direct, with a low tolerance for vagueness. It pushes back when something doesn't add up.",
        type: "textarea",
      },
      {
        id: "values",
        label: "Core Principles",
        hint: "The rules it will never bend. One per line, starting with —",
        placeholder: "— Never fabricate data or fill gaps with assumptions\n— Confirm before any destructive action\n— Cite the source, not just the conclusion",
        type: "textarea",
      },
      {
        id: "tone",
        label: "Communication Style",
        hint: "How should it talk to you? Terse and technical, or warm and explanatory?",
        placeholder: "Short and precise. Skip the preamble. If something is wrong, say it plainly.",
        type: "textarea",
      },
      {
        id: "aspiration",
        label: "Growth Direction",
        hint: "What should this agent get better at over time as it learns your patterns?",
        placeholder: "Build a deeper map of how I work — what I delegate, what I keep, what slows me down.",
        type: "textarea",
      },
      {
        id: "limits",
        label: "Hard Stops",
        hint: "Actions it must refuse, unconditionally. One per line.",
        placeholder: "— Never expose credentials or keys in any output\n— Never delete data without explicit confirmation\n— Never impersonate another system or agent",
        type: "textarea",
      },
      {
        id: "ambiguity",
        label: "Uncertainty Protocol",
        hint: "What should it do when it doesn't know something or the instructions are unclear?",
        placeholder: "Say 'I'm not sure' and name what's missing. Don't guess. Don't fill in the blanks silently.",
        type: "textarea",
      },
    ],
    buildMarkdown: (v) => `# SOUL.md — Agent Identity

> This file is loaded at the start of every session. It defines who you are.

## Handle
${v.name || "[Agent name not set]"}

## Character
${v.personality || "[No character defined]"}

## Core Principles
${v.values || "[No principles defined]"}

## Communication Style
${v.tone || "[No tone defined]"}

## Growth Direction
${v.aspiration || "[No aspiration defined]"}

## Hard Stops
${v.limits || "[No hard stops defined]"}

## Uncertainty Protocol
${v.ambiguity || "[No uncertainty protocol defined]"}`,
  },

  // ── IDENTITY.md ──────────────────────────────────────────────────────────
  {
    id: "identity",
    filename: "IDENTITY.md",
    title: "Identity",
    icon: "🪪",
    tagline: "The agent's public-facing ID card — routing metadata for multi-agent pipelines and messaging platforms.",
    why: "In multi-agent setups or group chats, this is what tells the system which agent a message belongs to.",
    platforms: ["openclaw"],
    fields: [
      {
        id: "name",
        label: "Display Name",
        hint: "Public-facing name shown in logs, chat headers, and dashboards. Should match SOUL.md.",
        placeholder: "e.g. Axiom",
        type: "text",
      },
      {
        id: "role",
        label: "Function Tag",
        hint: "One short label that describes what this agent does in the system.",
        placeholder: "e.g. Research Lead · Code Reviewer · Deployment Watcher",
        type: "text",
      },
      {
        id: "emoji",
        label: "Avatar Symbol",
        hint: "An emoji that visually identifies this agent in interfaces and message threads.",
        placeholder: "e.g. ⚡ 🧠 🛠️ 🔬 🦊",
        type: "text",
      },
      {
        id: "channel",
        label: "Primary Channel",
        hint: "Where this agent primarily operates.",
        placeholder: "e.g. Telegram · Discord · Slack · CLI",
        type: "text",
      },
      {
        id: "notes",
        label: "Routing Notes",
        hint: "Any notes about this agent's role in a larger multi-agent system.",
        placeholder: "Handles all inbound research tasks. Routes complex decisions to the orchestrator. Does not hold memory across agents.",
        type: "textarea",
      },
    ],
    buildMarkdown: (v) => `# IDENTITY.md — Agent Metadata

> Used for routing in multi-agent systems and messaging platforms.

## Display Name
${v.name || "[Not set]"}

## Function Tag
${v.role || "[Not set]"}

## Avatar Symbol
${v.emoji || "[Not set]"}

## Primary Channel
${v.channel || "[Not set]"}

## Routing Notes
${v.notes || "[No notes]"}`,
  },

  // ── AGENTS.md ────────────────────────────────────────────────────────────
  {
    id: "agents",
    filename: "AGENTS.md",
    title: "Operations",
    icon: "⚙️",
    tagline: "The operating manual — boot sequence, task procedures, and decision rules. Read at the start of every turn.",
    why: "Without this, the agent improvises. With it, the agent follows a tested, reliable playbook every time.",
    platforms: ["openclaw"],
    fields: [
      {
        id: "mission",
        label: "Core Mission",
        hint: "The single most important thing this agent exists to do. One sentence.",
        placeholder: "Own the full deployment pipeline — from code push to production verify.",
        type: "textarea",
      },
      {
        id: "role",
        label: "Operating Mode",
        hint: "How this agent fits into the system.",
        type: "radio",
        options: ["Solo operator — works independently", "Orchestrator — coordinates other agents", "Specialist — spawned and directed by an orchestrator"],
      },
      {
        id: "sop",
        label: "Standard Playbook",
        hint: "Numbered steps for typical tasks. The agent follows this in order.",
        placeholder: "1. Load SOUL.md and MEMORY.md\n2. Verify environment tools\n3. Confirm task scope with user\n4. Execute in small, reversible steps\n5. Report outcome",
        type: "textarea",
      },
      {
        id: "escalation",
        label: "Escalation Triggers",
        hint: "Situations where the agent must stop and wait for a human decision.",
        placeholder: "— Any action touching a production environment\n— Spend exceeds $10 in a single session\n— Conflicting instructions with no clear resolution",
        type: "textarea",
      },
    ],
    buildMarkdown: (v) => `# AGENTS.md — Operating Manual

> Read at the start of every turn. This is your governance document.

## Core Mission
${v.mission || "[Not defined]"}

## Operating Mode
${v.role || "[Not selected]"}

## Standard Playbook
${v.sop || "[No playbook defined]"}

## Escalation Triggers
${v.escalation || "[No escalation rules defined]"}`,
  },

  // ── USER.md ──────────────────────────────────────────────────────────────
  {
    id: "user",
    filename: "USER.md",
    title: "User Profile",
    icon: "👤",
    tagline: "A briefing on who you are and how you like to work — so the agent stops guessing.",
    why: "Without this, the agent treats you like a stranger every session. With it, it knows your context from the first message.",
    platforms: ["hermes", "openclaw"],
    requiredFields: ["name"],
    fields: [
      {
        id: "name",
        label: "What to Call You",
        hint: "The name or handle the agent uses when addressing you.",
        placeholder: "e.g. Alex, or just skip pleasantries entirely",
        type: "text",
      },
      {
        id: "jobtitle",
        label: "What You Do",
        hint: "Your role in one line. Helps the agent calibrate depth and vocabulary.",
        placeholder: "e.g. Indie dev shipping SaaS · Researcher at a biotech startup",
        type: "text",
      },
      {
        id: "goals",
        label: "What You're After",
        hint: "Your goals and what currently slows you down the most.",
        placeholder: "Ship faster and stop losing context between sessions. Biggest pain: re-explaining the same project setup every time.",
        type: "textarea",
      },
      {
        id: "prefs",
        label: "How You Like Information",
        hint: "Format, response length, level of detail, things that annoy you.",
        placeholder: "Bullets over paragraphs. No filler. If you don't know, say so. Don't pad short answers.",
        type: "textarea",
      },
      {
        id: "autonomy",
        label: "Autonomy Level",
        hint: "How much freedom can the agent take before checking in?",
        type: "radio",
        options: ["Low — check with me before every action", "Medium — handle routine tasks, ask on anything significant", "High — run autonomously, just log what you did"],
      },
    ],
    buildMarkdown: (v) => `# USER.md — User Profile

> Load this in private 1:1 sessions to personalize every interaction.

## Name
${v.name || "[Not set]"}

## Role
${v.jobtitle || "[Not set]"}

## Goals & Pain Points
${v.goals || "[Not defined]"}

## Communication Preferences
${v.prefs || "[Not defined]"}

## Autonomy Level
${v.autonomy || "[Not selected]"}`,
  },

  // ── TOOLS.md ─────────────────────────────────────────────────────────────
  {
    id: "tools",
    filename: "TOOLS.md",
    title: "Tool Rules",
    icon: "🛠️",
    tagline: "Not which tools exist — that's set elsewhere. This is the playbook for how and when to use them.",
    why: "Without this, the agent burns through API quotas guessing. Every tool call becomes intentional.",
    platforms: ["openclaw"],
    fields: [
      {
        id: "usage",
        label: "Usage Rules",
        hint: "Flags, timeouts, and conventions for calling tools correctly. One rule per line.",
        placeholder: "— Always set --timeout 30 on external HTTP calls\n— Use jq for all JSON parsing, not Python eval\n— Prefer dry-run before any write operation",
        type: "textarea",
      },
      {
        id: "env",
        label: "Environment Map",
        hint: "Hostnames, API endpoints, database addresses the agent needs at runtime.",
        placeholder: "prod-api: https://api.yourapp.com\nstaging-db: postgres://staging-host:5432/db\nssh-target: user@10.0.0.5",
        type: "textarea",
      },
      {
        id: "banned",
        label: "Off-Limits Patterns",
        hint: "Tool usage that's explicitly banned. Hard rules, no exceptions.",
        placeholder: "— Never run DELETE without a dry-run first\n— No direct SQL in production\n— Never pipe curl output to bash",
        type: "textarea",
      },
      {
        id: "output",
        label: "Output & File Conventions",
        hint: "Where things get saved, naming patterns, what format outputs should use.",
        placeholder: "Logs → /var/log/agent/\nReports → ~/reports/YYYY-MM-DD.md\nAll filenames lowercase with hyphens",
        type: "textarea",
      },
    ],
    buildMarkdown: (v) => `# TOOLS.md — Tool Rulebook

> This file governs HOW and WHEN to use tools, not which tools exist.

## Usage Rules
${v.usage || "[No rules defined]"}

## Environment Map
${v.env || "[No environment defined]"}

## Off-Limits Patterns
${v.banned || "[None defined]"}

## Output & File Conventions
${v.output || "[No conventions defined]"}`,
  },

  // ── MEMORY.md ────────────────────────────────────────────────────────────
  {
    id: "memory",
    filename: "MEMORY.md",
    title: "Memory",
    icon: "🧠",
    tagline: "Facts that survive context resets — the things your agent must always know, no matter what.",
    why: "Context windows fill up and sessions end. MEMORY.md is what carries critical knowledge forward.",
    platforms: ["hermes", "openclaw"],
    fields: [
      {
        id: "facts",
        label: "Iron-Law Facts",
        hint: "Critical facts the agent must always remember. Think of it as a permanent sticky note on its desk.",
        placeholder: "— Stack: Next.js 14, Supabase, Tailwind CSS\n— Prod deployment: Vercel (auto on push to main)\n— Never commit .env.local\n— API versioning: all endpoints use /v2, never /v1",
        type: "textarea",
      },
      {
        id: "hygiene",
        label: "Hygiene Rules",
        hint: "How the agent should keep this file accurate over time. When to add, when to prune.",
        placeholder: "Add only facts that would change how future tasks are handled. Review and prune at the start of each week. Keep under 15,000 characters.",
        type: "textarea",
      },
    ],
    buildMarkdown: (v) => `# MEMORY.md — Permanent Fact Index

> Iron-law facts that survive context resets and compaction.

## Facts
${v.facts || "[No facts recorded]"}

## Hygiene Rules
${v.hygiene || "[No hygiene rules defined]"}`,
  },

  // ── HEARTBEAT.md ─────────────────────────────────────────────────────────
  {
    id: "heartbeat",
    filename: "HEARTBEAT.md",
    title: "Heartbeat",
    icon: "💓",
    tagline: "Scheduled checks that run automatically — turning your agent from reactive to proactive.",
    why: "A chatbot waits to be asked. An agent watches. This file defines what it watches, and how often.",
    platforms: ["openclaw"],
    fields: [
      {
        id: "fast",
        label: "High-Frequency Checks (every 15–30 min)",
        hint: "Fast, cheap scans. These run constantly in the background.",
        placeholder: "— Check if any monitored wallet balance drops below threshold\n— Scan for new mentions in tracked channels\n— Verify API health endpoints",
        type: "textarea",
      },
      {
        id: "medium",
        label: "Digest Checks (every 1–2 hours)",
        hint: "Things worth checking a few times a day — not urgent, but not ignorable.",
        placeholder: "— Pull latest XP leaderboard and flag top movers\n— Check for new skill releases in the registry\n— Summarize any unread notifications",
        type: "textarea",
      },
      {
        id: "scheduled",
        label: "Scheduled Jobs (daily / weekly)",
        hint: "Deeper synthesis and maintenance tasks on a longer cadence.",
        placeholder: "Daily: Generate a one-paragraph status summary and send to Telegram\nWeekly: Review MEMORY.md for outdated entries and suggest pruning",
        type: "textarea",
      },
    ],
    buildMarkdown: (v) => `# HEARTBEAT.md — Proactive Pulse

> When the heartbeat timer fires, run the following checks in order.
> If all pass and no action is needed, reply exactly: HEARTBEAT_OK

## High-Frequency (every 15–30 min)
${v.fast || "[No fast checks defined]"}

## Digest Checks (every 1–2 hours)
${v.medium || "[No digest checks defined]"}

## Scheduled Jobs (daily / weekly)
${v.scheduled || "[No scheduled jobs defined]"}`,
  },

  // ── BOOT.md ──────────────────────────────────────────────────────────────
  {
    id: "boot",
    filename: "BOOT.md",
    title: "Boot",
    icon: "🚀",
    tagline: "Runs exactly once when the agent starts — verifying the environment before any real work begins.",
    why: "Catching a broken environment at launch beats discovering it halfway through a critical task.",
    platforms: ["openclaw"],
    fields: [
      {
        id: "checks",
        label: "Pre-Flight Checks",
        hint: "What the agent must verify before it considers itself ready. One check per line.",
        placeholder: "— Confirm all required environment variables are set\n— Verify connectivity to primary API endpoint\n— Check that output directories exist and are writable\n— Load and acknowledge SOUL.md",
        type: "textarea",
      },
      {
        id: "log",
        label: "Startup Report",
        hint: "What the agent should log or announce when it boots successfully.",
        placeholder: "Log: agent handle, active channel, current date/time, and a one-line status. Post to Telegram if available.",
        type: "textarea",
      },
    ],
    buildMarkdown: (v) => `# BOOT.md — Initialization Sequence

> Runs ONCE when the agent gateway starts.

## Pre-Flight Checks
${v.checks || "[No checks defined]"}

## Startup Report
${v.log || "[No startup report defined]"}`,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MdEditorWindow({ platform }: { platform: string }) {
  const isHermes = platform === "hermes";
  const color = isHermes ? "#4b0082" : "#1a6b3c";

  const availableFiles = useMemo(
    () => FILES.filter((f) => f.platforms.includes(platform as "hermes" | "openclaw")),
    [platform]
  );

  const [selectedId, setSelectedId] = useState(availableFiles[0]?.id ?? "soul");
  const [allValues, setAllValues] = useState<Record<string, Record<string, string>>>({});
  const [copied, setCopied] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const availablePresets = PRESETS.filter((p) => p.platforms.includes(platform as "hermes" | "openclaw"));

  const applyPreset = (preset: Preset) => {
    setAllValues((prev) => {
      const next = { ...prev };
      for (const [fileId, vals] of Object.entries(preset.values)) {
        next[fileId] = { ...(prev[fileId] ?? {}), ...vals };
      }
      return next;
    });
    setAppliedPreset(preset.id);
    setPresetOpen(false);
  };

  const clearPreset = () => {
    setAllValues({});
    setAppliedPreset(null);
    setPresetOpen(false);
  };

  const selectedFile = availableFiles.find((f) => f.id === selectedId) ?? availableFiles[0];
  const fileValues = allValues[selectedId] ?? {};

  const setValue = (fieldId: string, val: string) => {
    setAllValues((prev) => ({
      ...prev,
      [selectedId]: { ...(prev[selectedId] ?? {}), [fieldId]: val },
    }));
  };

  const markdown = selectedFile?.buildMarkdown(fileValues) ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const isConfigured = (fid: string) => {
    const vals = allValues[fid] ?? {};
    return Object.values(vals).some((v) => v.trim().length > 0);
  };

  const hasMissingRequired = (fid: string) => {
    const file = availableFiles.find((f) => f.id === fid);
    if (!file?.requiredFields?.length) return false;
    const vals = allValues[fid] ?? {};
    return file.requiredFields.some((rf) => !vals[rf]?.trim());
  };

  const isFullyComplete = (fid: string) => isConfigured(fid) && !hasMissingRequired(fid);

  const configuredCount = availableFiles.filter((f) => isConfigured(f.id)).length;

  const combinedMarkdown = availableFiles
    .filter((f) => isConfigured(f.id))
    .map((f) => f.buildMarkdown(allValues[f.id] ?? {}))
    .join("\n\n---\n\n");

  const handleCopyAll = () => {
    navigator.clipboard.writeText(combinedMarkdown).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3500);
    });
  };
  const missingRequiredFiles = appliedPreset
    ? availableFiles.filter((f) => hasMissingRequired(f.id))
    : [];
  const charCount = markdown.length;

  return (
    <div className="flex h-full" style={{ background: "var(--win-silver)", fontSize: 11 }}>
      {/* ── Sidebar ── */}
      <div
        style={{
          width: 150,
          borderRight: "2px solid",
          borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "6px 8px",
            borderBottom: "1px solid var(--win-darker)",
            fontSize: 10,
            fontWeight: "bold",
            color: "var(--win-darker)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>FILES — {configuredCount}/{availableFiles.length}</span>
        </div>

        {/* Preset button */}
        {availablePresets.length > 0 && (
          <div style={{ padding: "5px 6px", borderBottom: "1px solid var(--win-darker)", position: "relative" }}>
            <button
              onClick={() => setPresetOpen((o) => !o)}
              style={{
                width: "100%",
                padding: "3px 6px",
                fontSize: 10,
                fontWeight: "bold",
                cursor: "default",
                background: appliedPreset ? "#1a6b3c" : "var(--win-silver)",
                color: appliedPreset ? "white" : "var(--win-black)",
                border: "2px solid",
                borderColor: appliedPreset
                  ? "#1a6b3c"
                  : "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{appliedPreset ? "✓" : "⚡"}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{appliedPreset ? "Preset applied" : "Load Preset"}</span>
              <span>▼</span>
            </button>

            {presetOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 6,
                right: 6,
                background: "var(--win-silver)",
                border: "2px solid",
                borderColor: "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                zIndex: 50,
                boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
              }}>
                {availablePresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    style={{
                      padding: "6px 8px",
                      cursor: "default",
                      borderBottom: "1px solid var(--win-darker)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = color; (e.currentTarget as HTMLDivElement).style.color = "white"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; (e.currentTarget as HTMLDivElement).style.color = ""; }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </div>
                    <div style={{ fontSize: 9, marginTop: 2, lineHeight: 1.4, opacity: 0.8 }}>{preset.description}</div>
                  </div>
                ))}
                {appliedPreset && (
                  <div
                    onClick={clearPreset}
                    style={{ padding: "6px 8px", cursor: "default" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#cc0000"; (e.currentTarget as HTMLDivElement).style.color = "white"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; (e.currentTarget as HTMLDivElement).style.color = ""; }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>✕</span>
                      <span>Clear preset</span>
                    </div>
                    <div style={{ fontSize: 9, marginTop: 2, lineHeight: 1.4, opacity: 0.8 }}>Reset all fields to blank.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* File list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {availableFiles.map((f) => {
            const active = f.id === selectedId;
            const configured = isConfigured(f.id);
            return (
              <button
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                  padding: "6px 8px",
                  textAlign: "left",
                  background: active ? color : "transparent",
                  color: active ? "white" : "var(--win-black)",
                  border: "none",
                  borderBottom: "1px solid",
                  borderColor: active
                    ? "transparent"
                    : "var(--win-dark-silver, #b0b0b0)",
                  cursor: "default",
                  fontSize: 11,
                }}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>{f.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: "bold", fontSize: 10 }}>{f.filename}</div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>{f.title}</div>
                </div>
                {isConfigured(f.id) && (
                  hasMissingRequired(f.id) ? (
                    <span style={{ fontSize: 9, color: active ? "rgba(255,255,255,0.8)" : "#cc0000", fontWeight: "bold" }}>✗</span>
                  ) : (
                    <span style={{ fontSize: 9, color: active ? "rgba(255,255,255,0.8)" : "#1a6b3c", fontWeight: "bold" }}>✓</span>
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Progress / warning area */}
        <div style={{ padding: "6px 8px", borderTop: "1px solid var(--win-darker)" }}>
          {missingRequiredFiles.length > 0 ? (
            <div style={{
              fontSize: 9,
              color: "#cc0000",
              fontWeight: "bold",
              lineHeight: 1.5,
            }}>
              ✗ Set your name in:<br />
              {missingRequiredFiles.map((f) => f.filename).join(", ")}
            </div>
          ) : (
            <>
              <div style={{ fontSize: 9, color: "var(--win-darker)", marginBottom: 3 }}>
                {availableFiles.every((f) => isFullyComplete(f.id))
                  ? "✓ All configured"
                  : `${configuredCount} of ${availableFiles.length} done`}
              </div>
              <div style={{ height: 6, background: "white", border: "1px solid var(--win-darker)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(configuredCount / availableFiles.length) * 100}%`,
                  background: availableFiles.every((f) => isFullyComplete(f.id)) ? "#1a6b3c" : color,
                  transition: "width 0.3s",
                }} />
              </div>
            </>
          )}
        </div>

        {/* Copy All button */}
        {configuredCount > 0 && (
          <div style={{ padding: "5px 6px", borderTop: "1px solid var(--win-darker)" }}>
            <button
              onClick={handleCopyAll}
              style={{
                width: "100%",
                padding: "4px 6px",
                fontSize: 10,
                fontWeight: "bold",
                cursor: "default",
                background: copiedAll ? "#000080" : "var(--win-silver)",
                color: copiedAll ? "white" : "var(--win-black)",
                border: "2px solid",
                borderColor: copiedAll
                  ? "#000080"
                  : "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                textAlign: "center",
                lineHeight: 1.4,
                transition: "background 0.15s",
              }}
            >
              {copiedAll ? "📋 Paste it to your agent!" : "📋 Copy all files"}
            </button>
          </div>
        )}
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* File header */}
        <div
          style={{
            background: color,
            padding: "8px 12px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>{selectedFile?.icon}</span>
            <div>
              <div style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
                {selectedFile?.filename}
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>
                {selectedFile?.tagline}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 6,
              padding: "4px 8px",
              background: "rgba(0,0,0,0.25)",
              fontSize: 10,
              color: "rgba(255,255,255,0.85)",
              borderLeft: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            <b>WHY:</b> {selectedFile?.why}
          </div>
        </div>

        {/* Two-panel: form + preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form fields */}
          <div
            style={{
              flex: "0 0 55%",
              overflowY: "auto",
              padding: "10px 12px",
              borderRight: "2px solid",
              borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {selectedFile?.fields.map((field) => (
              <div key={field.id}>
                <div style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>
                  {field.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--win-darker)", marginBottom: 4, lineHeight: 1.4 }}>
                  {field.hint}
                </div>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={fileValues[field.id] ?? ""}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "4px 6px",
                      fontSize: 11,
                      fontFamily: "inherit",
                      border: "2px solid",
                      borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                      background: "white",
                      outline: "none",
                    }}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={fileValues[field.id] ?? ""}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "4px 6px",
                      fontSize: 11,
                      fontFamily: "monospace",
                      border: "2px solid",
                      borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
                      background: "white",
                      resize: "vertical",
                      outline: "none",
                      lineHeight: 1.6,
                    }}
                  />
                )}

                {field.type === "radio" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {field.options?.map((opt) => (
                      <label
                        key={opt}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 8px",
                          background: fileValues[field.id] === opt ? color : "var(--win-silver)",
                          color: fileValues[field.id] === opt ? "white" : "var(--win-black)",
                          cursor: "default",
                          border: "1px solid var(--win-darker)",
                          fontSize: 11,
                        }}
                      >
                        <input
                          type="radio"
                          name={`${selectedId}-${field.id}`}
                          value={opt}
                          checked={fileValues[field.id] === opt}
                          onChange={() => setValue(field.id, opt)}
                          style={{ cursor: "default" }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live preview */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Preview header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 8px",
                borderBottom: "2px solid var(--win-darker)",
                background: "var(--win-silver)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: "bold", color: "var(--win-darker)" }}>
                LIVE PREVIEW
              </span>
              <button
                onClick={handleCopy}
                style={{
                  padding: "2px 10px",
                  fontSize: 10,
                  cursor: "pointer",
                  background: copied ? "#1a6b3c" : "var(--win-silver)",
                  color: copied ? "white" : "var(--win-black)",
                  border: "2px solid",
                  borderColor: copied
                    ? "#1a6b3c"
                    : "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                  fontWeight: "bold",
                }}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>

            {/* Fake window chrome — Win95 style */}
            <div
              style={{
                background: "linear-gradient(to right, var(--win-titlebar), var(--win-titlebar-end))",
                padding: "2px 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: 10, color: "white", fontWeight: "bold", paddingLeft: 2 }}>
                {selectedFile?.filename}
              </span>
              <div style={{ display: "flex", gap: 2 }}>
                {["_", "□", "✕"].map((sym) => (
                  <div key={sym} style={{
                    width: 16, height: 14,
                    background: "var(--win-silver)",
                    border: "2px solid",
                    borderColor: "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, fontWeight: "bold", color: "var(--win-black)",
                    lineHeight: 1,
                  }}>{sym}</div>
                ))}
              </div>
            </div>

            {/* Markdown output */}
            <pre
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px 10px",
                margin: 0,
                background: "#1e1e1e",
                color: "#d4d4d4",
                fontSize: 10,
                fontFamily: "monospace",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {markdown}
            </pre>

            {/* Char count */}
            <div
              style={{
                padding: "2px 8px",
                background: "var(--win-silver)",
                borderTop: "1px solid var(--win-darker)",
                fontSize: 10,
                color: "var(--win-darker)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span>
                Inspired from{" "}
                <a
                  href="https://x.com/Aizcalibur"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  Aiz
                </a>
                {"'s "}
                <a
                  href="https://agent-workspace-builder.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  Workspace Builder
                </a>
              </span>
              <span>{charCount.toLocaleString()} chars</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
