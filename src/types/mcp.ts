export interface MCPTool {
  name: string;
  description: string;
}

export interface MCPServer {
  id: string;
  name: string;
  provider: string;       // maps to a provider id
  description: string;
  version: string;
  verified: boolean;
  tools: MCPTool[];
  configJson: string;     // ready-to-paste mcpServers JSON block
  installCmd?: string;
  github?: string;
  docs?: string;
  logo?: string;
  updatedAt: string;
}

export interface MCPProvider {
  id: string;
  label: string;
  logo?: string;
}
