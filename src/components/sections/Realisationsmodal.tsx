"use client";

/**
 * RealisationsModal
 * ---------------------------------------------------------------------
 * Paginated grid using the same full-bleed image-overlay card as the
 * main section, just denser (4-up) — reads as "more of the catalog,"
 * not a different UI.
 *
 * Scrim stays a plain translucent ink overlay, not blurred — §5
 * reserves glass for small chips/nav, never a full-screen background.
 * Pagination is client-side over the `items` prop already fetched by
 * the parent server component.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import type { RealisationItem } from "./RealisationsView";

const PAGE_SIZE = 8;

function ModalCard({ item }: { item: RealisationItem }) {
  return (
    <article className="rm-card">
      <Image
        src={item.coverImage}
        alt={item.title}
        fill
        sizes="(min-width: 720px) 22vw, 92vw"
        className="rm-card-img"
      />
      <div className="rm-card-sweep" />
      <div className="rm-card-scrim" />

      <div className="rm-card-content">
        <span className="rm-card-badge">
          <span className="rm-card-badge-value">{item.metric.value}</span>
          {" "}{item.metric.label}
        </span>
        <h4 className="rm-card-title">{item.title}</h4>
        <button type="button" className="rm-card-cta">
          Voir les détails
        </button>
      </div>
    </article>
  );
}

export function RealisationsModal({
  items,
  isOpen,
  onClose,
}: {
  items: RealisationItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  useEffect(() => {
    if (!isOpen) setPage(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const start = page * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  return (
    <div className="rm-scrim" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="rm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="rm-head">
          <div>
            <span className="rm-eyebrow">Index — Réalisations</span>
            <h3 className="rm-title">Tous les projets</h3>
          </div>
          <button type="button" className="rm-close" onClick={onClose} aria-label="Fermer">
            Fermer
          </button>
        </div>

        <div className="rm-grid">
          {pageItems.map((item) => (
            <ModalCard item={item} key={item.id} />
          ))}
        </div>

        {pageCount > 1 && (
          <div className="rm-pagination">
            <button
              type="button"
              className="rm-page-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              ← Précédent
            </button>
            <span className="rm-page-status">
              {String(page + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="rm-page-btn"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>

      <style>{`
        .rm-scrim {
          --bg: #FAFAF7;
          --ink: #111114;
          --accent: #C9A24B;
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(17, 17, 20, 0.6);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: rm-fade 400ms var(--ease);
        }

        @media (min-width: 720px) {
          .rm-scrim {
            align-items: center;
            padding: 4vw;
          }
        }

        @keyframes rm-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .rm-panel {
          background: var(--bg);
          color: var(--ink);
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow-y: auto;
          padding: clamp(1.75rem, 4vw, 3rem);
          animation: rm-rise 500ms var(--ease);
        }

        @media (min-width: 720px) {
          .rm-panel {
            border: 1px solid rgba(17, 17, 20, 0.08);
            border-radius: 20px;
          }
        }

        @keyframes rm-rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rm-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
        }

        .rm-eyebrow {
          display: block;
          font-family: "Inter", sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(17, 17, 20, 0.3);
          margin-bottom: 0.5rem;
        }

        .rm-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 340;
          font-size: clamp(24px, 3.2vw, 34px);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .rm-close {
          flex-shrink: 0;
          background: none;
          border: none;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          letter-spacing: 0.03em;
          color: rgba(17, 17, 20, 0.55);
          cursor: pointer;
          padding: 0.4rem 0;
          position: relative;
        }

        .rm-close::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 400ms var(--ease);
        }

        .rm-close:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        /* ---------- grid ---------- */
        .rm-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 1.6vw, 22px);
        }

        @media (max-width: 1024px) {
          .rm-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 720px) {
          .rm-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .rm-grid {
            grid-template-columns: 1fr;
          }
        }

        .rm-card {
          position: relative;
          aspect-ratio: 3 / 4;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(17, 17, 20, 0.06);
        }

        .rm-card-img {
          object-fit: cover;
          transition: transform 700ms var(--ease);
        }

        .rm-card:hover .rm-card-img {
          transform: scale(1.05);
        }

        .rm-card-sweep {
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

        .rm-card:hover .rm-card-sweep {
          transform: translateX(130%);
        }

        .rm-card-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(17, 17, 20, 0.92) 0%,
            rgba(17, 17, 20, 0.5) 36%,
            rgba(17, 17, 20, 0) 66%
          );
          z-index: 1;
        }

        .rm-card-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .rm-card-badge {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-family: "Inter", sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          color: var(--bg);
          background: rgba(250, 250, 247, 0.14);
          border: 1px solid rgba(250, 250, 247, 0.25);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 0.32rem 0.6rem;
        }

        .rm-card-badge-value {
          color: var(--accent);
          font-weight: 600;
        }

        .rm-card-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 440;
          font-size: 16px;
          line-height: 1.22;
          letter-spacing: -0.005em;
          color: var(--bg);
          margin: 0;
        }

        .rm-card-cta {
          margin-top: 0.15rem;
          align-self: flex-start;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--ink);
          background: var(--bg);
          border: none;
          border-radius: 999px;
          padding: 0.55rem 1rem;
          cursor: pointer;
          transition: transform 400ms var(--ease), background 400ms var(--ease);
        }

        .rm-card:hover .rm-card-cta {
          transform: translateY(-2px);
          background: var(--accent);
          color: var(--ink);
        }

        /* ---------- pagination ---------- */
        .rm-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: clamp(1.75rem, 3vw, 2.5rem);
          font-family: "Inter", sans-serif;
        }

        .rm-page-btn {
          background: none;
          border: none;
          font-size: 13px;
          letter-spacing: 0.02em;
          color: var(--ink);
          cursor: pointer;
          padding: 0.5rem 0;
        }

        .rm-page-btn:disabled {
          color: rgba(17, 17, 20, 0.25);
          cursor: default;
        }

        .rm-page-status {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: rgba(17, 17, 20, 0.4);
        }

        @media (prefers-reduced-motion: reduce) {
          .rm-scrim,
          .rm-panel,
          .rm-card-img,
          .rm-card-sweep,
          .rm-card-cta {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}