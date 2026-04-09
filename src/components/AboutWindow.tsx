export default function AboutWindow() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-4" style={{ background: "var(--win-silver)" }}>
      <div style={{ fontSize: 48 }}>🤖</div>
      <div className="text-center">
        <div className="font-bold" style={{ fontSize: 14 }}>abSkill</div>
        <div style={{ fontSize: 11, color: "var(--win-darker)" }}>Version 1.0.0</div>
      </div>
      <div className="sunken p-3 text-center" style={{ background: "white", fontSize: 11, maxWidth: 280 }}>
        The skill database for AI agents running on Abstract L2.
        Browse, copy, and install skills for your agent.
      </div>
      <div style={{ fontSize: 11, color: "var(--win-darker)" }}>
        © 2026 abSkill. Abstract L2 (Chain 2741)
      </div>
      <div className="raised px-2 py-0.5 text-xs" style={{ background: "var(--win-silver)", fontSize: 11 }}>
        ERC-8004 Registry: 0x8004a169...9432
      </div>
    </div>
  );
}
