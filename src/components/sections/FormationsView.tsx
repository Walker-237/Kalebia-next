"use client";

/**
 * FormationsView
 * ---------------------------------------------------------------------
 * Card grid — each course shows its cover image and a short excerpt.
 * Clicking a card opens a modal with the full description, image, and a
 * "Vous voulez participer ?" CTA that collects an email and sends a
 * participation request to the admin inbox (POST /messages) rather than
 * jumping to the generic contact section.
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest, ApiError } from "@/lib/apiClient";

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: string;
}

function formatPrice(price: string): string {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return `${n.toLocaleString("fr-FR")} €`;
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

function ParticipateForm({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      await apiRequest("/messages", {
        method: "POST",
        body: {
          name: "Demande de participation",
          email,
          subject: `Participation à la formation : ${course.title}`,
          message: `L'utilisateur avec l'email ${email} veut participer à la formation "${course.title}".`,
        },
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue. Réessayez.");
    }
  }

  if (status === "sent") {
    return (
      <p className="fm-modal-success" role="status">
        Merci — votre demande a bien été envoyée. Réponse sous 24 à 48h.
      </p>
    );
  }

  if (!expanded) {
    return (
      <button type="button" className="fm-modal-cta" onClick={() => setExpanded(true)}>
        Vous voulez participer ?
      </button>
    );
  }

  return (
    <form className="fm-modal-form" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Votre email"
        className="fm-modal-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      {error && <p className="fm-modal-error">{error}</p>}
      <button type="submit" className="fm-modal-cta" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}

function FormationCard({ index, course, onOpen }: { index: number; course: Course; onOpen: () => void }) {
  const { ref, inView } = useReveal<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      type="button"
      className={`fm-card ${inView ? "is-in" : ""}`}
      style={{ "--stagger": `${index * 100}ms` } as React.CSSProperties}
      onClick={onOpen}
    >
      <div className="fm-card-panel">
        <Image src={course.image} alt={course.title} fill sizes="(min-width: 720px) 30vw, 92vw" className="fm-card-img" />
      </div>
      <span className="fm-card-meta">
        {course.duration} · {formatPrice(course.price)}
      </span>
      <h3 className="fm-card-title">{course.title}</h3>
      <p className="fm-card-excerpt">{course.description}</p>
    </button>
  );
}

export function FormationsView({ courses }: { courses: Course[] }) {
  const header = useReveal<HTMLDivElement>();
  const [selected, setSelected] = useState<Course | null>(null);

  if (courses.length === 0) return null;

  return (
    <section id="formations" className="fm-section">
      <div ref={header.ref} className={`fm-header ${header.inView ? "is-in" : ""}`}>
        <span className="fm-marker">07 — FORMATIONS</span>
        <h2 className="fm-heading">Mes formations</h2>
        <p className="fm-lede">
          Des parcours concrets pour maîtriser le community management et les réseaux sociaux.
        </p>
      </div>

      <div className="fm-grid">
        {courses.map((course, i) => (
          <FormationCard key={course.id} index={i} course={course} onOpen={() => setSelected(course)} />
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="fm-modal max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <div className="fm-modal-panel">
                <Image src={selected.image} alt={selected.title} fill sizes="(min-width: 640px) 32rem, 92vw" className="fm-modal-img" />
              </div>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription className="fm-modal-meta">
                  {selected.duration} · {formatPrice(selected.price)}
                </DialogDescription>
              </DialogHeader>
              <p className="fm-modal-desc">{selected.description}</p>
              <ParticipateForm key={selected.id} course={selected} />
            </>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        .fm-section {
          --bg: #FAFAF7;
          --ink: #111114;
          --accent: #C9A24B;
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          background: var(--bg);
          color: var(--ink);
          padding: clamp(72px, 10vw, 128px) clamp(2rem, 4vw, 4rem);
        }

        .fm-header {
          max-width: 1600px;
          margin: 0 auto clamp(48px, 7vw, 80px);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 800ms var(--ease), transform 800ms var(--ease);
        }

        .fm-header.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .fm-marker {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: rgba(17, 17, 20, 0.3);
        }

        .fm-heading {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 340;
          font-size: clamp(32px, 4.8vw, 60px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .fm-lede {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(17, 17, 20, 0.55);
          max-width: 46ch;
          margin: 0;
        }

        .fm-grid {
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(32px, 4vw, 48px);
        }

        @media (max-width: 1024px) {
          .fm-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .fm-grid { grid-template-columns: 1fr; }
        }

        .fm-card {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: block;
          text-align: left;
          width: 100%;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms var(--ease) var(--stagger), transform 700ms var(--ease) var(--stagger);
        }

        .fm-card.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .fm-card-panel {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 4px;
          overflow: hidden;
          background: #E7DCC2;
          margin-bottom: 1.25rem;
        }

        .fm-card-img {
          object-fit: cover;
          transition: transform 600ms var(--ease);
        }

        .fm-card:hover .fm-card-img {
          transform: scale(1.04);
        }

        .fm-card-meta {
          display: block;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.75rem;
        }

        .fm-card-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.24;
          letter-spacing: -0.005em;
          margin: 0 0 0.6rem;
        }

        .fm-card-excerpt {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(17, 17, 20, 0.55);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .fm-modal-panel {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: 6px;
          overflow: hidden;
          background: #E7DCC2;
          margin-bottom: 1rem;
        }

        .fm-modal-img {
          object-fit: cover;
        }

        .fm-modal-meta {
          font-family: "Inter", sans-serif;
          font-size: 13px;
          color: var(--accent);
        }

        .fm-modal-desc {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(17, 17, 20, 0.7);
          margin: 0.5rem 0 1.25rem;
          white-space: pre-line;
        }

        .fm-modal-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--bg);
          background: var(--ink);
          border: none;
          border-radius: 999px;
          padding: 0.85rem 1.75rem;
          cursor: pointer;
          transition: background-color 300ms var(--ease);
        }

        .fm-modal-cta:hover {
          background: var(--accent);
        }

        .fm-modal-cta:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fm-modal-form {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .fm-modal-input {
          flex: 1 1 200px;
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          padding: 0.85rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(17, 17, 20, 0.15);
          outline: none;
          background: transparent;
          color: var(--ink);
        }

        .fm-modal-input:focus {
          border-color: var(--accent);
        }

        .fm-modal-error {
          width: 100%;
          font-family: "Inter", sans-serif;
          font-size: 0.8125rem;
          color: #C0392B;
          margin: 0;
        }

        .fm-modal-success {
          font-family: "Inter", sans-serif;
          font-size: 0.9375rem;
          color: var(--accent);
          margin: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .fm-header,
          .fm-card {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .fm-card-img {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
