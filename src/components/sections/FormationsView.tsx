"use client";

/**
 * FormationsView
 * ---------------------------------------------------------------------
 * Client half of Formations — split off so the parent Formations.tsx can
 * be a Server Component that fetches real data. Visual design and motion
 * untouched from the original: §7 "Premium 'magazine cover' treatment,
 * large type, minimal metadata." No cards — each course is a full-width
 * editorial chapter, alternating left/right per the 5/7-7/5 asymmetry
 * rule, with a huge low-opacity Fraunces numeral behind the title.
 */

import { useEffect, useRef, useState } from "react";
import LiquidEther from "./Liquidether";

export interface Course {
  slug: string;
  title: string;
  desc: string;
  href: string;
}

// Gold ramp shared with Platforms — same family, but skewed a touch
// darker/richer since this section is meant to carry more visual weight.
const GOLD_RAMP = ["#EAD9AE", "#C9A24B", "#6E4E1C"];

/** Fades a chapter up into place once it enters the viewport. Local,
 * dependency-free version of the shared Reveal.tsx pattern from §6 —
 * swap for the real component if it's already built in this project. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}

function FormationItem({ index, course }: { index: number; course: Course }) {
  const { ref, inView } = useReveal<HTMLElement>();
  const isEven = index % 2 === 0;
  const num = String(index).padStart(2, "0");

  return (
    <article
      ref={ref}
      className={`fm-item ${isEven ? "fm-item-right" : "fm-item-left"} ${inView ? "is-in" : ""}`}
    >
      <span className="fm-ghost" aria-hidden="true">
        {num}
      </span>
      <div className="fm-item-inner">
        <span className="fm-item-index">{num} —</span>
        <h3 className="fm-item-title">{course.title}</h3>
        <p className="fm-item-desc">{course.desc}</p>
        <a className="fm-link" href={course.href}>
          <span className="fm-link-label">Voir plus</span>
          <span className="fm-link-arrow" aria-hidden="true">
            →
          </span>
          <span className="fm-link-line" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function FormationsView({ courses }: { courses: Course[] }) {
  const header = useReveal<HTMLDivElement>();

  if (courses.length === 0) return null;

  return (
    <section id="formations" className="fm-section">
      <div className="fm-liquid-bg" aria-hidden="true">
        <LiquidEther
          colors={GOLD_RAMP}
          mouseForce={16}
          cursorSize={160}
          isViscous
          viscous={26}
          iterationsViscous={24}
          iterationsPoisson={24}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.3}
          autoIntensity={1.8}
          takeoverDuration={0.4}
          autoResumeDelay={2000}
          autoRampDuration={0.8}
        />
      </div>
      <div className="fm-scrim" aria-hidden="true" />

      <div ref={header.ref} className={`fm-header ${header.inView ? "is-in" : ""}`}>
        <span className="fm-marker">07 — FORMATIONS</span>
        <h2 className="fm-heading">Mes formations</h2>
        <p className="fm-lede">
          Des parcours concrets pour maîtriser le community management et les réseaux sociaux.
        </p>
      </div>

      <div className="fm-list">
        {courses.map((course, i) => (
          <FormationItem key={course.slug} index={i + 1} course={course} />
        ))}
      </div>

      <style>{`
        .fm-section {
          --bg: #FAFAF7;
          --ink: #111114;
          --accent: #C9A24B;
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          background: var(--bg);
          color: var(--ink);
          padding: clamp(80px, 11vw, 144px) 0 clamp(40px, 6vw, 64px);
        }

        .fm-liquid-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.6;
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .fm-scrim {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(
            to bottom,
            var(--bg) 0%,
            transparent 22%,
            transparent 78%,
            var(--bg) 100%
          );
          pointer-events: none;
        }

        .fm-header {
          position: relative;
          z-index: 1;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 clamp(2rem, 4vw, 4rem);
          margin-bottom: clamp(56px, 8vw, 96px);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 800ms var(--ease), transform 800ms var(--ease);
        }

        .fm-header.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .fm-marker {
          display: block;
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: rgba(17, 17, 20, 0.3);
          margin-bottom: 1.25rem;
        }

        .fm-heading {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 340;
          font-size: clamp(32px, 4.8vw, 60px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0 0 1rem;
        }

        .fm-lede {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(17, 17, 20, 0.55);
          max-width: 46ch;
          margin: 0;
        }

        .fm-list {
          position: relative;
          z-index: 1;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 clamp(2rem, 4vw, 4rem);
          border-top: 1px solid rgba(17, 17, 20, 0.08);
        }

        .fm-item {
          position: relative;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          padding: clamp(48px, 7vw, 84px) 0;
          border-bottom: 1px solid rgba(17, 17, 20, 0.08);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 800ms var(--ease), transform 800ms var(--ease);
        }

        .fm-item.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .fm-ghost {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          font-family: "Fraunces", serif;
          font-weight: 320;
          font-size: clamp(140px, 20vw, 280px);
          line-height: 1;
          color: rgba(17, 17, 20, 0.05);
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .fm-item-right .fm-ghost {
          left: auto;
          right: 0;
        }

        .fm-item-inner {
          position: relative;
          z-index: 1;
          grid-column: 1 / span 7;
        }

        .fm-item-right .fm-item-inner {
          grid-column: 6 / span 7;
        }

        @media (max-width: 860px) {
          .fm-item-inner,
          .fm-item-right .fm-item-inner {
            grid-column: 1 / span 12;
          }
          .fm-ghost {
            font-size: clamp(90px, 32vw, 160px);
          }
        }

        .fm-item-index {
          display: inline-block;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .fm-item-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-size: clamp(26px, 3.4vw, 42px);
          line-height: 1.16;
          letter-spacing: -0.01em;
          margin: 0 0 1.1rem;
          max-width: 18ch;
        }

        .fm-item-desc {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.65;
          color: rgba(17, 17, 20, 0.55);
          max-width: 44ch;
          margin: 0 0 1.75rem;
        }

        .fm-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
          text-decoration: none;
        }

        .fm-link-arrow {
          transition: transform 420ms var(--ease);
        }

        .fm-link:hover .fm-link-arrow {
          transform: translateX(4px);
        }

        .fm-link-line {
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 420ms var(--ease);
        }

        .fm-link:hover .fm-link-line {
          transform: scaleX(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .fm-header,
          .fm-item {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
