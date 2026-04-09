import { MCPServer, MCPProvider } from "@/types/mcp";

export const MCP_PROVIDERS: MCPProvider[] = [
  {
    id: "abstract-foundation",
    label: "Abstract Foundation",
    logo: "/aflogo.webp",
  },
  {
    id: "witty-game",
    label: "Witty Game",
    logo: "/witty.webp",
  },
];

export const mcpServers: MCPServer[] = [
  {
    id: "agw-cli",
    name: "AGW CLI",
    provider: "abstract-foundation",
    description: "Agent-first CLI for Abstract Global Wallet with a built-in MCP server. Enables AI agents to view balances, send transactions, interact with Abstract apps, and deploy contracts — all without exposing private keys. Uses session-key auth via Privy TEE.",
    version: "0.1.0",
    verified: true,
    tools: [
      { name: "wallet address",        description: "Get the connected wallet address" },
      { name: "wallet balances",        description: "Read native ETH and ERC-20 token balances" },
      { name: "wallet tokens list",     description: "Paginated token inventory with values" },
      { name: "tx preview",             description: "Simulate a transaction before sending" },
      { name: "tx send",                description: "Send a transaction (requires --execute after --dry-run)" },
      { name: "tx transfer-token",      description: "Transfer ERC-20 tokens to an address" },
      { name: "tx sign-message",        description: "Sign an arbitrary message" },
      { name: "tx sign-transaction",    description: "Sign a raw transaction" },
      { name: "tx calls",               description: "Batch multiple contract calls" },
      { name: "contract write",         description: "Call a state-changing contract function" },
      { name: "contract deploy",        description: "Deploy a smart contract" },
      { name: "auth init",              description: "Bootstrap session-key auth via companion app" },
      { name: "auth revoke",            description: "Revoke the agent signer" },
      { name: "session status",         description: "Inspect current session state and readiness" },
      { name: "session doctor",         description: "Troubleshoot session configuration issues" },
      { name: "app list",               description: "Discover apps deployed on Abstract" },
      { name: "app show",               description: "Get details for a specific Abstract app" },
      { name: "portal streams list",    description: "Browse Portal content streams" },
      { name: "portal user-profile get","description": "Fetch a user profile from Abstract Portal" },
      { name: "schema list",            description: "List available command schemas" },
      { name: "schema get",             description: "Get machine-readable schema for a command" },
    ],
    configJson: `{
  "mcpServers": {
    "agw-cli": {
      "command": "npx",
      "args": [
        "-y",
        "@abstract-foundation/agw-cli",
        "mcp",
        "serve",
        "--sanitize", "strict"
      ]
    }
  }
}`,
    installCmd: "npm install -g @abstract-foundation/agw-cli",
    github: "https://github.com/Abstract-Foundation/agw-cli",
    docs: "https://docs.abs.xyz/build-on-abstract/ai-integration/agw-cli",
    logo: "/aflogo.webp",
    updatedAt: "2026-04-01",
  },
  {
    id: "lingo",
    name: "Lingo",
    provider: "witty-game",
    description: "On-chain Wordle dueling game on Abstract Chain. AI agents can play practice games against the bot, challenge other players to ETH-wagered duels (casual / shrimp / whale tiers), manage stickers & achievements, track the leaderboard, and handle referrals — all via MCP. Auth-free tools include the leaderboard, jackpot pool, and sticker list. User-specific actions require a Bearer token.",
    version: "1.0.0",
    verified: true,
    tools: [
      // Practice
      { name: "lingo_practice_start",    description: "Start a new practice game against the bot (bot solves on turn 4, up to 6 guesses)" },
      { name: "lingo_practice_guess",    description: "Submit a 5-letter guess in a practice game — returns green/yellow/gray tile feedback" },
      { name: "lingo_practice_status",   description: "Get the current state of a practice session including all guesses so far" },
      { name: "lingo_practice_history",  description: "Get paginated practice game history" },
      // Duel
      { name: "lingo_duel_create",       description: "Create or join an ETH-wagered duel (casual 0.001 ETH / shrimp 0.01 / whale 0.1). Supports private rooms via invite code" },
      { name: "lingo_duel_guess",        description: "Submit a 5-letter guess in a duel match — can guess immediately even before opponent joins" },
      { name: "lingo_duel_status",       description: "Get duel match state — includes withdrawal signature when you win for on-chain ETH claim" },
      { name: "lingo_duel_waiting",      description: "List public duel matches waiting for an opponent in a specific tier" },
      { name: "lingo_duel_invite_lookup","description": "Look up a private duel room by 6-letter invite code" },
      { name: "lingo_duel_history",      description: "Get paginated duel match history with results and stats" },
      { name: "lingo_duel_force_complete","description": "Force-complete a duel that has been stuck for 3+ days" },
      // Player
      { name: "lingo_player_stats",      description: "Get your full stats: wins, losses, ETH won/lost, LP, rank, gems, win streak" },
      { name: "lingo_player_profile",    description: "Get a player's profile and recent match history (omit player_id for your own)" },
      { name: "lingo_set_nickname",      description: "Set or change your nickname (2–14 chars, alphanumeric + underscore; first free, then 100 gems)" },
      { name: "lingo_set_pfp",           description: "Set an owned sticker as your profile picture" },
      // Stickers & Achievements
      { name: "lingo_my_stickers",       description: "List all stickers you own with counts and levels" },
      { name: "lingo_all_stickers",      description: "List all stickers in the game — no auth required" },
      { name: "lingo_sticker_confirm",   description: "Sync/confirm sticker count" },
      { name: "lingo_upgrade_sticker",   description: "Upgrade a sticker by consuming lower-level duplicates (Lv2 = 10 value, Lv3 = 100 value)" },
      { name: "lingo_achievements",      description: "List all achievements with unlock and claim status" },
      { name: "lingo_claim_achievement", description: "Claim gem reward for an unlocked achievement" },
      { name: "lingo_purchase_hints",    description: "Unlock hints permanently for 100 gems (one-time purchase)" },
      { name: "lingo_purchase_sticker_pack", description: "Buy a random sticker pack for 200 gems" },
      // Leaderboard & Check-in
      { name: "lingo_leaderboard",       description: "Get LP leaderboard rankings — no auth required" },
      { name: "lingo_checkin",           description: "Daily check-in to earn gems (streak bonus: up to 50 gems/day)" },
      { name: "lingo_upvote_claim",      description: "Claim 50 gem reward for voting for Lingo on-chain in a specific epoch" },
      // Referral & Jackpot
      { name: "lingo_jackpot_pool",      description: "Get the current jackpot pool — won by solving the word in 1 turn during a duel. No auth required" },
      { name: "lingo_jackpot_history",   description: "View history of jackpot winners — no auth required" },
      { name: "lingo_apply_referral",    description: "Apply a referral code to your account (one-time)" },
      { name: "lingo_referral_dashboard","description": "View your referral dashboard with earnings and referred players" },
      { name: "lingo_referral_withdraw", description: "Withdraw accumulated referral earnings" },
      { name: "lingo_referral_withdrawals", description: "View referral withdrawal history for a specific referral code" },
    ],
    configJson: `{
  "mcpServers": {
    "lingo": {
      "type": "http",
      "url": "https://api.lingo.witty.game/mcp"
    }
  }
}`,
    logo: "/witty.webp",
    docs: "https://mania.bearish.af",
    updatedAt: "2026-04-09",
  },
];

export const MCP_STATS = {
  total: mcpServers.length,
  verified: mcpServers.filter((s) => s.verified).length,
  providers: MCP_PROVIDERS.length,
};
