"use client";

/**
 * Réalisations
 * ---------------------------------------------------------------------
 * New section, modeled on Blog.tsx's "one featured + secondary grid"
 * pattern (§7) since it's the closest existing template for real content
 * with cover art — adapted with a thumbnail on every grid card (not just
 * the featured one), since portfolio pieces read better with an image
 * each, unlike blog post excerpts. Same marker/motion/typography system
 * as Impact / Méthode / Témoignages / Partenaires / Contact.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionMarker } from "../shared/SectionMarker";

export interface RealisationItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  coverImage: string;
}

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
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}

export function RealisationsView({ items }: { items: RealisationItem[] }) {
  const header = useReveal<HTMLDivElement>();
  const featuredReveal = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();

  if (items.length === 0) return null;

  const [featured, ...rest] = items;

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

      <div ref={featuredReveal.ref} className={`re-featured ${featuredReveal.inView ? "is-in" : ""}`}>
        <div className="re-featured-panel">
          <Image src={featured.coverImage} alt={featured.title} fill sizes="(min-width: 860px) 42vw, 92vw" className="re-featured-img" />
        </div>
        <div className="re-featured-text">
          <span className="re-meta">{featured.category}</span>
          <h3 className="re-featured-title">{featured.title}</h3>
          <p className="re-excerpt">{featured.shortDescription}</p>
        </div>
      </div>

      {rest.length > 0 && (
        <div ref={grid.ref} className={`re-grid ${grid.inView ? "is-in" : ""}`}>
          {rest.map((item, i) => (
            <article
              className="re-card"
              key={item.id}
              style={{ "--stagger": `${i * 120}ms` } as React.CSSProperties}
            >
              <div className="re-card-panel">
                <Image src={item.coverImage} alt={item.title} fill sizes="(min-width: 720px) 30vw, 92vw" className="re-card-img" />
              </div>
              <span className="re-meta">{item.category}</span>
              <h3 className="re-card-title">{item.title}</h3>
              <p className="re-excerpt">{item.shortDescription}</p>
            </article>
          ))}
        </div>
      )}

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
        .re-featured,
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

        /* ---------- featured ---------- */
        .re-featured {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(28px, 4vw, 56px);
          align-items: center;
          padding-bottom: clamp(40px, 6vw, 64px);
          margin-bottom: clamp(40px, 6vw, 64px);
          border-bottom: 1px solid rgba(17, 17, 20, 0.08);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 800ms var(--ease) 100ms, transform 800ms var(--ease) 100ms;
        }

        .re-featured.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .re-featured-panel {
          grid-column: 1 / span 5;
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          overflow: hidden;
          background: #E7DCC2;
        }

        .re-featured-img {
          object-fit: cover;
        }

        .re-featured-text {
          grid-column: 6 / span 7;
        }

        @media (max-width: 860px) {
          .re-featured-panel,
          .re-featured-text {
            grid-column: 1 / span 12;
          }
          .re-featured-panel {
            aspect-ratio: 16 / 9;
          }
        }

        .re-meta {
          display: block;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .re-featured-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-size: clamp(26px, 3.4vw, 40px);
          line-height: 1.16;
          letter-spacing: -0.01em;
          margin: 0 0 1.1rem;
          max-width: 22ch;
        }

        .re-excerpt {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.65;
          color: rgba(17, 17, 20, 0.55);
          max-width: 46ch;
          margin: 0 0 1.25rem;
        }

        /* ---------- secondary grid ---------- */
        .re-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(32px, 4vw, 48px);
        }

        @media (max-width: 1024px) {
          .re-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .re-grid {
            grid-template-columns: 1fr;
          }
        }

        .re-card {
          position: relative;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms var(--ease) var(--stagger), transform 700ms var(--ease) var(--stagger);
        }

        .re-grid.is-in .re-card {
          opacity: 1;
          transform: translateY(0);
        }

        .re-card-panel {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 4px;
          overflow: hidden;
          background: #E7DCC2;
          margin-bottom: 1.25rem;
        }

        .re-card-img {
          object-fit: cover;
          transition: transform 600ms var(--ease);
        }

        .re-card:hover .re-card-img {
          transform: scale(1.04);
        }

        .re-card-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.24;
          letter-spacing: -0.005em;
          margin: 0 0 0.75rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .re-header,
          .re-featured,
          .re-card {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .re-card-img {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
