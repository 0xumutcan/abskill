export type SkillCategory =
  | "AGW"
  | "Smart Contracts"
  | "DeFi"
  | "NFT & Gaming"
  | "Data & Oracles"
  | "Dev Tools"
  | "Consumer Apps";

export type SkillTag =
  | "wallet"
  | "transaction"
  | "token"
  | "nft"
  | "defi"
  | "swap"
  | "bridge"
  | "oracle"
  | "deploy"
  | "read"
  | "write"
  | "auth"
  | "gaming";

export type SkillSource = "official" | "community";

export type PackageType = "indexed" | "linked";

export interface SkillPackage {
  id: string;
  label: string;
  logo?: string;
  type: PackageType;
  url?: string;
}

export interface Skill {
  id: string;
  name: string;
  source: SkillSource;
  package: string;
  description: string;
  category: SkillCategory;
  tags: SkillTag[];
  author: string;
  verified: boolean;
  version: string;
  network: ("mainnet" | "testnet")[];
  hasExamples: boolean;
  hasDocs: boolean;
  capabilities: string[];
  installCmd: string;  // real cmd from GitHub, or "Read and install this skill: <url>"
  skillMd: string;     // raw skill.md content
  github?: string;
  updatedAt: string;
}
