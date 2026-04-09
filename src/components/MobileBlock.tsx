"use client";

import { useEffect, useState } from "react";

export default function MobileBlock({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    setChecked(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!checked) return null;

  if (isMobile) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#008080",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, sans-serif',
        padding: 16,
      }}>
        <div style={{
          background: "#c0c0c0",
          border: "2px solid",
          borderColor: "#ffffff #404040 #404040 #ffffff",
          width: "100%",
          maxWidth: 320,
          boxShadow: "2px 2px 0 #000",
        }}>
          {/* Title bar */}
          <div style={{
            background: "linear-gradient(to right, #000080, #1084d0)",
            padding: "3px 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>⚠️</span>
              <span style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>abSkill</span>
            </div>
            <div style={{
              width: 16, height: 14,
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#ffffff #404040 #404040 #ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: "bold", lineHeight: 1,
            }}>✕</div>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 36, flexShrink: 0, lineHeight: 1 }}>🖥️</span>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: "#000" }}>
                <b>This application requires a desktop browser.</b>
                <br /><br />
                abSkill is optimized for desktop and cannot be displayed on small screens.
                <br /><br />
                Please visit us from a computer for the best experience.
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#808080", marginTop: -4 }} />
            <div style={{ height: 1, background: "#ffffff", marginTop: -13 }} />

            {/* OK button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => window.open("https://x.com/0xabstract", "_blank")}
                style={{
                  padding: "4px 28px",
                  fontSize: 12,
                  background: "#c0c0c0",
                  border: "2px solid",
                  borderColor: "#ffffff #404040 #404040 #ffffff",
                  cursor: "default",
                  fontFamily: "inherit",
                  fontWeight: "bold",
                  boxShadow: "1px 1px 0 #000",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
