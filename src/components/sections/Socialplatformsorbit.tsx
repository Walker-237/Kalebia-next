"use client";

/**
 * PlatformsMarquee
 * ---------------------------------------------------------------------
 * Built against design-system.md — not a port of the previous orbit/
 * carousel component. Notable departures, all intentional:
 *
 * - No per-platform brand-color glows. The system allows exactly one
 *   accent (--accent, gold) used sparingly; hover state uses only that.
 * - No icon library. Logos are real brand marks (content), but every
 *   other visual device — the index marker, the "/", the metadata — is
 *   typographic, per §5 "No icon libraries."
 * - Continuous flow instead of scroll-snap-and-pause, per your own
 *   "Partenaires: infinite marquee, monochrome → color on hover"
 *   pattern — just applied here to Platforms instead.
 * - Glass is used exactly where the system scopes it: the card itself
 *   (a "floating glass node"), nothing bigger.
 * - Motion runs on the one shared easing curve (cubic-bezier(0.22, 1,
 *   0.36, 1)) and respects prefers-reduced-motion by freezing the loop
 *   entirely — hover-to-grow still works either way.
 *
 * Drop-in Next.js client component. Assumes Fraunces + Inter are already
 * registered site-wide (as in the hero) — no next/font calls here.
 */

import Image from "next/image";
import LiquidEther from "./Liquidether";

type Level = "Expert" | "Avancé" | "Intermédiaire";

interface Platform {
  key: string;
  name: string;
  level: Level;
  logo: string;
}

const PLATFORMS: Platform[] = [
  { key: "instagram", name: "Instagram", level: "Expert", logo: "/instagram.png" },
  { key: "facebook", name: "Facebook", level: "Expert", logo: "/facebook.png" },
  { key: "tiktok", name: "TikTok", level: "Expert", logo: "/tiktok.png" },
  { key: "snapchat", name: "Snapchat", level: "Avancé", logo: "/snap.png" },
  { key: "linkedin", name: "LinkedIn", level: "Avancé", logo: "/linkdin.png" },
  { key: "x", name: "X", level: "Avancé", logo: "/x.png" },
  { key: "youtube", name: "YouTube", level: "Intermédiaire", logo: "/youtube.png" },
  { key: "whatsapp", name: "WhatsApp", level: "Expert", logo: "/whatsapp.png" },
];

// Rendered twice back-to-back so the marquee loop is seamless at -50%.
const LOOP: Platform[] = [...PLATFORMS, ...PLATFORMS];

// Tonal ramp derived from --accent (#C9A24B) rather than a new hue — a pale
// cream-gold and a deep bronze bracketing the accent itself, so the fluid
// sim reads as "your gold in motion" rather than an imported palette.
const GOLD_RAMP = ["#F1E4C4", "#C9A24B", "#7C5A22"];

export default function PlatformsMarquee() {
  return (
    <section className="pm-section">
      <div className="pm-liquid-bg" aria-hidden="true">
        <LiquidEther
          colors={GOLD_RAMP}
          mouseForce={14}
          cursorSize={140}
          isViscous
          viscous={28}
          iterationsViscous={24}
          iterationsPoisson={24}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.35}
          autoIntensity={1.6}
          takeoverDuration={0.4}
          autoResumeDelay={2200}
          autoRampDuration={0.8}
        />
      </div>
      <div className="pm-scrim" aria-hidden="true" />

      <div className="pm-header">
        <span className="pm-marker">04 — PLATEFORMES</span>
        <h2 className="pm-heading">
          Là où votre audience vous <em>retrouve</em>, huit fois sur huit.
        </h2>
      </div>

      <div className="pm-bleed">
        <div className="pm-fade pm-fade-l" aria-hidden="true" />
        <div className="pm-fade pm-fade-r" aria-hidden="true" />

        <div className="pm-track" role="list" aria-label="Plateformes gérées">
          {LOOP.map((p, i) => (
            <div className="pm-card" role="listitem" key={`${p.key}-${i}`} tabIndex={0}>
              <span className="pm-card-logo">
                <Image src={p.logo} alt="" width={22} height={22} />
              </span>
              <span className="pm-card-copy">
                <span className="pm-card-name">{p.name}</span>
                <span className="pm-card-meta">
                  <span className="pm-card-slash">/</span>
                  {p.level}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pm-section {
          --bg: #FAFAF7;
          --ink: #111114;
          --accent: #C9A24B;
          position: relative;
          overflow: hidden;
          background: var(--bg);
          color: var(--ink);
          padding: clamp(72px, 10vw, 128px) 0;
        }

        /* Section-wide fluid background, gold ramp, transparent canvas
           composited onto --bg via multiply so it reads as warmth moving
           through cream rather than a neon layer sitting on top of it. */
        .pm-liquid-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.5;
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        /* Softens the sim back toward --bg near the top/bottom edges so it
           reads as this section's atmosphere, not a hard-edged panel. */
        .pm-scrim {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(
            to bottom,
            var(--bg) 0%,
            transparent 18%,
            transparent 82%,
            var(--bg) 100%
          );
          pointer-events: none;
        }

        .pm-header {
          position: relative;
          z-index: 1;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 clamp(2rem, 4vw, 4rem);
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          margin-bottom: clamp(40px, 6vw, 72px);
        }

        .pm-marker {
          grid-column: 1 / span 12;
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: rgba(17, 17, 20, 0.3);
          margin-bottom: 1.25rem;
        }

        .pm-heading {
          grid-column: 1 / span 8;
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 340;
          font-size: clamp(28px, 4.2vw, 54px);
          line-height: 1.18;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .pm-heading em {
          font-style: normal;
          font-weight: 560;
          color: var(--accent);
        }

        @media (max-width: 860px) {
          .pm-heading {
            grid-column: 1 / span 12;
          }
        }

        /* ---------- full-bleed marquee ---------- */
        .pm-bleed {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
        }

        .pm-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(40px, 8vw, 140px);
          z-index: 2;
          pointer-events: none;
        }

        .pm-fade-l {
          left: 0;
          background: linear-gradient(to right, var(--bg), transparent);
        }

        .pm-fade-r {
          right: 0;
          background: linear-gradient(to left, var(--bg), transparent);
        }

        .pm-track {
          position: relative;
          z-index: 1;
          display: flex;
          width: max-content;
          gap: clamp(14px, 1.6vw, 22px);
          padding: 4px clamp(2rem, 4vw, 4rem);
          animation: pm-flow 34s linear infinite;
        }

        .pm-track:hover {
          animation-play-state: paused;
        }

        @keyframes pm-flow {
          from {
            transform: translateX(0);
          }
          to {
            /* half the width, since the list is duplicated once */
            transform: translateX(-50%);
          }
        }

        .pm-card {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 999px;
          border: 1px solid rgba(17, 17, 20, 0.1);
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(6px);
          cursor: default;
          transform: scale(1);
          transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 480ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 480ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pm-track:hover .pm-card {
          opacity: 0.55;
        }

        .pm-card:hover {
          transform: scale(1.16);
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.9);
          opacity: 1 !important;
          z-index: 3;
          position: relative;
        }

        .pm-card:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        .pm-card-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          flex: 0 0 auto;
          filter: grayscale(1);
          opacity: 0.65;
          transition: filter 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pm-card:hover .pm-card-logo {
          filter: grayscale(0);
          opacity: 1;
        }

        .pm-card-copy {
          display: flex;
          align-items: baseline;
          gap: 6px;
          white-space: nowrap;
        }

        .pm-card-name {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
        }

        .pm-card-meta {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(17, 17, 20, 0.4);
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
        }

        .pm-card-slash {
          color: rgba(17, 17, 20, 0.25);
        }

        .pm-card:hover .pm-card-meta {
          color: var(--accent);
        }

        @media (prefers-reduced-motion: reduce) {
          .pm-track {
            animation: none;
          }
          .pm-card {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}