export type ReadingType = "article" | "doc" | "video" | "book";

export interface Reading {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ReadingType;
  tag?: string;
}

export const READINGS: Reading[] = [
  {
    id: "peer-to-agent",
    title: "From Peer-to-Peer to Agent-to-Agent",
    description: "Agentic commerce is inevitable — not a question of if, but how. A new era is upon us where AI agents transact, negotiate, and operate autonomously on our behalf.",
    url: "https://x.com/legogigabrain/status/2038638699164893379",
    type: "article",
  },
  {
    id: "thin-harness-fat-skills",
    title: "Thin Harness, Fat Skills",
    description: "The 100x engineers aren't using better models. They're using the same models — just with better architecture. The difference fits on an index card.",
    url: "https://x.com/garrytan/status/2042925773300908103",
    type: "article",
    tag: "Garry Tan",
  },
  {
    id: "x402-micropayments",
    title: "The Micropayments Breakthrough",
    description: "Coinbase contributed x402 to the Linux Foundation, making it a neutral internet standard. x402 lets AI agents pay for services mid-task, settling instantly with stablecoins — no API keys, no subscriptions, no human approval.",
    url: "https://x.com/davewardonline/status/2040868292655456725",
    type: "article",
  },
];
