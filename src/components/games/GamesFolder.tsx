"use client";

import { WindowType } from "../useWindows";

const GAMES = [
  { id: "minesweeper" as WindowType, label: "Minesweeper", icon: "💣" },
  { id: "hangman"     as WindowType, label: "Hangman",     icon: "🪢" },
  { id: "solitaire"   as WindowType, label: "Solitaire",   icon: "🃏" },
];

interface Props {
  onOpen: (type: WindowType) => void;
}

export default function GamesFolder({ onOpen }: Props) {
  return (
    <div className="flex flex-col h-full" style={{ background: "var(--win-silver)" }}>
      {/* address bar */}
      <div className="flex items-center gap-1 px-2 py-0.5 border-b" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
        <span style={{ color: "var(--win-darker)" }}>Address:</span>
        <div className="flex-1 sunken px-1 py-0.5" style={{ background: "white" }}>C:\abSkill\Games</div>
      </div>

      {/* icons */}
      <div className="flex-1 overflow-auto sunken p-4" style={{ background: "white", margin: 4 }}>
        <div className="flex gap-8 p-2">
          {GAMES.map((g) => (
            <div
              key={g.id}
              className="flex flex-col items-center gap-1 p-2 cursor-default"
              style={{ width: 80 }}
              onDoubleClick={() => onOpen(g.id)}
            >
              <span style={{ fontSize: 40 }}>{g.icon}</span>
              <span style={{ fontSize: 11 }}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-2 py-0.5 border-t sunken" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
        3 object(s)
      </div>
    </div>
  );
}
