"use client";

import { useState, useCallback } from "react";

const WORDS = [
  "ABSTRACT", "BLOCKCHAIN", "WALLET", "AGENT", "SKILL", "CONTRACT", "TOKEN",
  "ORACLE", "VALIDATOR", "REGISTRY", "PROTOCOL", "SIGNATURE", "BYTECODE",
  "SOULBOUND", "IDENTITY", "REPUTATION", "MAINNET", "TESTNET", "DEPLOY",
  "MULTICALL", "CALLDATA", "TRANSFER", "ALLOWANCE", "APPROVAL",
];

const GALLOWS = [
  // 0 wrong
  `
  +---+
  |   |
      |
      |
      |
      |
=========`,
  // 1
  `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  // 2
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  // 3
  `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
  // 4
  `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  // 5
  `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
  // 6
  `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`,
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function Hangman() {
  const [word, setWord] = useState(pickWord);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  const wrong = [...guessed].filter(l => !word.includes(l)).length;
  const won = word.split("").every(l => guessed.has(l));
  const lost = wrong >= 6;

  const guess = useCallback((letter: string) => {
    if (won || lost || guessed.has(letter)) return;
    setGuessed(prev => new Set([...prev, letter]));
  }, [won, lost, guessed]);

  const reset = () => { setWord(pickWord()); setGuessed(new Set()); };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--win-silver)", padding: 8, gap: 8 }}>
      {/* Gallows */}
      <div className="flex gap-4">
        <pre style={{
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 1.4,
          background: "white",
          border: "2px solid",
          borderColor: "var(--win-darker) var(--win-white) var(--win-white) var(--win-darker)",
          padding: "4px 8px",
          flex: "0 0 auto",
          color: lost ? "#f00" : "#000",
        }}>
          {GALLOWS[Math.min(wrong, 6)]}
        </pre>

        {/* Word + status */}
        <div className="flex flex-col justify-center gap-3 flex-1">
          <div style={{ fontSize: 11, color: "var(--win-darker)" }}>
            Wrong guesses: {wrong} / 6
          </div>

          {/* Word display */}
          <div className="flex gap-2 flex-wrap">
            {word.split("").map((l, i) => (
              <div key={i} style={{
                width: 18,
                borderBottom: "2px solid #000",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "monospace",
                height: 24,
                lineHeight: "22px",
                color: lost && !guessed.has(l) ? "#f00" : "#000",
              }}>
                {guessed.has(l) ? l : lost ? l : ""}
              </div>
            ))}
          </div>

          {won && <div style={{ color: "#007b00", fontWeight: "bold", fontSize: 13 }}>You Win! 🎉</div>}
          {lost && <div style={{ color: "#f00", fontWeight: "bold", fontSize: 13 }}>Game Over! The word was: {word}</div>}

          <button className="win-btn" style={{ alignSelf: "flex-start", minWidth: 70 }} onClick={reset}>
            New Game
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 2, borderTop: "1px solid var(--win-darker)", borderBottom: "1px solid var(--win-white)" }} />

      {/* Keyboard */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {ALPHABET.map(l => {
          const isGuessed = guessed.has(l);
          const isWrong = isGuessed && !word.includes(l);
          const isCorrect = isGuessed && word.includes(l);
          return (
            <button
              key={l}
              className="win-btn"
              onClick={() => guess(l)}
              disabled={isGuessed || won || lost}
              style={{
                minWidth: 28,
                width: 28,
                padding: "1px 0",
                fontSize: 12,
                fontWeight: "bold",
                background: isCorrect ? "#c8f0c8" : isWrong ? "#f0c8c8" : "var(--win-silver)",
                opacity: isGuessed ? 0.6 : 1,
              }}
            >
              {l}
            </button>
          );
        })}
      </div>

      {/* Guessed wrong */}
      {[...guessed].filter(l => !word.includes(l)).length > 0 && (
        <div style={{ fontSize: 11, color: "var(--win-darker)" }}>
          Wrong: {[...guessed].filter(l => !word.includes(l)).join(", ")}
        </div>
      )}
    </div>
  );
}
