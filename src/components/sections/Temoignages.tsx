"use client";

import { useState } from "react";
import { useReveal } from "../shared/useReveal";
import { SectionMarker } from "../shared/SectionMarker";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Kalebia a donné une voix à notre marque et de la rigueur à nos projets.",
    name: "Marie N.",
    role: "Directrice marketing",
  },
  {
    quote:
      "Une vraie professionnelle : réactive, créative et toujours orientée résultats.",
    name: "Jean-Paul M.",
    role: "Fondateur",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="tem-stars" role={onChange ? "radiogroup" : undefined}>
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          aria-label={`${s} étoile${s > 1 ? "s" : ""}`}
          className={`tem-star ${s <= value ? "is-filled" : ""} ${
            onChange ? "is-interactive" : ""
          }`}
          onClick={onChange ? () => onChange(s) : undefined}
          tabIndex={onChange ? 0 : -1}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Temoignages() {
  const [active, setActive] = useState(0);
  const { ref: spotlightRef, visible: spotlightVisible } =
    useReveal<HTMLDivElement>(0.3);
  const { ref: formRef, visible: formVisible } = useReveal<HTMLDivElement>(0.2);

  const [formRating, setFormRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const current = TESTIMONIALS[active];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="tem" id="temoignages">
      <div className="tem__inner">
        <div className="tem__head">
          <SectionMarker index="09" label="Témoignages" />
          <h2 className="tem__title">Ce qu&rsquo;ils en disent</h2>
          <div className="tem__rating">
            <span className="tem__rating-num">5.0</span>
            <StarRating value={5} />
            <span className="tem__rating-count">(2 avis)</span>
          </div>
        </div>

        <div className="tem__spotlight" ref={spotlightRef}>
          <span className="tem__ghost-quote" aria-hidden="true">
            &ldquo;
          </span>

          <div
            className={`tem__slide ${spotlightVisible ? "is-visible" : ""}`}
            key={active}
          >
            <p className="tem__quote">{current.quote}</p>
            <div className="tem__signature">
              <span className="tem__avatar">{initials(current.name)}</span>
              <div className="tem__sig-text">
                <span className="tem__name">{current.name}</span>
                <span className="tem__role">{current.role}</span>
              </div>
            </div>
          </div>

          <div className="tem__nav">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                className={`tem__nav-dot ${i === active ? "is-active" : ""}`}
                aria-label={`Avis de ${t.name}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>

        <div
          className={`tem__form-wrap ${formVisible ? "is-visible" : ""}`}
          ref={formRef}
        >
          <h3 className="tem__form-title">Déposer un avis</h3>

          {submitted ? (
            <p className="tem__thanks">
              Merci — votre avis a bien été reçu.
            </p>
          ) : (
            <form className="tem__form" onSubmit={handleSubmit}>
              <div className="tem__field-row">
                <label className="tem__field">
                  <span>Nom</span>
                  <input type="text" name="name" required />
                </label>
                <label className="tem__field">
                  <span>Poste</span>
                  <input type="text" name="role" />
                </label>
                <label className="tem__field">
                  <span>Entreprise</span>
                  <input type="text" name="company" />
                </label>
              </div>

              <div className="tem__field tem__field--rating">
                <span>Note</span>
                <StarRating value={formRating} onChange={setFormRating} />
              </div>

              <label className="tem__field tem__field--comment">
                <span>Commentaire</span>
                <textarea name="comment" rows={3} required />
              </label>

              <button type="submit" className="tem__submit">
                Envoyer mon avis
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .tem {
          background: var(--bg, #FAFAF7);
          padding: 8rem 2rem;
        }
        @media (min-width: 1024px) {
          .tem { padding: 10rem 4rem; }
        }
        .tem__inner {
          max-width: 1600px;
          margin: 0 auto;
        }
        .tem__head {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 4rem;
        }
        .tem__title {
          font-family: "Fraunces", serif;
          font-weight: 400;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          color: var(--ink, #111114);
          margin: 0;
        }
        .tem__rating {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: "Inter", sans-serif;
        }
        .tem__rating-num {
          font-family: "Fraunces", serif;
          font-size: 1.25rem;
          color: var(--ink, #111114);
        }
        .tem__rating-count {
          font-size: 0.875rem;
          color: rgba(17,17,20,.4);
        }
        .tem-stars {
          display: inline-flex;
          gap: 0.15rem;
        }
        .tem-star {
          background: none;
          border: none;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
          color: rgba(17,17,20,.15);
          cursor: default;
        }
        .tem-star.is-filled { color: var(--accent, #C9A24B); }
        .tem-star.is-interactive {
          cursor: pointer;
          font-size: 1.375rem;
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tem-star.is-interactive:hover { transform: scale(1.15); }

        .tem__spotlight {
          position: relative;
          max-width: 900px;
          padding: 3rem 0 2.5rem;
          border-top: 1px solid rgba(17,17,20,.08);
          border-bottom: 1px solid rgba(17,17,20,.08);
          overflow: hidden;
        }
        .tem__ghost-quote {
          position: absolute;
          top: -3.5rem;
          left: -1rem;
          font-family: "Fraunces", serif;
          font-weight: 300;
          font-size: 14rem;
          line-height: 1;
          color: rgba(17,17,20,.05);
          pointer-events: none;
          user-select: none;
        }
        .tem__slide {
          position: relative;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tem__slide.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tem__quote {
          font-family: "Fraunces", serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          line-height: 1.35;
          color: var(--ink, #111114);
          margin: 0 0 2.5rem;
          max-width: 22ch;
        }
        .tem__signature {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .tem__avatar {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          border: 1px solid rgba(17,17,20,.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          color: rgba(17,17,20,.55);
          flex-shrink: 0;
        }
        .tem__sig-text {
          display: flex;
          flex-direction: column;
        }
        .tem__name {
          font-family: "Inter", sans-serif;
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--ink, #111114);
        }
        .tem__role {
          font-family: "Inter", sans-serif;
          font-size: 0.8125rem;
          color: rgba(17,17,20,.4);
        }

        .tem__nav {
          display: flex;
          gap: 0.5rem;
          margin-top: 2rem;
        }
        .tem__nav-dot {
          width: 1.5rem;
          height: 1px;
          background: rgba(17,17,20,.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tem__nav-dot.is-active {
          background: var(--accent, #C9A24B);
          width: 2.25rem;
        }

        .tem__form-wrap {
          max-width: 640px;
          margin-top: 5rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 800ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tem__form-wrap.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tem__form-title {
          font-family: "Fraunces", serif;
          font-weight: 500;
          font-size: 1.375rem;
          color: var(--ink, #111114);
          margin: 0 0 1.75rem;
        }
        .tem__form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .tem__field-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .tem__field-row { grid-template-columns: repeat(3, 1fr); }
        }
        .tem__field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-family: "Inter", sans-serif;
        }
        .tem__field > span {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(17,17,20,.4);
        }
        .tem__field input,
        .tem__field textarea {
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          color: var(--ink, #111114);
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(17,17,20,.15);
          padding: 0.5rem 0;
          resize: none;
          transition: border-color 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tem__field input:focus,
        .tem__field textarea:focus {
          outline: none;
          border-bottom-color: var(--accent, #C9A24B);
        }
        .tem__field--rating {
          flex-direction: row;
          align-items: center;
          gap: 0.9rem;
        }

        .tem__submit {
          align-self: flex-start;
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--bg, #FAFAF7);
          background: var(--ink, #111114);
          border: none;
          padding: 0.9rem 2rem;
          cursor: pointer;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
                      background 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tem__submit:hover {
          background: var(--accent, #C9A24B);
          transform: translateY(-2px);
        }

        .tem__thanks {
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          color: rgba(17,17,20,.55);
        }
      `}</style>
    </section>
  );
}