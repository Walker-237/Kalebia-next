"use client";

/**
 * Réalisations
 * ---------------------------------------------------------------------
 * v4 — card visual language rebuilt against the reference screenshot:
 * full-bleed photo, rounded corners, dark gradient overlay carrying
 * white type + glass pill badges, solid pill CTA pinned at the bottom.
 *
 * Adjustments from the reference (kept ours, not theirs):
 *   - Overlay gradient uses --ink (#111114), not the reference's warm
 *     green-black — §1's palette, no new colors introduced.
 *   - Badge/pill glass uses --bg tinted, per §5 (glass reserved for
 *     small floating chips — this qualifies).
 *   - Metric badge's value renders in --accent, giving the gold token
 *     a job instead of leaving the card monochrome.
 *   - CTA copy is "Voir les détails" — "Voir le projet" reads like a
 *     software/dev project, not a client engagement, so it's gone.
 *
 * Still local `useReveal` / plain button rather than shared
 * `Reveal` / `MagneticButton` (§6) — send those files over when ready.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionMarker } from "../shared/SectionMarker";
import { RealisationsModal } from "./Realisationsmodal";

export interface RealisationMetric {
  /** e.g. "340%", "12", "2.4M" — shown as a small badge on the card */
  value: string;
  /** e.g. "croissance de portée", "campagnes livrées" */
  label: string;
}

export interface RealisationItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  coverImage: string;
  metric: RealisationMetric;
}

// First card is the large "hero" card, next 5 fill the grid below —
// 6 total before folding the rest into the "see all" modal.
const VISIBLE_COUNT = 6;

function useReveal<T extends HTMLElement>(threshold = 0.15) {
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Card({
  item,
  index,
  hero = false,
}: {
  item: RealisationItem;
  index: number;
  hero?: boolean;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <article
      ref={ref}
      className={`re-card ${hero ? "re-card--hero" : ""} ${inView ? "is-in" : ""}`}
      style={{ "--stagger": `${(index % 6) * 90}ms` } as React.CSSProperties}
    >
      <Image
        src={item.coverImage}
        alt={item.title}
        fill
        sizes={hero ? "(min-width: 860px) 96vw, 92vw" : "(min-width: 860px) 30vw, 92vw"}
        className="re-card-img"
      />
      <div className="re-card-sweep" />
      <div className="re-card-scrim" />

      <div className="re-card-content">
        <div className="re-card-badges">
          <span className="re-card-badge">{item.category}</span>
          <span className="re-card-badge">
            <span className="re-card-badge-value">{item.metric.value}</span>
            {" "}{item.metric.label}
          </span>
        </div>

        <h3 className="re-card-title">{item.title}</h3>
        <p className="re-card-excerpt">{item.shortDescription}</p>

        <button type="button" className="re-card-cta">
          Voir les détails
        </button>
      </div>
    </article>
  );
}

export function RealisationsView({ items }: { items: RealisationItem[] }) {
  const header = useReveal<HTMLDivElement>();
  const [modalOpen, setModalOpen] = useState(false);

  if (items.length === 0) return null;

  const visible = items.slice(0, VISIBLE_COUNT);
  const [heroItem, ...gridItems] = visible;
  const hasMore = items.length > VISIBLE_COUNT;

  return (
    <section className="re-section" id="realisations">
      <div ref={header.ref} className={`re-header ${header.inView ? "is-in" : ""}`}>
        <SectionMarker index="04" label="Réalisations" />
        <h2 className="re-heading">
          Des projets qui <em>parlent</em> d&rsquo;eux-mêmes.
        </h2>
        <p className="re-lede">
          Quelques réalisations récentes en community management et gestion de projet.
        </p>
      </div>

      <div className="re-grid">
        <Card item={heroItem} index={0} hero />
        {gridItems.map((item, i) => (
          <Card item={item} index={i + 1} key={item.id} />
        ))}
      </div>

      {hasMore && (
        <div className="re-cta-row">
          <button type="button" className="re-cta" onClick={() => setModalOpen(true)}>
            <span>Voir tous les projets</span>
            <span className="re-cta-count">{items.length}</span>
          </button>
        </div>
      )}

      <RealisationsModal items={items} isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <style>{`
        .re-section {
          --bg: #FAFAF7;
          --ink: #111114;
          --accent: #C9A24B;
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          background: var(--bg);
          color: var(--ink);
          padding: clamp(72px, 10vw, 128px) clamp(2rem, 4vw, 4rem);
        }

        .re-header,
        .re-grid {
          max-width: 1600px;
          margin: 0 auto;
        }

        .re-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: clamp(48px, 7vw, 80px);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 800ms var(--ease), transform 800ms var(--ease);
        }

        .re-header.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .re-heading {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 340;
          font-size: clamp(32px, 4.8vw, 56px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .re-heading em {
          font-style: normal;
          color: var(--accent);
        }

        .re-lede {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(17, 17, 20, 0.55);
          max-width: 48ch;
          margin: 0;
        }

        /* ---------- grid ---------- */
        .re-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(20px, 2vw, 28px);
        }

        /* ---------- card ---------- */
        .re-card {
          grid-column: span 4;
          position: relative;
          aspect-ratio: 3 / 4;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(17, 17, 20, 0.06);
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 700ms var(--ease) var(--stagger), transform 700ms var(--ease) var(--stagger);
        }

        .re-card.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .re-card--hero {
          grid-column: span 12;
          aspect-ratio: 21 / 9;
        }

        @media (max-width: 1024px) {
          .re-card {
            grid-column: span 6;
          }
        }

        @media (max-width: 640px) {
          .re-card,
          .re-card--hero {
            grid-column: span 12;
            aspect-ratio: 4 / 5;
          }
        }

        .re-card-img {
          object-fit: cover;
          transition: transform 800ms var(--ease);
        }

        .re-card:hover .re-card-img {
          transform: scale(1.045);
        }

        .re-card-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.16) 45%,
            transparent 70%
          );
          transform: translateX(-130%);
          transition: transform 750ms var(--ease);
          pointer-events: none;
          z-index: 2;
        }

        .re-card:hover .re-card-sweep {
          transform: translateX(130%);
        }

        .re-card-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(17, 17, 20, 0.92) 0%,
            rgba(17, 17, 20, 0.55) 32%,
            rgba(17, 17, 20, 0) 62%
          );
          z-index: 1;
        }

        .re-card-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          padding: clamp(18px, 1.8vw, 26px);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .re-card-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .re-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: "Inter", sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: var(--bg);
          background: rgba(250, 250, 247, 0.14);
          border: 1px solid rgba(250, 250, 247, 0.25);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 0.4rem 0.75rem;
        }

        .re-card-badge-value {
          color: var(--accent);
          font-weight: 600;
        }

        .re-card-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 460;
          font-size: clamp(19px, 1.8vw, 24px);
          line-height: 1.2;
          letter-spacing: -0.005em;
          color: var(--bg);
          margin: 0;
        }

        .re-card--hero .re-card-title {
          font-size: clamp(24px, 2.6vw, 34px);
        }

        .re-card-excerpt {
          font-family: "Inter", sans-serif;
          font-size: 13.5px;
          line-height: 1.55;
          color: rgba(250, 250, 247, 0.72);
          margin: 0;
          max-width: 46ch;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .re-card--hero .re-card-excerpt {
          -webkit-line-clamp: 3;
        }

        .re-card-cta {
          margin-top: 0.35rem;
          align-self: flex-start;
          font-family: "Inter", sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--ink);
          background: var(--bg);
          border: none;
          border-radius: 999px;
          padding: 0.7rem 1.3rem;
          cursor: pointer;
          transition: transform 400ms var(--ease), background 400ms var(--ease);
        }

        .re-card:hover .re-card-cta {
          transform: translateY(-2px);
          background: var(--accent);
          color: var(--ink);
        }

        /* ---------- see-all CTA ---------- */
        .re-cta-row {
          max-width: 1600px;
          margin: clamp(48px, 6vw, 72px) auto 0;
          display: flex;
          justify-content: center;
        }

        .re-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--bg);
          background: var(--ink);
          border: none;
          padding: 1rem 1.75rem;
          cursor: pointer;
          overflow: hidden;
          transition: transform 500ms var(--ease);
        }

        .re-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.16) 45%,
            transparent 70%
          );
          transform: translateX(-120%);
          transition: transform 700ms var(--ease);
        }

        .re-cta:hover::before {
          transform: translateX(120%);
        }

        .re-cta:hover {
          transform: translateY(-2px);
        }

        .re-cta-count {
          font-family: "Fraunces", serif;
          font-weight: 400;
          color: var(--accent);
        }

        @media (prefers-reduced-motion: reduce) {
          .re-header,
          .re-card,
          .re-card-img,
          .re-card-sweep,
          .re-card-cta,
          .re-cta {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}