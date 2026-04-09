"use client";

import { useState } from "react";

type Topic = "abskill" | "aiagent" | "claw" | "skill" | "mcp" | "cli";

const TOPICS: { id: Topic; label: string; icon: string }[] = [
  { id: "abskill", label: "What is abSkill?",      icon: "⭐" },
  { id: "aiagent", label: "What is AI Agent?",     icon: "🤖" },
  { id: "claw",    label: "What is Claw Council?", icon: "🐾" },
  { id: "skill",   label: "What is a Skill?",      icon: "📄" },
  { id: "mcp",     label: "What is MCP?",          icon: "🔌" },
  { id: "cli",     label: "What is CLI?",          icon: "💻" },
];

const CONTENT: Record<Topic, {
  title: string;
  icon: string;
  color: string;
  what: string;
  how: string;
  when: string[];
  requirements: string[];
  example: string;
}> = {
  abskill: {
    title: "What is abSkill?",
    icon: "⭐",
    color: "#b8860b",
    what: `abSkill is a community-built registry of Skills for the Abstract Chain ecosystem. It's a living directory where builders discover, share, and install Skill packages that teach AI agents how to interact with Abstract apps, protocols, and tools.

Think of it as the app store for AI agent capabilities — built by the community, for the community.`,
    how: `abSkill makes it easy to supercharge your AI agent:

• Browse skills by category — wallets, DeFi, gaming, NFTs, and more
• See exactly what each skill teaches your agent before installing
• One-line install commands ready to copy and paste
• Community ratings and real builder feedback on every skill`,
    when: [
      "You want your agent to work with a specific Abstract Chain app",
      "You're looking for ready-made agent capabilities instead of building from scratch",
      "You want to share a skill you built with the broader community",
      "You're exploring what AI agents can already do on Abstract",
    ],
    requirements: [
      "An AI agent or coding assistant (Claude, Cursor, OpenClaw, etc.)",
      "The skill install command shown on each skill's detail page",
      "No coding experience required",
    ],
    example: `# Browse skills on abSkill, then install one:
claude plugin add abstract-foundation/abstract-skills

# Ask your agent to use it:
"Connect my wallet to Abstract Global Wallet"`,
  },

  aiagent: {
    title: "What is an AI Agent?",
    icon: "🤖",
    color: "#8b0000",
    what: `An AI agent is a program that uses a large language model (LLM) as its brain — it can reason, plan, and take actions on your behalf. Unlike a simple chatbot that only answers questions, an agent can use tools, write and run code, browse the web, interact with blockchains, and complete multi-step tasks autonomously.

On Abstract Chain, AI agents can manage wallets, monitor onchain activity, execute transactions, and interact with DeFi protocols — all without you clicking a single button.`,
    how: `An AI agent works in a loop:

1. Receive a goal or task from you
2. Break it into steps using its reasoning ability
3. Call tools (MCP, CLI, APIs) to take real actions
4. Observe results and adjust its plan
5. Repeat until the task is complete

This means your agent can work for hours on complex tasks — and report back when done.`,
    when: [
      "You want to automate repetitive onchain tasks (monitoring, trading, staking)",
      "You want 24/7 activity without being at your computer",
      "You want to interact with Abstract Chain apps using natural language",
      "You're building autonomous workflows that react to onchain events",
      "You want to combine multiple tools into one intelligent system",
    ],
    requirements: [
      "An LLM host: OpenClaw, Claude Code, Cursor, or similar",
      "An API key for an LLM model (e.g. via OpenRouter)",
      "Skills and/or MCP servers for the tools you want",
      "Optionally: a wallet (via AGW CLI) for onchain actions",
    ],
    example: `# Example agent tasks on Abstract Chain:
"Monitor my wallet and alert me when balance drops below 0.1 ETH"
"Check the top XP gainers this week and summarize the activity"
"Execute a swap on [DEX] if the price hits my target"
"Deploy a new contract and verify it on the explorer"`,
  },

  claw: {
    title: "What is Claw Council?",
    icon: "🐾",
    color: "#1a6b3c",
    what: `Claw Council is the premier community for AI agent builders on Abstract Chain. We share builds, solve problems together, discuss the future of autonomous agents, and help each other grow.

Who we are:
- OpenClaw agent builders and operators
- Abstract Chain community members
- Pioneers in autonomous on-chain intelligence`,
    how: `Being part of Claw Council means you're never building alone:

• Share agent architectures and get feedback from real builders
• Solve technical problems together — someone has probably hit the same wall
• Discuss the latest in AI and crypto as it happens
• Help newcomers learn and pay it forward
• Build open-source agent tooling the whole community can use`,
    when: [
      "You're just starting out and need guidance from experienced builders",
      "You're stuck on a technical problem and want a second opinion",
      "You want to share what you've built and get real feedback",
      "You want to stay up to date with Abstract Chain developments",
      "You believe in building in public and open knowledge sharing",
    ],
    requirements: [
      "A genuine interest in AI agents and on-chain intelligence",
      "Willingness to share both wins and losses",
      "Respect for the community code (see below)",
      "No prior experience required — beginners are welcome",
    ],
    example: `🐾 The Claw Council Code:

1. Help others learn     — We were all beginners once
2. Share wins and losses — Both teach valuable lessons
3. Build in public       — Transparency breeds trust
4. No gatekeeping        — Knowledge should flow freely
5. Agents > Hype         — Show code, not promises
6. Have fun              — This is supposed to be enjoyable!`,
  },
  skill: {
    title: "What is a Skill?",
    icon: "📄",
    color: "#000080",
    what: `A skill is a text file (skill.md) that teaches an AI agent how to use a specific tool, protocol, or API. Think of it like an instruction manual — instead of the agent guessing how something works, the skill gives it exact steps, code examples, and warnings upfront.

Skills live in packages (like Abstract Foundation or Gigaverse) and are installed directly into your AI agent's context.`,
    how: `When you add a skill to your agent, it reads that file before starting work. This means:

• The agent knows exactly which libraries to install
• It knows which pitfalls to avoid (e.g. "always use viem 2.x, not 1.x")
• It can follow the correct steps without trial and error
• You get consistent, reliable results every time`,
    when: [
      "You want your agent to interact with a specific blockchain protocol",
      "You're integrating a new SDK or API into your project",
      "You keep seeing the agent make the same mistakes",
      "You want the agent to follow specific security rules",
      "You're working with Abstract L2 contracts or wallets",
    ],
    requirements: [
      "An AI agent or coding assistant (Claude, Cursor, etc.)",
      "The skill install command (shown on the skill's detail page)",
      "No coding experience required — the agent handles the rest",
    ],
    example: `# Install a skill into your agent
claude plugin add abstract-foundation/abstract-skills

# Then just ask your agent:
"Connect my app to Abstract Global Wallet"`,
  },

  mcp: {
    title: "What is MCP?",
    icon: "🔌",
    color: "#1a6b3c",
    what: `MCP stands for Model Context Protocol. It's a standard that lets AI agents connect to external tools and services as if they were plugins. Instead of copy-pasting data or switching between apps, your agent can call tools directly — like checking a wallet balance, reading a file, or sending a transaction.

Think of it like USB for AI: one standard port, many different devices.`,
    how: `You add an MCP server to your agent's config file once. After that:

• The agent sees new "tools" it can call (e.g. get_balance, send_tx)
• It decides on its own when to use them based on your request
• Results come back structured, so the agent can act on them immediately
• No copy-pasting, no switching tabs — everything stays in the conversation`,
    when: [
      "You want your agent to read live data (wallet balances, prices, etc.)",
      "You want the agent to take real actions (send transactions, deploy contracts)",
      "You're building an autonomous agent workflow",
      "You want to extend your agent without writing custom code",
      "You're using Claude Code, Cursor, or any MCP-compatible host",
    ],
    requirements: [
      "An MCP-compatible AI host (Claude Code, Cursor, Gemini, etc.)",
      "Node.js 18+ installed on your machine",
      "The MCP config JSON snippet (shown on the server's detail page)",
      "Paste the config into your agent host's settings — that's it",
    ],
    example: `// Paste this into your Claude Code settings (mcp.json):
{
  "mcpServers": {
    "agw-cli": {
      "command": "npx",
      "args": ["-y", "@abstract-foundation/agw-cli", "mcp", "serve"]
    }
  }
}

// Now you can ask Claude:
"What's my wallet balance on Abstract?"`,
  },

  cli: {
    title: "What is a CLI?",
    icon: "💻",
    color: "#4b0082",
    what: `CLI stands for Command Line Interface. It's a program you run by typing commands in a terminal (also called command prompt or shell). Unlike apps with buttons and menus, a CLI takes text commands and returns text results.

AGW CLI is special: it's designed for AI agents. Every command outputs clean JSON so the agent can read and act on the results automatically — no screen-scraping needed.`,
    how: `Once the AGW CLI is installed and authenticated:

• Your AI agent can call CLI commands as tools
• The agent checks your wallet, previews transactions, and executes them
• Your private key is never exposed — signing happens inside Privy's secure enclave
• The agent must preview a transaction before it can execute it (safety feature)`,
    when: [
      "You want an AI agent to manage a real wallet on Abstract",
      "You need programmatic access to wallet operations (balances, transfers, swaps)",
      "You're building an autonomous trading or gaming agent",
      "You want wallet actions without exposing your private key to the agent",
      "You prefer terminal-based workflows over browser UIs",
    ],
    requirements: [
      "Node.js 18+ and npm 10+ installed",
      "A terminal / command prompt",
      "An Abstract Global Wallet (or create one during setup)",
      "Run: npm install -g @abstract-foundation/agw-cli",
      "Run: agw-cli auth init to connect your wallet",
    ],
    example: `# Install
npm install -g @abstract-foundation/agw-cli

# Connect your wallet (opens browser)
agw-cli auth init --json '{"chainId":2741}' --execute

# Check balance
agw-cli wallet balances --json '{"fields":["native","tokens"]}'

# Preview a transaction (safe — doesn't execute)
agw-cli tx send --json '{"to":"0x...","value":"0"}' --dry-run`,
  },
};

export default function HelpWindow() {
  const [activeTopic, setActiveTopic] = useState<Topic>("abskill");
  const content = CONTENT[activeTopic];

  return (
    <div className="flex h-full" style={{ background: "var(--win-silver)", fontSize: 11 }}>
      {/* Sidebar */}
      <div
        style={{
          width: 160,
          borderRight: "2px solid",
          borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
          background: "var(--win-silver)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 6,
          flexShrink: 0,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 6, fontSize: 10, color: "var(--win-darker)", paddingLeft: 2 }}>
          TOPICS
        </div>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 8px",
              textAlign: "left",
              background: activeTopic === t.id ? "var(--win-blue)" : "transparent",
              color: activeTopic === t.id ? "white" : "var(--win-black)",
              border: activeTopic === t.id
                ? "2px solid var(--win-darker)"
                : "2px solid transparent",
              cursor: "default",
              fontSize: 11,
              fontWeight: activeTopic === t.id ? "bold" : "normal",
            }}
          >
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ lineHeight: 1.3 }}>{t.label}</span>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div
          style={{
            padding: 8,
            background: "white",
            border: "2px solid",
            borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
            fontSize: 10,
            color: "var(--win-darker)",
            lineHeight: 1.5,
          }}
        >
          💡 New here? Start with <b>abSkill</b> and <b>AI Agent</b>, then explore Skills, MCP and CLI.
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ background: "white" }}>
        {/* Topic header */}
        <div
          style={{
            background: content.color,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 28 }}>{content.icon}</span>
          <span style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{content.title}</span>
        </div>

        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* What is it */}
          <Section title="📖 What is it?" color={content.color}>
            <p style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>{content.what}</p>
          </Section>

          {/* How does it help */}
          <Section title="🤖 How does it help your agent?" color={content.color}>
            <p style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>{content.how}</p>
          </Section>

          {/* When to use */}
          <Section title="✅ When to use it" color={content.color}>
            <ul style={{ paddingLeft: 16, lineHeight: 2 }}>
              {content.when.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          {/* Requirements */}
          <Section title="📋 Requirements" color={content.color}>
            <ul style={{ paddingLeft: 16, lineHeight: 2 }}>
              {content.requirements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          {/* Example */}
          <Section title="💡 Quick Example" color={content.color}>
            <pre
              style={{
                background: "#1e1e1e",
                color: "#d4d4d4",
                padding: 10,
                fontSize: 10,
                fontFamily: "monospace",
                lineHeight: 1.7,
                overflowX: "auto",
                border: "2px solid",
                borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
              }}
            >
              {content.example}
            </pre>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: 11,
          borderBottom: `2px solid ${color}`,
          paddingBottom: 3,
          marginBottom: 6,
          color,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
