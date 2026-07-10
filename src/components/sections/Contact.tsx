"use client";

import { useRef, useState, type MouseEvent } from "react";
import { SectionMarker } from "../shared/SectionMarker";

const CV_URL =
  "https://nkprod.netlify.app/assets/CV-Kalebia-Nyoue-Franck.pdf?v=2";
const WHATSAPP_URL =
  "https://wa.me/237600000000?text=Bonjour%20Kalebia%2C%20je%20souhaite%20discuter%20d%27une%20collaboration.";
const EMAIL = "bonjour@kalebia.dev";

function MagneticCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const cap = 10;
    setPos({
      x: Math.max(-cap, Math.min(cap, relX * 0.3)),
      y: Math.max(-cap, Math.min(cap, relY * 0.3)),
    });
  }

  function handleLeave() {
    setPos({ x: 0, y: 0 });
  }

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="con__cta"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <span className="con__cta-sweep" />
      <span className="con__cta-label">{children}</span>
    </a>
  );
}

export default function Contact() {
  return (
    <section className="con" id="contact">
      <span className="con__ghost" aria-hidden="true">
        Parlons-en
      </span>

      <div className="con__inner">
        <SectionMarker index="11" label="Contact" tone="dark" />

        <h2 className="con__title">Construisons votre communauté.</h2>
        <p className="con__sub">
          Un projet, une campagne ou une communauté à faire grandir ?
          Parlons-en.
        </p>

        <div className="con__actions">
          <MagneticCTA href={CV_URL}>Télécharger le CV</MagneticCTA>

          <div className="con__quiet-links">
            <a className="con__link" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <a
              className="con__link"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="con__signature">
          <span className="con__sig-name">Kalebia Nyoue Franck</span>
          <span className="con__sig-role">
            Community Manager &amp; Project Manager — Douala, Cameroun
          </span>
          <span className="con__sig-copy">© 2026</span>
        </div>
      </div>

      <style>{`
        .con {
          position: relative;
          background: var(--ink, #111114);
          color: var(--bg, #FAFAF7);
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 6rem 2rem;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .con { padding: 6rem 4rem; }
        }

        .con__ghost {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: "Fraunces", serif;
          font-weight: 300;
          font-size: clamp(6rem, 22vw, 20rem);
          color: rgba(250,250,247,.04);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          line-height: 1;
        }

        .con__inner {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .con__title {
          font-family: "Fraunces", serif;
          font-weight: 400;
          font-size: clamp(2.75rem, 7vw, 5.5rem);
          line-height: 1.05;
          margin: 0.5rem 0 0;
          max-width: 14ch;
        }
        .con__sub {
          font-family: "Inter", sans-serif;
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          color: rgba(250,250,247,.55);
          max-width: 42ch;
          margin: 0;
        }

        .con__actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2.5rem;
          margin-top: 1.5rem;
        }

        .con__cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ink, #111114);
          background: var(--bg, #FAFAF7);
          padding: 1.1rem 2.5rem;
          text-decoration: none;
          overflow: hidden;
          transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .con__cta-label { position: relative; z-index: 1; }
        .con__cta-sweep {
          position: absolute;
          inset: 0;
          background: var(--accent, #C9A24B);
          transform: translateX(-100%);
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .con__cta:hover .con__cta-sweep {
          transform: translateX(0);
        }

        .con__quiet-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .con__link {
          position: relative;
          width: fit-content;
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          color: rgba(250,250,247,.7);
          text-decoration: none;
        }
        .con__link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 100%;
          height: 1px;
          background: var(--accent, #C9A24B);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .con__link:hover::after { transform: scaleX(1); }
        .con__link:hover { color: var(--bg, #FAFAF7); }

        .con__signature {
          margin-top: 3.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(250,250,247,.1);
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem 1.25rem;
        }
        .con__sig-name {
          font-family: "Fraunces", serif;
          font-style: italic;
          font-size: 1.125rem;
          color: rgba(250,250,247,.85);
        }
        .con__sig-role,
        .con__sig-copy {
          font-family: "Inter", sans-serif;
          font-size: 0.8125rem;
          color: rgba(250,250,247,.4);
        }
      `}</style>
    </section>
  );
}