"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const BOOT_LINES = [
  { text: "abSkill BIOS V2.74.1  Abstract L2 Edition", delay: 0, color: "#ffffff" },
  { text: "Copyright (C) 2026, abSkill Systems Inc.", delay: 120, color: "#ffffff" },
  { text: "", delay: 200 },
  { text: "Agent Processing Unit  : Abstract L2 Agent Core @ 2741 MHz", delay: 320 },
  { text: "Hyper Threading        : Enabled", delay: 480 },
  { text: "Agent Memory           : 8192MB OK", delay: 620 },
  { text: "", delay: 700 },
  { text: "Initializing ERC-8004 Identity Registry .............. Done.", delay: 820 },
  { text: "Initializing Validation Registry ...................... Done.", delay: 1050 },
  { text: "Initializing Reputation Registry ...................... Done.", delay: 1260 },
  { text: "", delay: 1340 },
  { text: "Detecting skill modules:", delay: 1460 },
  { text: "  Agent 0 .. AGW Connect           [skill.md v1.0.0]  OK", delay: 1620 },
  { text: "  Agent 1 .. AGW Send Transaction  [skill.md v1.2.0]  OK", delay: 1780 },
  { text: "  Agent 2 .. Read Contract         [skill.md v1.0.2]  OK", delay: 1920 },
  { text: "  Agent 3 .. Write Contract        [skill.md v1.1.0]  OK", delay: 2060 },
  { text: "", delay: 2140 },
  { text: "ERC-8004 Registry  : 0x8004a169fb4a3325136eb29fa0ceb6d2e539a432", delay: 2220, color: "#00c896" },
  { text: "Chain ID           : 2741 (Abstract L2)", delay: 2360, color: "#00c896" },
  { text: "Registered Agents  : 97", delay: 2480, color: "#00c896" },
  { text: "Total Skills       : 10", delay: 2580, color: "#00c896" },
  { text: "", delay: 2660 },
  { text: "USB Device(s)      : 1 Keyboard, 1 Mouse, 1 Agent Wallet", delay: 2760 },
  { text: "", delay: 2860 },
  { text: "Press DEL to enter SETUP, F12 to boot from AGW", delay: 2940, color: "#888888" },
  { text: "", delay: 3080 },
  { text: "Loading abSkill OS ...", delay: 3180, color: "#ffffff" },
];

interface Props {
  onDone: () => void;
}

export default function BootScreen({ onDone }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [fading, setFading] = useState(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(i + 1);
      }, line.delay);
      timers.push(t);
    });

    // After last line, wait then fade out
    const lastDelay = BOOT_LINES[BOOT_LINES.length - 1].delay;
    const fadeTimer = setTimeout(() => setFading(true), lastDelay + 600);
    const doneTimer = setTimeout(() => onDoneRef.current(), lastDelay + 1100);
    timers.push(fadeTimer, doneTimer);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        background: "#000000",
        fontFamily: 'var(--font-bios), "VT323", "Courier New", monospace',
        fontSize: 22,
        lineHeight: 1.7,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        transition: fading ? "opacity 0.5s ease" : "none",
        opacity: fading ? 0 : 1,
        zIndex: 99999,
      }}
    >
      {/* Logo top-right */}
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <Image
          src="/logo.webp"
          alt="abSkill"
          width={420}
          height={420}
          style={{ imageRendering: "pixelated", display: "block" }}
          priority
        />
      </div>

      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          style={{ color: line.color ?? "#c0c0c0", whiteSpace: "pre" }}
        >
          {line.text}
        </div>
      ))}

      {/* Blinking cursor */}
      {!fading && (
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 14,
            background: "#c0c0c0",
            animation: "blink 1s step-end infinite",
            verticalAlign: "middle",
            marginTop: 2,
          }}
        />
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
