"use client";

import { SectionMarker } from "../shared/SectionMarker";

const PARTNERS = ["PayApp", "CreaLab Studio", "EventBridge"];

// Duplicated for a seamless CSS-marquee loop (see .par-track keyframes).
const TRACK = [...PARTNERS, ...PARTNERS];

export default function Partenaires() {
  return (
    <section className="par" id="partenaires">
      <div className="par__inner">
        <div className="par__head">
          <SectionMarker index="11" label="Partenaires" />
          <h2 className="par__title">Ils m&rsquo;ont fait confiance</h2>
          <p className="par__sub">
            Entreprises, marques et partenaires avec lesquels j&rsquo;ai
            collaboré.
          </p>
        </div>
      </div>

      <div className="par__marquee">
        <div className="par__track">
          {TRACK.map((name, i) => (
            <span className="par__mark" key={`${name}-${i}`}>
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .par {
          background: var(--bg, #FAFAF7);
          padding: 8rem 0;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .par { padding: 10rem 0; }
        }
        .par__inner {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        @media (min-width: 1024px) {
          .par__inner { padding: 0 4rem; }
        }
        .par__head {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 640px;
          margin-bottom: 4.5rem;
        }
        .par__title {
          font-family: "Fraunces", serif;
          font-weight: 400;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          color: var(--ink, #111114);
          margin: 0;
        }
        .par__sub {
          font-family: "Inter", sans-serif;
          font-size: 1.0625rem;
          color: rgba(17,17,20,.55);
          margin: 0;
        }

        .par__marquee {
          border-top: 1px solid rgba(17,17,20,.08);
          border-bottom: 1px solid rgba(17,17,20,.08);
          padding: 2.5rem 0;
        }
        .par__track {
          display: flex;
          width: max-content;
          animation: par-scroll 26s linear infinite;
        }
        .par__marquee:hover .par__track {
          animation-play-state: paused;
        }

        .par__mark {
          font-family: "Fraunces", serif;
          font-weight: 500;
          font-size: clamp(1.75rem, 4vw, 3rem);
          color: rgba(17,17,20,.2);
          padding: 0 3.5rem;
          white-space: nowrap;
          position: relative;
          transition: color 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .par__mark::after {
          content: "/";
          position: absolute;
          right: -0.15em;
          top: 0;
          color: rgba(17,17,20,.12);
        }
        .par__mark:hover {
          color: var(--ink, #111114);
        }
        .par__mark:hover::before {
          content: "";
          position: absolute;
          left: 3.5rem;
          right: 3.5rem;
          bottom: -0.35rem;
          height: 1px;
          background: var(--accent, #C9A24B);
        }

        @keyframes par-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .par__track { animation: none; }
        }
      `}</style>
    </section>
  );
}