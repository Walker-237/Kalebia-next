"use client";

import type { CSSProperties } from "react";

interface SectionMarkerProps {
  index: string; // e.g. "07"
  label: string; // e.g. "IMPACT"
  tone?: "light" | "dark"; // "dark" for use on dark/animated backgrounds
}

export function SectionMarker({ index, label, tone = "light" }: SectionMarkerProps) {
  const style: CSSProperties & Record<string, string> = {
    "--marker-color":
      tone === "dark" ? "rgba(250,250,247,.45)" : "rgba(17,17,20,.3)",
  };

  return (
    <div className="section-marker" style={style}>
      <span className="section-marker__index">{index} —</span> {label}
      <style>{`
        .section-marker {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--marker-color);
        }
        .section-marker__index {
          color: var(--marker-color);
        }
      `}</style>
    </div>
  );
}