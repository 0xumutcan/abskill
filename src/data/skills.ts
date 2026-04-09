import { Skill, SkillPackage } from "@/types/skill";

// ─── Package registry ────────────────────────────────────────────────────────
export const PACKAGES: SkillPackage[] = [
  {
    id: "abstract-foundation",
    label: "Abstract Foundation",
    logo: "/aflogo.webp",
    type: "indexed",
  },
  {
    id: "gigaverse-games",
    label: "Gigaverse Games",
    logo: "/gigaverse.png",
    type: "indexed",
  },
  {
    id: "rugpull-bakery",
    label: "Rugpull Bakery",
    logo: "/rb.webp",
    type: "linked",
    url: "https://www.rugpullbakery.com/skill.md",
  },
  {
    id: "abstract-mania",
    label: "Abstract Mania",
    logo: "/amania.webp",
    type: "linked",
    url: "https://mania.bearish.af/skill.md",
  },
];

// Install cmd from: https://github.com/Abstract-Foundation/abstract-skills (README)
const AF_INSTALL = "claude plugin add abstract-foundation/abstract-skills";

// Install cmd from: https://github.com/Gigaverse-Games/play (README)
const GV_INSTALL = "npx skills add gigaverse-games/play";

export const skills: Skill[] = [
  // ─────────────────────────────────────────────────────────────────
  // Abstract Foundation
  // ─────────────────────────────────────────────────────────────────
  {
    id: "abstract-global-wallet",
    name: "Abstract Global Wallet",
    source: "official",
    package: "abstract-foundation",
    description: "AGW is Abstract's cross-application smart contract wallet. Email, social login or passkey authentication, session keys, and gas sponsorship support.",
    category: "AGW",
    tags: ["wallet", "auth"],
    author: "Abstract Foundation",
    verified: true,
    version: "1.0.0",
    network: ["mainnet", "testnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Email / social / passkey wallet login",
      "Cross-application wallet identity",
      "Gasless transactions via session keys",
      "Gas sponsorship (paymaster) support",
      "React integration via useLoginWithAbstract hook",
    ],
    installCmd: AF_INSTALL,
    skillMd: `# Abstract Global Wallet

AGW is Abstract's cross-application smart contract wallet enabling users to authenticate via email, social login, or passkeys across all Abstract applications.

## Install

\`\`\`bash
npm install @abstract-foundation/agw-react @abstract-foundation/agw-client wagmi viem@2.x @tanstack/react-query
\`\`\`

## Quick Start

\`\`\`tsx
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractTestnet } from "viem/chains";

<AbstractWalletProvider chain={abstractTestnet}>
  <App />
</AbstractWalletProvider>
\`\`\`

## Hooks

- \`useLoginWithAbstract()\` — login / logout
- \`useAbstractClient()\` — send transactions
- \`useWriteContractSponsored()\` — gasless contract calls

## When to Use AGW

- New Abstract applications
- Cross-app wallet identity
- Email / social authentication
- Session key functionality
- Gas sponsorship features

## Critical Notes

- **viem 2.x required** — version 1.x causes compatibility errors
- Session keys on mainnet need security review; testnet is permissionless
- Never store session key signers in localStorage
`,
    github: "https://github.com/Abstract-Foundation/abstract-skills/tree/main/skills/abstract-global-wallet",
    updatedAt: "2026-04-01",
  },

  {
    id: "connecting-to-abstract",
    name: "Connecting to Abstract",
    source: "official",
    package: "abstract-foundation",
    description: "RPC, chain ID, WebSocket and explorer URL configuration for Abstract L2. Direct import support from viem/chains.",
    category: "Dev Tools",
    tags: ["deploy", "read"],
    author: "Abstract Foundation",
    verified: true,
    version: "1.0.0",
    network: ["mainnet", "testnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Mainnet and testnet RPC endpoint configuration",
      "Ready-made chain config via viem/chains",
      "WebSocket connection support",
      "Abscan block explorer integration",
      "Testnet ETH faucet guidance",
    ],
    installCmd: AF_INSTALL,
    skillMd: `# Connecting to Abstract

Abstract is a Layer 2 ZK rollup on Ethereum (ZK Stack).

## Network Configuration

| Property | Mainnet | Testnet |
|----------|---------|---------|
| Chain ID | \`2741\` | \`11124\` |
| RPC | \`https://api.mainnet.abs.xyz\` | \`https://api.testnet.abs.xyz\` |
| WebSocket | \`wss://api.mainnet.abs.xyz/ws\` | \`wss://api.testnet.abs.xyz/ws\` |
| Block explorer | \`https://abscan.org\` | \`https://sepolia.abscan.org\` |
| Verify API | \`https://api.abscan.org/api\` | \`https://api-sepolia.abscan.org/api\` |
| Block time | ~200ms | ~100ms |
| Currency | ETH | ETH |

## Viem

\`\`\`ts
import { abstract, abstractTestnet } from "viem/chains";
\`\`\`

Both chains are exported from \`viem/chains\` — no manual config needed.

## Testnet ETH

Get from faucets or bridge from Sepolia. See [Faucets](https://docs.abs.xyz/tooling/faucets).

## Deployed Contracts

WETH, USDC, USDT, Uniswap, Safe, Seaport, ERC-8004 registries — see \`references/deployed-contracts.md\`.
`,
    github: "https://github.com/Abstract-Foundation/abstract-skills/tree/main/skills/connecting-to-abstract",
    updatedAt: "2026-04-01",
  },

  {
    id: "deploying-contracts-on-abstract",
    name: "Deploying Contracts",
    source: "official",
    package: "abstract-foundation",
    description: "Deploy smart contracts to Abstract L2 using Foundry or Hardhat. ZK Stack zksolc compiler, verification, and testing.",
    category: "Smart Contracts",
    tags: ["deploy"],
    author: "Abstract Foundation",
    verified: true,
    version: "1.0.0",
    network: ["mainnet", "testnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Foundry-ZKSync installation and configuration",
      "Contract compilation with zksolc compiler",
      "Deploy to mainnet and testnet",
      "Automatic verification on Abscan",
      "ZK-native testing with forge test --zksync",
    ],
    installCmd: AF_INSTALL,
    skillMd: `# Deploying Contracts on Abstract

Abstract uses the ZK Stack VM — compilation requires \`zksolc\` (not standard \`solc\`).

## Install Foundry-ZKSync

\`\`\`bash
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
foundryup-zksync
forge init my-abstract-project
\`\`\`

## foundry.toml

\`\`\`toml
[profile.default]
src = 'src'
libs = ['lib']
fallback_oz = true
is_system = false
mode = "3"

[etherscan]
abstractTestnet = { chain = "11124", url = "https://api-sepolia.abscan.org/api", key = "\${ABSCAN_API_KEY}" }
abstractMainnet  = { chain = "2741",  url = "https://api.abscan.org/api",         key = "\${ABSCAN_API_KEY}" }
\`\`\`

## Compile

\`\`\`bash
forge build --zksync   # artifacts → zkout/
\`\`\`

## Deploy + Verify (Testnet)

\`\`\`bash
forge create src/Counter.sol:Counter \\
  --account myKeystore \\
  --rpc-url https://api.testnet.abs.xyz \\
  --chain 11124 --zksync --verify \\
  --verifier-url https://api-sepolia.abscan.org/api \\
  --etherscan-api-key \${ABSCAN_API_KEY}
\`\`\`

## Deploy + Verify (Mainnet)

\`\`\`bash
forge create src/Counter.sol:Counter \\
  --account myKeystore \\
  --rpc-url https://api.mainnet.abs.xyz \\
  --chain 2741 --zksync --verify \\
  --verifier-url https://api.abscan.org/api \\
  --etherscan-api-key \${ABSCAN_API_KEY}
\`\`\`

## Critical Gotchas

- **All forge commands need \`--zksync\`**
- Artifacts go to \`zkout/\` not \`out/\`
- Cheatcodes only at root test level on ZK VM
- Abscan API key required (abscan.org)
`,
    github: "https://github.com/Abstract-Foundation/abstract-skills/tree/main/skills/deploying-contracts-on-abstract",
    updatedAt: "2026-04-01",
  },

  {
    id: "erc8004-on-abstract",
    name: "ERC-8004 Agent Identity",
    source: "official",
    package: "abstract-foundation",
    description: "Give AI agents onchain identity and reputation. Register, give feedback and discover agents via IdentityRegistry and ReputationRegistry.",
    category: "Dev Tools",
    tags: ["auth", "write", "read"],
    author: "Abstract Foundation",
    verified: true,
    version: "1.0.0",
    network: ["mainnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Register an agent as an ERC-721 NFT onchain",
      "Give and read reputation feedback",
      "Compute scores filtered by trusted reviewers",
      "Manage agent metadata URI",
      "Agent discovery via ERC-721 enumeration",
    ],
    installCmd: AF_INSTALL,
    skillMd: `# ERC-8004 on Abstract

ERC-8004 gives AI agents onchain identity and reputation. Agents mint an NFT identity, publish a metadata URI, and accumulate reputation feedback.

## Contract Addresses (Mainnet)

| Contract | Address |
|----------|---------|
| IdentityRegistry | \`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432\` |
| ReputationRegistry | \`0x8004BAa17C55a88189AE136b182e5fdA19dE9b63\` |

## Register an Agent

\`\`\`typescript
const agentId = await client.writeContract({
  address: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  abi: [{ name: "register", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "agentURI", type: "string" }],
    outputs: [{ name: "agentId", type: "uint256" }] }],
  functionName: "register",
  args: ["https://your-agent.com/agent.json"],
});
\`\`\`

## Check Reputation

\`\`\`typescript
const [count, summaryValue] = await client.readContract({
  address: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63",
  functionName: "getSummary",
  args: [agentId, [], "starred", ""],
});
\`\`\`

## Common Feedback Tags

| tag1 | Measures | Example |
|------|----------|---------|
| \`starred\` | Quality (0-100) | \`87\` |
| \`uptime\` | Uptime % | \`9977\` (99.77%) |
| \`responseTime\` | Latency ms | \`560\` |

## Gotchas

- IdentityRegistry is ERC-721 — each agent is an NFT
- Cannot give feedback to your own agent
- Pass trusted \`clientAddresses\` to filter Sybil spam
`,
    github: "https://github.com/Abstract-Foundation/abstract-skills/tree/main/skills/erc8004-on-abstract",
    updatedAt: "2026-04-01",
  },

  {
    id: "myriad-on-abstract",
    name: "Myriad Protocol",
    source: "official",
    package: "abstract-foundation",
    description: "Myriad prediction market protocol on Abstract. Trade outcomes, fetch price and portfolio data, and claim winnings.",
    category: "DeFi",
    tags: ["defi", "read", "write"],
    author: "Abstract Foundation",
    verified: true,
    version: "1.0.0",
    network: ["mainnet", "testnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Query prediction market data and prices",
      "Open and close trades via polkamarkets-js SDK",
      "Track portfolio and positions",
      "Claim winnings from resolved markets",
      "Builder revenue sharing via referralBuy",
    ],
    installCmd: AF_INSTALL,
    skillMd: `# Myriad on Abstract

Myriad is a prediction market protocol on Abstract. AI agents can query market data, trade outcomes, and claim winnings.

## Install

\`\`\`bash
npm install polkamarkets-js
\`\`\`

## Quick Start

\`\`\`typescript
import { PolkamarketsService } from "polkamarkets-js";

const service = new PolkamarketsService({ networkId: 2741 });

const markets = await service.getMarkets();
const quote   = await service.getBuyQuote({ marketId, outcomeId, value });
const tx      = await service.buy({ marketId, outcomeId, value, minOutcomeTokensToBuy });
\`\`\`

## Notes

- Pair with \`abstract-global-wallet\` skill for wallet integration
- Use \`referralBuy\` for builder revenue sharing
- Combine with \`agw-mcp\` for full agent trading flows
`,
    github: "https://github.com/Abstract-Foundation/abstract-skills/tree/main/skills/myriad-on-abstract",
    updatedAt: "2026-04-01",
  },

  {
    id: "safe-multisig-on-abstract",
    name: "Safe Multisig",
    source: "official",
    package: "abstract-foundation",
    description: "Create and manage Safe multi-sig wallets on Abstract. Programmatic Safe deploy, owner management, and multisig transactions via Protocol Kit.",
    category: "Dev Tools",
    tags: ["wallet", "deploy", "write"],
    author: "Abstract Foundation",
    verified: true,
    version: "1.0.0",
    network: ["mainnet", "testnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Deploy Safe multisig wallets",
      "Configure owner addresses and threshold",
      "Programmatic Safe management via Protocol Kit",
      "Onchain signature coordination",
      "safe.abs.xyz web UI integration",
    ],
    installCmd: AF_INSTALL,
    skillMd: `# Safe Multisig on Abstract

Safe is a multi-signature wallet solution for Abstract. Web interface: [safe.abs.xyz](https://safe.abs.xyz/)

## Contract Addresses (Mainnet & Testnet)

| Contract | Address |
|----------|---------|
| Safe | \`0xC35F063962328aC65cED5D4c3fC5dEf8dec68dFa\` |
| SafeL2 *(recommended)* | \`0x610fcA2e0279Fa1F8C00c8c2F71dF522AD469380\` |
| SafeProxyFactory | \`0xc329D02fd8CB2fc13aa919005aF46320794a8629\` |

Use **SafeL2** on Abstract — reduced gas via event-based indexing.

## SDK

\`\`\`bash
npm install @safe-global/protocol-kit
\`\`\`

\`\`\`typescript
import Safe, { SafeFactory } from "@safe-global/protocol-kit";

const safeFactory = await SafeFactory.create({ ethAdapter });
const safeSdk = await safeFactory.deploySafe({
  safeAccountConfig: { owners: ["0xA", "0xB"], threshold: 2 },
});
\`\`\`

## Important Limitation

Safe Transaction Service API is **not supported** on Abstract. Options:
1. Web UI at [safe.abs.xyz](https://safe.abs.xyz/)
2. Onchain signing via Protocol Kit
3. Custom backend for signature coordination
`,
    github: "https://github.com/Abstract-Foundation/abstract-skills/tree/main/skills/safe-multisig-on-abstract",
    updatedAt: "2026-04-01",
  },

  {
    id: "using-agw-mcp",
    name: "AGW MCP Server",
    source: "official",
    package: "abstract-foundation",
    description: "Read Abstract chain data and wallet operations via Model Context Protocol. Directly integrate AI agents with Abstract.",
    category: "AGW",
    tags: ["wallet", "read"],
    author: "Abstract Foundation",
    verified: true,
    version: "1.0.0",
    network: ["mainnet", "testnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Read Abstract chain data via MCP",
      "Query balances and transactions",
      "Works with Claude, agent frameworks, and MCP clients",
      "Write capabilities (coming soon)",
      "Combined trading flows with myriad-on-abstract",
    ],
    installCmd: AF_INSTALL,
    skillMd: `# Using AGW MCP

agw-mcp enables AI agents to interact with Abstract via the Model Context Protocol (MCP).

## Status (v1)

- ✅ Read access to Abstract chain data
- ✅ Balance and transaction queries
- 🔜 Write / transactions (in development)

## MCP Config

\`\`\`json
{
  "mcpServers": {
    "agw-mcp": {
      "command": "npx",
      "args": ["-y", "@abstract-foundation/agw-mcp"],
      "env": { "ABSTRACT_NETWORK": "mainnet" }
    }
  }
}
\`\`\`

## When to Use

| Use Case | Tool |
|----------|------|
| AI agent needs wallet ops on Abstract | agw-mcp |
| User-facing React app | abstract-global-wallet skill |
| Agent + Myriad trading | agw-mcp + myriad-on-abstract |

## Pair With

- \`connecting-to-abstract\` — network config
- \`abstract-global-wallet\` — AGW architecture
- \`myriad-on-abstract\` — prediction markets
`,
    github: "https://github.com/Abstract-Foundation/abstract-skills/tree/main/skills/using-agw-mcp",
    updatedAt: "2026-04-01",
  },

  // ─────────────────────────────────────────────────────────────────
  // Gigaverse Games
  // ─────────────────────────────────────────────────────────────────
  {
    id: "gigaverse-play",
    name: "Gigaverse Play",
    source: "official",
    package: "gigaverse-games",
    description: "Rogue-lite dungeon crawler on Abstract blockchain. AI agents quest through procedurally generated dungeons, battle enemies with Sword/Shield/Spell combat, and loot rewards.",
    category: "NFT & Gaming",
    tags: ["gaming", "wallet", "transaction"],
    author: "Gigaverse Games",
    verified: true,
    version: "1.0.0",
    network: ["mainnet"],
    hasExamples: true,
    hasDocs: true,
    capabilities: [
      "Autonomous or interactive dungeon crawling",
      "Rock-paper-scissors combat (Sword / Shield / Spell)",
      "Energy and GigaJuice resource management",
      "Loot selection and permanent inventory",
      "XP farming and stat-based level-up system",
    ],
    installCmd: GV_INSTALL,
    skillMd: `# Gigaverse

Rogue-lite dungeon crawler on Abstract (Chain ID: 2741) for AI agents.

## Install

\`\`\`bash
npx skills add gigaverse-games/play
\`\`\`

## Setup

\`\`\`bash
./scripts/setup.sh   # wallet generation/import, play mode, combat strategy
./scripts/auth.sh    # SIWE sign → JWT token for API access
\`\`\`

## Core Gameplay Loop

1. Check energy (40 per standard run)
2. Level up if XP (Dungeon Scrap) allows
3. Start a dungeon run
4. Combat each room: Sword / Shield / Spell
5. Select loot rewards after each victory

## Combat

| Move | Action | Beats |
|------|--------|-------|
| Sword | \`rock\` | Spell |
| Shield | \`paper\` | Sword |
| Spell | \`scissor\` | Shield |

## Energy

| Type | Regen/hr | Max | Multiplier |
|------|----------|-----|-----------|
| Standard | 10 | 240 | 1x |
| GigaJuice | 17.5 | 420 | 3x |

## Action Token

Every API response returns a new action token required for the next call. Tokens expire in ~5 seconds.

## Play Modes

- **Autonomous** — agent decides everything
- **Interactive** — agent requests approval at decision points

## HEARTBEAT

Poll every 30 min: check energy → notify when full. Check XP → auto level-up (autonomous) or notify (interactive).

## Security

> Your private key controls ALL funds. NEVER share it, commit to git, or expose in logs/chat.
`,
    github: "https://github.com/Gigaverse-Games/play",
    updatedAt: "2026-04-06",
  },
];

export const CATEGORIES = [
  "AGW",
  "Smart Contracts",
  "DeFi",
  "NFT & Gaming",
  "Data & Oracles",
  "Dev Tools",
  "Consumer Apps",
] as const;

export const STATS = {
  totalSkills: skills.length,
  verifiedSkills: skills.filter((s) => s.verified).length,
  categories: [...new Set(skills.map((s) => s.category))].length,
  contributors: 1,
};
