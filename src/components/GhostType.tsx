"use client";

import { useEffect, useState } from "react";

export type GhostWord = {
  word: string;
  top: string;
  left: string;
  size: string;
  opacity: number;
};

export function GhostType({
  words,
  parallaxFactor = -0.04,
}: {
  words: GhostWord[];
  parallaxFactor?: number;
}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-visible"
      style={{ transform: `translateY(${scrollY * parallaxFactor}px)` }}
    >
      {words.map((d) => (
        <span
          key={d.word}
          className="font-display absolute font-light whitespace-nowrap text-[#111114]"
          style={{
            top: d.top,
            left: d.left,
            fontSize: d.size,
            opacity: d.opacity,
          }}
        >
          {d.word}
        </span>
      ))}
    </div>
  );
}
