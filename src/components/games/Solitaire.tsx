"use client";

import { useState, useCallback } from "react";

type Suit = "♠" | "♥" | "♦" | "♣";
interface Card { suit: Suit; rank: number; faceUp: boolean }
interface Selection { from: "waste" | "tableau"; col: number; idx: number }

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RED: Suit[] = ["♥", "♦"];
const RANK_LABEL = ["","A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const CW = 60, CH = 84, VGAP = 20, VGAP_HIDDEN = 12;

const isRed = (s: Suit) => RED.includes(s);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(): Card[] {
  return shuffle(SUITS.flatMap(suit =>
    Array.from({ length: 13 }, (_, i) => ({ suit, rank: i + 1, faceUp: false }))
  ));
}

interface State {
  tableau: Card[][];
  foundation: Card[][];
  stock: Card[];
  waste: Card[];
  sel: Selection | null;
}

function deal(): State {
  const deck = makeDeck();
  let i = 0;
  const tableau: Card[][] = Array.from({ length: 7 }, (_, col) =>
    Array.from({ length: col + 1 }, (__, row) => ({ ...deck[i++], faceUp: row === col }))
  );
  return {
    tableau,
    foundation: [[], [], [], []],
    stock: deck.slice(i).map(c => ({ ...c, faceUp: false })),
    waste: [],
    sel: null,
  };
}

function canStack(card: Card, onto: Card[]): boolean {
  if (!onto.length) return card.rank === 13;
  const top = onto[onto.length - 1];
  return top.faceUp && isRed(card.suit) !== isRed(top.suit) && card.rank === top.rank - 1;
}

function canFoundation(card: Card, pile: Card[]): boolean {
  if (!pile.length) return card.rank === 1;
  const top = pile[pile.length - 1];
  return card.suit === top.suit && card.rank === top.rank + 1;
}

function flipTop(col: Card[]): Card[] {
  if (!col.length) return col;
  const res = [...col];
  if (!res[res.length - 1].faceUp)
    res[res.length - 1] = { ...res[res.length - 1], faceUp: true };
  return res;
}

/* ── CardEl defined OUTSIDE Solitaire so React doesn't remount it ── */
interface CardElProps {
  card: Card;
  selected?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}
function CardEl({ card, selected, style, onClick }: CardElProps) {
  const color = isRed(card.suit) ? "#cc0000" : "#000";
  return (
    <div
      onClick={onClick}
      style={{
        width: CW, height: CH,
        background: card.faceUp ? "#fff" : "#1a44aa",
        border: `2px solid ${selected ? "#000080" : "#808080"}`,
        outline: selected ? "2px solid #000080" : "none",
        borderRadius: 2,
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        padding: 3,
        flexShrink: 0,
        userSelect: "none",
        ...style,
      }}
    >
      {card.faceUp ? (
        <>
          <div style={{ fontSize: 11, fontWeight: "bold", color, lineHeight: 1 }}>
            {RANK_LABEL[card.rank]}{card.suit}
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color }}>
            {card.suit}
          </div>
          <div style={{ fontSize: 11, fontWeight: "bold", color, lineHeight: 1, transform: "rotate(180deg)", alignSelf: "flex-end" }}>
            {RANK_LABEL[card.rank]}{card.suit}
          </div>
        </>
      ) : (
        <div style={{
          flex: 1, borderRadius: 1,
          background: "repeating-linear-gradient(45deg,#1a44aa,#1a44aa 3px,#2255bb 3px,#2255bb 8px)",
        }} />
      )}
    </div>
  );
}

function EmptySlot({ onClick, label }: { onClick?: () => void; label?: string }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: CW, height: CH,
        border: "2px dashed rgba(255,255,255,0.3)",
        borderRadius: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.4)", fontSize: 20,
        cursor: "default", flexShrink: 0,
      }}
    >{label}</div>
  );
}
/* ─────────────────────────────────────────────────────────────── */

export default function Solitaire() {
  const [state, setState] = useState<State>(deal);

  const reset = useCallback(() => setState(deal()), []);

  const update = useCallback((fn: (s: State) => State) => setState(prev => fn(prev)), []);

  const clickStock = useCallback(() => update(s => {
    if (s.stock.length === 0)
      return { ...s, sel: null, stock: [...s.waste].reverse().map(c => ({ ...c, faceUp: false })), waste: [] };
    const card = { ...s.stock[s.stock.length - 1], faceUp: true };
    return { ...s, sel: null, stock: s.stock.slice(0, -1), waste: [...s.waste, card] };
  }), [update]);

  const clickWaste = useCallback(() => update(s => {
    if (!s.waste.length) return s;
    if (s.sel?.from === "waste") return { ...s, sel: null };
    return { ...s, sel: { from: "waste", col: -1, idx: s.waste.length - 1 } };
  }), [update]);

  const clickFoundation = useCallback((fi: number) => update(s => {
    if (!s.sel) return s;
    const cards = s.sel.from === "waste"
      ? [s.waste[s.waste.length - 1]]
      : s.tableau[s.sel.col].slice(s.sel.idx);
    if (cards.length === 1 && canFoundation(cards[0], s.foundation[fi])) {
      const foundation = s.foundation.map((p, i) => i === fi ? [...p, { ...cards[0], faceUp: true }] : p);
      if (s.sel.from === "waste")
        return { ...s, sel: null, waste: s.waste.slice(0, -1), foundation };
      const tableau = s.tableau.map((col, i) =>
        i === s.sel!.col ? flipTop(col.slice(0, s.sel!.idx)) : col
      );
      return { ...s, sel: null, tableau, foundation };
    }
    return { ...s, sel: null };
  }), [update]);

  const clickEmptyCol = useCallback((col: number) => update(s => {
    if (!s.sel) return s;
    const cards = s.sel.from === "waste"
      ? [s.waste[s.waste.length - 1]]
      : s.tableau[s.sel.col].slice(s.sel.idx);
    if (canStack(cards[0], [])) {
      const moved = cards.map(c => ({ ...c, faceUp: true }));
      const tableau = s.tableau.map((c, i) => {
        if (i === col) return [...c, ...moved];
        if (s.sel!.from === "tableau" && i === s.sel!.col)
          return flipTop(c.slice(0, s.sel!.idx));
        return c;
      });
      const waste = s.sel.from === "waste" ? s.waste.slice(0, -1) : s.waste;
      return { ...s, sel: null, tableau, waste };
    }
    return { ...s, sel: null };
  }), [update]);

  const clickTableau = useCallback((col: number, idx: number) => update(s => {
    const card = s.tableau[col][idx];
    if (!card.faceUp) return s;

    if (s.sel) {
      const cards = s.sel.from === "waste"
        ? [s.waste[s.waste.length - 1]]
        : s.tableau[s.sel.col].slice(s.sel.idx);

      if (canStack(cards[0], s.tableau[col])) {
        const moved = cards.map(c => ({ ...c, faceUp: true }));
        const tableau = s.tableau.map((c, i) => {
          if (i === col) return [...c, ...moved];
          if (s.sel!.from === "tableau" && i === s.sel!.col)
            return flipTop(c.slice(0, s.sel!.idx));
          return c;
        });
        const waste = s.sel.from === "waste" ? s.waste.slice(0, -1) : s.waste;
        return { ...s, sel: null, tableau, waste };
      }
      if (s.sel.from === "tableau" && s.sel.col === col && s.sel.idx === idx)
        return { ...s, sel: null };
    }

    return { ...s, sel: { from: "tableau", col, idx } };
  }), [update]);

  const { tableau, foundation, stock, waste, sel } = state;
  const won = foundation.every(p => p.length === 13);

  const isSel = (from: "waste" | "tableau", col: number, idx: number) =>
    !!sel && sel.from === from && (from === "waste" || sel.col === col) && idx >= sel.idx;

  return (
    <div style={{
      background: "#1e6b1e", height: "100%",
      display: "flex", flexDirection: "column", padding: 8, gap: 8,
      overflow: "hidden", fontFamily: "Arial, sans-serif",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexShrink: 0 }}>
        <div onClick={clickStock} style={{ cursor: "default" }}>
          {stock.length
            ? <CardEl card={{ suit: "♠", rank: 1, faceUp: false }} />
            : <EmptySlot label="↺" onClick={clickStock} />}
        </div>

        <div onClick={clickWaste} style={{ cursor: "default" }}>
          {waste.length
            ? <CardEl card={waste[waste.length - 1]} selected={isSel("waste", -1, waste.length - 1)} />
            : <EmptySlot />}
        </div>

        <div style={{ flex: 1 }} />

        {foundation.map((pile, fi) => (
          <div key={fi} onClick={() => clickFoundation(fi)} style={{ cursor: "default" }}>
            {pile.length
              ? <CardEl card={pile[pile.length - 1]} />
              : <EmptySlot label={SUITS[fi]} onClick={() => clickFoundation(fi)} />}
          </div>
        ))}

        <button onClick={reset} style={{
          alignSelf: "center", marginLeft: 8,
          background: "rgba(0,0,0,0.25)", color: "white",
          border: "1px solid rgba(255,255,255,0.4)", borderRadius: 2,
          padding: "3px 10px", fontSize: 11, cursor: "default",
        }}>New</button>
      </div>

      {won && (
        <div style={{ textAlign: "center", color: "#ffd700", fontWeight: "bold", fontSize: 16, flexShrink: 0 }}>
          🎉 You Win!
        </div>
      )}

      {/* Tableau */}
      <div style={{ display: "flex", gap: 8, flex: 1, alignItems: "flex-start", overflow: "auto" }}>
        {tableau.map((col, ci) => {
          const colHeight = col.length === 0
            ? CH
            : col.reduce((h, c, i) => h + (i === 0 ? 0 : c.faceUp ? VGAP : VGAP_HIDDEN), CH);

          return (
            <div key={ci} style={{ position: "relative", width: CW, height: colHeight, flexShrink: 0 }}>
              {col.length === 0
                ? <EmptySlot onClick={() => clickEmptyCol(ci)} />
                : col.map((card, idx) => {
                    const top = col.slice(0, idx).reduce(
                      (acc, c) => acc + (c.faceUp ? VGAP : VGAP_HIDDEN), 0
                    );
                    return (
                      <div
                        key={idx}
                        style={{ position: "absolute", top, left: 0, zIndex: idx }}
                        onClick={() => clickTableau(ci, idx)}
                      >
                        <CardEl
                          card={card}
                          selected={isSel("tableau", ci, idx)}
                        />
                      </div>
                    );
                  })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
