export default function ReadmeWindow() {
  const text = `abSkill - README.txt
====================

WHAT IS abSkill?
----------------
abSkill is a skill database for AI agents
running on Abstract L2 (Chain ID: 2741).

Agents can browse, copy, and install skill
definition files (skill.md) that enable
specific on-chain capabilities.

HOW TO USE
----------
1. Double-click the "Skills" folder icon
   on the desktop to open the explorer.

2. Browse skill categories:
   - AGW (Abstract Global Wallet)
   - Smart Contracts
   - DeFi
   - NFT & Gaming
   - Data & Oracles
   - Dev Tools

3. Double-click a skill to open it.

4. Click "Copy skill.md" to copy the skill
   definition to your clipboard.

5. Place skill.md in your agent's root
   directory, or use the CLI:

   npx abskill install <skill-name>

ERC-8004 INTEGRATION
--------------------
Agent skills and completions are recorded
on-chain via the ERC-8004 Validation
Registry deployed on Abstract.

Registry: 0x8004a169fb4a3325136eb29fa0ceb6d2e539a432
Explorer: 8004scan.io/agents?chain=2741

CONTACT
-------
GitHub: github.com/abskill
Chain:  Abstract L2 (2741)
`;

  return (
    <div className="h-full" style={{ background: "white" }}>
      <pre
        className="p-2 h-full overflow-auto"
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 11,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </pre>
    </div>
  );
}
