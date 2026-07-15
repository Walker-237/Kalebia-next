"use client";

import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { SectionMarker } from "../shared/SectionMarker";
import { apiRequest, ApiError } from "@/lib/apiClient";

const EMPTY_MESSAGE = { name: "", email: "", subject: "", message: "" };

function MessageForm() {
  const [form, setForm] = useState(EMPTY_MESSAGE);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof EMPTY_MESSAGE>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      await apiRequest("/messages", {
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          subject: form.subject.trim() || undefined,
          message: form.message,
        },
      });
      setStatus("sent");
      setForm(EMPTY_MESSAGE);
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue. Réessayez.");
    }
  }

  if (status === "sent") {
    return (
      <p className="con__form-success" role="status">
        Merci — votre message a bien été envoyé. Réponse sous 24 à 48h.
      </p>
    );
  }

  return (
    <form className="con__form" onSubmit={handleSubmit}>
      <div className="con__form-row">
        <input
          className="con__input"
          placeholder="Votre nom"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <input
          className="con__input"
          type="email"
          placeholder="Votre email"
          required
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </div>
      <input
        className="con__input"
        placeholder="Sujet (optionnel)"
        value={form.subject}
        onChange={(e) => set("subject", e.target.value)}
      />
      <textarea
        className="con__input con__textarea"
        placeholder="Votre message"
        required
        rows={4}
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
      />
      {error && <p className="con__form-error">{error}</p>}
      <button type="submit" className="con__cta con__form-submit" disabled={status === "submitting"}>
        <span className="con__cta-sweep" />
        <span className="con__cta-label">{status === "submitting" ? "Envoi…" : "Envoyer le message"}</span>
      </button>
    </form>
  );
}

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

export function ContactView({
  cvUrl,
  whatsappUrl,
  email,
}: {
  cvUrl: string | null;
  whatsappUrl: string | null;
  email: string | null;
}) {
  return (
    <section className="con" id="contact">
      <span className="con__ghost" aria-hidden="true">
        Parlons-en
      </span>

      <div className="con__inner">
        <SectionMarker index="12" label="Contact" tone="dark" />

        <h2 className="con__title">Construisons votre communauté.</h2>
        <p className="con__sub">
          Un projet, une campagne ou une communauté à faire grandir ?
          Parlons-en.
        </p>

        <div className="con__actions">
          {cvUrl && <MagneticCTA href={cvUrl}>Télécharger le CV</MagneticCTA>}

          <div className="con__quiet-links">
            {email && (
              <a className="con__link" href={`mailto:${email}`}>
                {email}
              </a>
            )}
            {whatsappUrl && (
              <a
                className="con__link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <MessageForm />

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

        .con__form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 640px;
          margin-top: 1rem;
        }
        .con__form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 640px) {
          .con__form-row { grid-template-columns: 1fr; }
        }
        .con__input {
          width: 100%;
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          color: var(--bg, #FAFAF7);
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(250,250,247,.2);
          padding: 0.75rem 0.25rem;
          outline: none;
          transition: border-color 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .con__input::placeholder {
          color: rgba(250,250,247,.4);
        }
        .con__input:focus {
          border-color: var(--accent, #C9A24B);
        }
        .con__textarea {
          resize: vertical;
          font-family: "Inter", sans-serif;
        }
        .con__form-submit {
          align-self: flex-start;
          margin-top: 0.5rem;
          border: none;
          cursor: pointer;
        }
        .con__form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .con__form-error {
          font-family: "Inter", sans-serif;
          font-size: 0.875rem;
          color: #E08585;
          margin: 0;
        }
        .con__form-success {
          font-family: "Inter", sans-serif;
          font-size: 1rem;
          color: var(--accent, #C9A24B);
          max-width: 640px;
          margin: 1rem 0 0;
        }

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
