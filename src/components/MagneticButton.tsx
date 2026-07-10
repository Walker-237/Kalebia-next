"use client";

import { useRef, useState } from "react";

export function MagneticButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.22,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });
  const style = { transform: `translate(${pos.x}px, ${pos.y}px)` };

  if (variant === "solid") {
    return (
      <a
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={style}
        className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[#111114] bg-[#111114] px-10 py-5 text-[13px] font-medium tracking-[0.04em] text-[#FAFAF7] transition-transform duration-300 ease-out"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative">{children}</span>
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
          →
        </span>
      </a>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className="group relative inline-flex items-center gap-4 rounded-full border border-[#111114]/20 px-10 py-5 text-[13px] font-medium tracking-[0.04em] text-[#111114] transition-colors duration-300 ease-out hover:border-[#111114]/50"
    >
      <span>{children}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#111114]/20 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}
