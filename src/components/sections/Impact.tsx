"use client";

import { useReveal, useCountUp } from "../shared/useReveal";
import { SectionMarker } from "../shared/SectionMarker";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  // how to render the number: raw digits, or "K" shorthand (250 -> "250K+")
  displayAs?: "raw" | "years";
}

const FLAGSHIP: Stat = {
  target: 250,
  suffix: "K+",
  label: "vues organiques générées",
};

const SUPPORTING: Stat[] = [
  { target: 40, suffix: "+", label: "projets & campagnes livrés" },
  { target: 12, suffix: "", label: "communautés animées" },
  { target: 6, suffix: " ans", label: "au service des marques" },
];

function StatBlock({
  stat,
  visible,
  size,
  delay,
}: {
  stat: Stat;
  visible: boolean;
  size: "flagship" | "supporting";
  delay: number;
}) {
  const value = useCountUp(stat.target, visible, 1500);

  return (
    <div
      className={`impact-stat impact-stat--${size} ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`impact-stat__number impact-stat__number--${size}`}>
        {value}
        {stat.suffix}
      </div>
      <div className="impact-stat__label">{stat.label}</div>
    </div>
  );
}

export default function Impact() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.25);

  return (
    <section className="impact" id="impact">
      <div className="impact__inner">
        <div className="impact__head">
          <SectionMarker index="07" label="Impact" />
          <h2 className="impact__title">Des chiffres, pas des promesses.</h2>
        </div>

        <div className="impact__grid" ref={ref}>
          <div className="impact__flagship-col">
            <StatBlock stat={FLAGSHIP} visible={visible} size="flagship" delay={0} />
          </div>

          <div className="impact__supporting-col">
            {SUPPORTING.map((stat, i) => (
              <StatBlock
                key={stat.label}
                stat={stat}
                visible={visible}
                size="supporting"
                delay={140 + i * 120}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .impact {
          background: var(--bg, #FAFAF7);
          padding: 8rem 2rem;
        }
        @media (min-width: 1024px) {
          .impact { padding: 10rem 4rem; }
        }
        .impact__inner {
          max-width: 1600px;
          margin: 0 auto;
        }
        .impact__head {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 5rem;
          max-width: 720px;
        }
        .impact__title {
          font-family: "Fraunces", serif;
          font-weight: 400;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          line-height: 1.15;
          color: var(--ink, #111114);
          margin: 0;
        }

        .impact__grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 2rem 3rem;
          align-items: start;
        }

        .impact__flagship-col {
          grid-column: span 12;
          border-top: 1px solid rgba(17,17,20,.08);
          padding-top: 2rem;
        }
        .impact__supporting-col {
          grid-column: span 12;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem 3rem;
        }
        @media (min-width: 1024px) {
          .impact__flagship-col { grid-column: span 7; }
          .impact__supporting-col {
            grid-column: span 5;
            grid-template-columns: 1fr;
            border-top: 1px solid rgba(17,17,20,.08);
            padding-top: 2rem;
          }
        }
        @media (max-width: 1023px) {
          .impact__supporting-col {
            border-top: 1px solid rgba(17,17,20,.08);
            padding-top: 2rem;
          }
        }

        .impact-stat {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .impact-stat.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .impact-stat__number {
          font-family: "Fraunces", serif;
          font-weight: 300;
          color: var(--ink, #111114);
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }
        .impact-stat__number--flagship {
          font-size: clamp(4.5rem, 11vw, 9rem);
        }
        .impact-stat__number--supporting {
          font-size: clamp(2.75rem, 5vw, 3.75rem);
        }

        .impact-stat__label {
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          color: rgba(17,17,20,.55);
          margin-top: 0.75rem;
          max-width: 26ch;
        }

        .impact-stat--supporting + .impact-stat--supporting {
          margin-top: 0;
        }
        .impact__supporting-col .impact-stat {
          padding-bottom: 1.5rem;
        }
        .impact__supporting-col .impact-stat + .impact-stat {
          border-top: 1px solid rgba(17,17,20,.06);
          padding-top: 1.5rem;
        }
      `}</style>
    </section>
  );
}