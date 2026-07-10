"use client";

import { useReveal } from "../shared/useReveal";
import { SectionMarker } from "../shared/SectionMarker";

interface Step {
  index: string;
  tag: string; // "Écoute"
  heading: string; // "Cadrage"
  body: string;
}

const STEPS: Step[] = [
  {
    index: "01",
    tag: "Écoute",
    heading: "Cadrage",
    body: "Comprendre la marque, ses objectifs et sa communauté avant tout le reste.",
  },
  {
    index: "02",
    tag: "Plan",
    heading: "Stratégie",
    body: "Ligne éditoriale, planning et indicateurs définis ensemble, noir sur blanc.",
  },
  {
    index: "03",
    tag: "Action",
    heading: "Création & animation",
    body: "Production, publication et conversation, au rythme de la communauté.",
  },
  {
    index: "04",
    tag: "Mesure",
    heading: "Itération",
    body: "Lecture des données, reporting clair, ajustements pour faire mieux.",
  },
];

function StepRow({ step, total, delay }: { step: Step; total: number; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.35);

  return (
    <div
      ref={ref}
      className={`met-step ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="met-step__num-col">
        <span className="met-step__num">{step.index}</span>
        <span className="met-step__rail" aria-hidden="true" />
      </div>

      <div className="met-step__content">
        <span className="met-step__tag">{step.tag}</span>
        <h3 className="met-step__heading">{step.heading}</h3>
        <p className="met-step__body">{step.body}</p>
      </div>

      <div className="met-step__meta" aria-hidden="true">
        {step.index} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

export default function Methode() {
  return (
    <section className="met" id="methode">
      <span className="met__ghost" aria-hidden="true">
        Méthode
      </span>

      <div className="met__inner">
        <div className="met__head">
          <SectionMarker index="08" label="Méthode" />
          <h2 className="met__title">Comment je travaille, en quatre temps.</h2>
          <p className="met__sub">
            Un fil clair, du premier brief jusqu&rsquo;à l&rsquo;itération.
          </p>
        </div>

        <div className="met__timeline">
          {STEPS.map((step, i) => (
            <StepRow key={step.index} step={step} total={STEPS.length} delay={i * 60} />
          ))}
        </div>
      </div>

      <style>{`
        .met {
          position: relative;
          background: var(--bg, #FAFAF7);
          padding: 7rem 2rem;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .met { padding: 8rem 4rem; }
        }

        /* oversized, near-invisible background word — fills empty canvas
           the way GhostType does elsewhere, without adding a new idiom */
        .met__ghost {
          position: absolute;
          top: 2rem;
          right: 2rem;
          font-family: "Fraunces", serif;
          font-weight: 300;
          font-size: clamp(4rem, 14vw, 12rem);
          line-height: 1;
          color: rgba(17,17,20,.035);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }

        .met__inner {
          position: relative;
          max-width: 1600px;
          margin: 0 auto;
        }
        .met__head {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 640px;
          margin-bottom: 4.5rem;
        }
        .met__title {
          font-family: "Fraunces", serif;
          font-weight: 400;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          line-height: 1.15;
          color: var(--ink, #111114);
          margin: 0;
        }
        .met__sub {
          font-family: "Inter", sans-serif;
          font-size: 1.0625rem;
          color: rgba(17,17,20,.55);
          margin: 0;
        }

        .met__timeline {
          display: flex;
          flex-direction: column;
        }

        .met-step {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 2.25rem 0;
          border-top: 1px solid rgba(17,17,20,.08);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 800ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .met-step:first-child { border-top: none; }
        .met-step.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (min-width: 1024px) {
          .met-step {
            /* 12-col asymmetric split: number owns real territory (1-4),
               copy sits 5-10, meta counter closes the row at 11-12 —
               replaces the old fixed 2-col layout that left the right
               half of the 1600px canvas empty */
            grid-template-columns: repeat(12, 1fr);
            align-items: center;
            column-gap: 2rem;
            padding: 3.25rem 0;
          }
        }

        .met-step__num-col {
          position: relative;
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
        }
        @media (min-width: 1024px) {
          .met-step__num-col {
            grid-column: 1 / 5;
          }
        }
        .met-step__num {
          font-family: "Fraunces", serif;
          font-weight: 300;
          font-size: clamp(3.25rem, 7vw, 6.5rem);
          line-height: 0.9;
          color: rgba(17,17,20,.14);
        }
        .met-step__rail {
          display: none;
        }
        @media (min-width: 1024px) {
          .met-step__rail {
            display: block;
            flex: 1;
            height: 1px;
            background: rgba(17,17,20,.1);
            align-self: center;
            margin-top: 0.5rem;
          }
        }

        .met-step__content {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        @media (min-width: 1024px) {
          .met-step__content {
            grid-column: 5 / 11;
          }
        }
        .met-step__tag {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent, #C9A24B);
        }
        .met-step__heading {
          font-family: "Fraunces", serif;
          font-weight: 500;
          font-size: clamp(1.5rem, 2.8vw, 2.125rem);
          color: var(--ink, #111114);
          margin: 0;
        }
        .met-step__body {
          font-family: "Inter", sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(17,17,20,.55);
          margin: 0.25rem 0 0;
          max-width: 42ch;
        }

        .met-step__meta {
          display: none;
        }
        @media (min-width: 1024px) {
          .met-step__meta {
            display: block;
            grid-column: 11 / 13;
            justify-self: end;
            font-family: "Inter", sans-serif;
            font-size: 11px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: rgba(17,17,20,.3);
          }
        }
      `}</style>
    </section>
  );
}