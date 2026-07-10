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

function StepRow({ step, delay }: { step: Step; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.35);

  return (
    <div
      ref={ref}
      className={`met-step ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="met-step__rail">
        <span className="met-step__num">{step.index}</span>
        <span className="met-step__dot" />
      </div>

      <div className="met-step__content">
        <span className="met-step__tag">{step.tag}</span>
        <h3 className="met-step__heading">{step.heading}</h3>
        <p className="met-step__body">{step.body}</p>
      </div>
    </div>
  );
}

export default function Methode() {
  return (
    <section className="met" id="methode">
      <div className="met__inner">
        <div className="met__head">
          <SectionMarker index="08" label="Méthode" />
          <h2 className="met__title">Comment je travaille, en quatre temps.</h2>
          <p className="met__sub">
            Un fil clair, du premier brief jusqu&rsquo;à l&rsquo;itération.
          </p>
        </div>

        <div className="met__timeline">
          <div className="met__line" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <StepRow key={step.index} step={step} delay={i * 60} />
          ))}
        </div>
      </div>

      <style>{`
        .met {
          background: var(--bg, #FAFAF7);
          padding: 8rem 2rem;
        }
        @media (min-width: 1024px) {
          .met { padding: 10rem 4rem; }
        }
        .met__inner {
          max-width: 1600px;
          margin: 0 auto;
        }
        .met__head {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 640px;
          margin-bottom: 5rem;
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
          position: relative;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
        }

        .met__line {
          position: absolute;
          left: 1.75rem;
          top: 0.6rem;
          bottom: 3rem;
          width: 1px;
          background: rgba(17,17,20,.1);
        }
        @media (min-width: 1024px) {
          .met__line { left: 3.75rem; }
        }

        .met-step {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 3.5rem 1fr;
          gap: 1.5rem;
          padding: 2.5rem 0;
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
            grid-template-columns: 7.5rem minmax(0, 8fr);
            padding: 3rem 0;
          }
        }

        .met-step__rail {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .met-step__num {
          font-family: "Fraunces", serif;
          font-weight: 300;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          color: rgba(17,17,20,.28);
        }
        .met-step__dot {
          display: none;
        }

        .met-step__content {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-width: 640px;
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
          font-size: clamp(1.375rem, 2.6vw, 1.875rem);
          color: var(--ink, #111114);
          margin: 0;
        }
        .met-step__body {
          font-family: "Inter", sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(17,17,20,.55);
          margin: 0.25rem 0 0;
        }
      `}</style>
    </section>
  );
}