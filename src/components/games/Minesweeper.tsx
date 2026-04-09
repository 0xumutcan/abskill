"use client";

import { useState, useEffect, useCallback } from "react";

const ROWS = 9, COLS = 9, MINES = 10;

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; count: number };
type Status = "idle" | "playing" | "won" | "lost";

function createBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
  );
}

function placeMines(board: Cell[][], firstR: number, firstC: number): Cell[][] {
  const b = board.map(r => r.map(c => ({ ...c })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!b[r][c].mine && !(r === firstR && c === firstC)) {
      b[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!b[r][c].mine) {
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].mine) cnt++;
          }
        b[r][c].count = cnt;
      }
    }
  }
  return b;
}

function reveal(board: Cell[][], r: number, c: number): Cell[][] {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return board;
  if (board[r][c].revealed || board[r][c].flagged) return board;
  const b = board.map(row => row.map(cell => ({ ...cell })));
  b[r][c].revealed = true;
  if (b[r][c].count === 0 && !b[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++)
        if (dr !== 0 || dc !== 0) {
          const nb = reveal(b, r + dr, c + dc);
          for (let i = 0; i < ROWS; i++)
            for (let j = 0; j < COLS; j++)
              b[i][j] = nb[i][j];
        }
  }
  return b;
}

const NUM_COLORS = ["", "#0000ff", "#007b00", "#ff0000", "#00007b", "#7b0000", "#007b7b", "#000000", "#7b7b7b"];

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(createBoard());
  const [status, setStatus] = useState<Status>("idle");
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (status !== "playing") return;
    const t = setInterval(() => setTime(s => Math.min(s + 1, 999)), 1000);
    return () => clearInterval(t);
  }, [status]);

  const reset = () => { setBoard(createBoard()); setStatus("idle"); setFlags(0); setTime(0); };

  const handleClick = useCallback((r: number, c: number) => {
    if (status === "won" || status === "lost") return;
    setBoard(prev => {
      if (prev[r][c].flagged || prev[r][c].revealed) return prev;
      let b = prev;
      if (status === "idle") {
        b = placeMines(prev, r, c);
        setStatus("playing");
      }
      if (b[r][c].mine) {
        const nb = b.map(row => row.map(cell => ({ ...cell, revealed: cell.mine ? true : cell.revealed })));
        setStatus("lost");
        return nb;
      }
      const nb = reveal(b, r, c);
      const won = nb.every(row => row.every(cell => cell.mine || cell.revealed));
      if (won) setStatus("won");
      return nb;
    });
  }, [status]);

  const handleFlag = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === "won" || status === "lost" || board[r][c].revealed) return;
    setBoard(prev => {
      const nb = prev.map(row => row.map(cell => ({ ...cell })));
      nb[r][c].flagged = !nb[r][c].flagged;
      setFlags(f => nb[r][c].flagged ? f + 1 : f - 1);
      return nb;
    });
  }, [status, board]);

  const face = status === "won" ? "😎" : status === "lost" ? "😵" : "🙂";

  return (
    <div className="flex flex-col h-full items-center" style={{ background: "var(--win-silver)", padding: 6, gap: 6 }}>
      {/* Header */}
      <div className="raised flex items-center justify-between w-full px-3 py-1" style={{ background: "var(--win-silver)" }}>
        <div className="sunken px-2 py-0.5 font-mono font-bold" style={{ background: "#000", color: "#f00", fontSize: 20, minWidth: 44, textAlign: "right", letterSpacing: 2 }}>
          {String(MINES - flags).padStart(3, "0")}
        </div>
        <button className="raised" style={{ width: 28, height: 28, fontSize: 16, background: "var(--win-silver)" }} onClick={reset}>
          {face}
        </button>
        <div className="sunken px-2 py-0.5 font-mono font-bold" style={{ background: "#000", color: "#f00", fontSize: 20, minWidth: 44, textAlign: "right", letterSpacing: 2 }}>
          {String(time).padStart(3, "0")}
        </div>
      </div>

      {/* Board */}
      <div className="sunken" style={{ background: "var(--win-silver)", display: "inline-block" }}>
        {board.map((row, r) => (
          <div key={r} style={{ display: "flex" }}>
            {row.map((cell, c) => {
              const isLostMine = status === "lost" && cell.mine && !cell.flagged;
              const isWrongFlag = status === "lost" && cell.flagged && !cell.mine;
              return (
                <button
                  key={c}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={(e) => handleFlag(e, r, c)}
                  style={{
                    width: 20, height: 20,
                    fontSize: 11,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: cell.revealed ? "var(--win-silver)" : "var(--win-silver)",
                    border: cell.revealed
                      ? "1px solid var(--win-dark)"
                      : "2px solid",
                    borderColor: cell.revealed
                      ? "var(--win-dark)"
                      : "var(--win-white) var(--win-darker) var(--win-darker) var(--win-white)",
                    color: cell.revealed && !cell.mine ? NUM_COLORS[cell.count] : undefined,
                    fontWeight: "bold",
                    cursor: "default",
                    backgroundColor: isLostMine ? "#f00" : cell.revealed ? "#c0c0c0" : "var(--win-silver)",
                  }}
                >
                  {cell.flagged && !cell.revealed ? "🚩" :
                   isWrongFlag ? "❌" :
                   isLostMine || (cell.revealed && cell.mine) ? "💣" :
                   cell.revealed && cell.count > 0 ? cell.count :
                   ""}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {status === "won" && <div style={{ color: "#007b00", fontSize: 12, fontWeight: "bold" }}>You Win! 🎉</div>}
      {status === "lost" && <div style={{ color: "#f00", fontSize: 12, fontWeight: "bold" }}>Game Over!</div>}
    </div>
  );
}
