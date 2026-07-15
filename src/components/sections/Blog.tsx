"use client";

/**
 * Blog
 * ---------------------------------------------------------------------
 * §7 pattern: "Editorial journal grid — one featured + secondary grid,
 * hover preview image."
 *
 * There's no real photography wired in yet, so the "preview image" slot
 * is a slow CSS-animated gold gradient instead of a placeholder photo —
 * same material as the LiquidEther sections (motion, warmth, gold ramp)
 * but rendered as a cheap looping gradient, not a second WebGL canvas.
 * Swap `.bl-featured-panel`'s background for a real <Image> once there's
 * cover art per post; the layout doesn't need to change.
 *
 * Note: the third post's URL wasn't included in what you pasted (it got
 * cut off after the excerpt) — I inferred
 * `?slug=kpis-community-manager` to match the pattern of the other two.
 * Swap it for the real link.
 */

import { useEffect, useRef, useState } from "react";

interface Post {
  slug: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  href: string;
}

const POSTS: Post[] = [
  {
    slug: "strategie-editoriale",
    date: "15 mars 2026",
    readTime: "6 min",
    title: "Comment construire une stratégie éditoriale qui engage",
    excerpt:
      "Une ligne éditoriale claire est le socle de toute communauté qui dure. Voici ma méthode en 5 étapes.",
    href: "https://nkprod.netlify.app/article.html?slug=strategie-editoriale",
  },
  {
    slug: "gestion-crise-reseaux",
    date: "28 février 2026",
    readTime: "5 min",
    title: "Gestion de crise sur les réseaux : les réflexes qui sauvent",
    excerpt: "Quand la tempête arrive, chaque minute compte. Voici comment réagir sans aggraver la situation.",
    href: "https://nkprod.netlify.app/article.html?slug=gestion-crise-reseaux",
  },
  {
    slug: "kpis-community-manager",
    date: "20 janvier 2026",
    readTime: "7 min",
    title: "Les KPIs qu'un Community Manager doit vraiment suivre",
    excerpt: "Au-delà des likes : les indicateurs qui prouvent votre impact auprès des décideurs.",
    href: "https://nkprod.netlify.app/article.html?slug=kpis-community-manager",
  },
];

/** Same local Reveal pattern used in Formations.tsx / Platforms.tsx —
 * swap for the shared Reveal.tsx if it already exists in this project. */
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

function ArticleLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a className="bl-link" href={href}>
      <span className="bl-link-label">{children}</span>
      <span className="bl-link-arrow" aria-hidden="true">
        →
      </span>
      <span className="bl-link-line" aria-hidden="true" />
    </a>
  );
}

export default function Blog() {
  const header = useReveal<HTMLDivElement>();
  const featured = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();

  const [featuredPost, ...rest] = POSTS;

  return (
    <section id="blog" className="bl-section">
      <div ref={header.ref} className={`bl-header ${header.inView ? "is-in" : ""}`}>
        <span className="bl-marker">06 — BLOG</span>
        <h2 className="bl-heading">
          Blog <em>/</em> Insights
        </h2>
        <p className="bl-lede">Réflexions, méthodes et conseils sur le community management et la gestion de projet.</p>
      </div>

      <div ref={featured.ref} className={`bl-featured ${featured.inView ? "is-in" : ""}`}>
        <div className="bl-featured-panel" aria-hidden="true">
          <span className="bl-featured-panel-mark">01</span>
        </div>
        <div className="bl-featured-text">
          <span className="bl-meta">
            {featuredPost.date} <span className="bl-meta-dot">·</span> {featuredPost.readTime}
          </span>
          <h3 className="bl-featured-title">{featuredPost.title}</h3>
          <p className="bl-excerpt">{featuredPost.excerpt}</p>
          <ArticleLink href={featuredPost.href}>Lire l'article</ArticleLink>
        </div>
      </div>

      <div ref={grid.ref} className={`bl-grid ${grid.inView ? "is-in" : ""}`}>
        {rest.map((post, i) => (
          <article className="bl-post" key={post.slug} style={{ "--stagger": `${i * 120}ms` } as React.CSSProperties}>
            <span className="bl-post-glow" aria-hidden="true" />
            <span className="bl-meta">
              {post.date} <span className="bl-meta-dot">·</span> {post.readTime}
            </span>
            <h3 className="bl-post-title">{post.title}</h3>
            <p className="bl-excerpt">{post.excerpt}</p>
            <ArticleLink href={post.href}>Lire l'article</ArticleLink>
          </article>
        ))}
      </div>

      <style>{`
        .bl-section {
          --bg: #FAFAF7;
          --ink: #111114;
          --accent: #C9A24B;
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          background: var(--bg);
          color: var(--ink);
          padding: clamp(72px, 10vw, 128px) clamp(2rem, 4vw, 4rem);
        }

        .bl-header,
        .bl-featured,
        .bl-grid {
          max-width: 1600px;
          margin: 0 auto;
        }

        .bl-header {
          margin-bottom: clamp(48px, 7vw, 80px);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 800ms var(--ease), transform 800ms var(--ease);
        }

        .bl-header.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .bl-marker {
          display: block;
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: rgba(17, 17, 20, 0.3);
          margin-bottom: 1.25rem;
        }

        .bl-heading {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 340;
          font-size: clamp(32px, 4.8vw, 56px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0 0 1rem;
        }

        .bl-heading em {
          font-style: normal;
          color: var(--accent);
        }

        .bl-lede {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(17, 17, 20, 0.55);
          max-width: 48ch;
          margin: 0;
        }

        /* ---------- featured post ---------- */
        .bl-featured {
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

        .bl-featured.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        .bl-featured-panel {
          grid-column: 1 / span 5;
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          overflow: hidden;
          background: radial-gradient(circle at 30% 25%, #EAD9AE, transparent 55%),
            radial-gradient(circle at 75% 70%, #C9A24B, transparent 60%),
            radial-gradient(circle at 40% 85%, #6E4E1C, transparent 65%), #E7DCC2;
          background-size: 220% 220%, 220% 220%, 220% 220%, auto;
          animation: bl-drift 18s var(--ease) infinite alternate;
        }

        @keyframes bl-drift {
          0% {
            background-position: 20% 10%, 80% 70%, 40% 90%, 0 0;
          }
          100% {
            background-position: 60% 40%, 30% 20%, 70% 30%, 0 0;
          }
        }

        .bl-featured-panel-mark {
          position: absolute;
          bottom: 20px;
          right: 24px;
          font-family: "Fraunces", serif;
          font-weight: 340;
          font-size: 13px;
          letter-spacing: 0.2em;
          color: rgba(17, 17, 20, 0.4);
        }

        .bl-featured-text {
          grid-column: 6 / span 7;
        }

        @media (max-width: 860px) {
          .bl-featured-panel,
          .bl-featured-text {
            grid-column: 1 / span 12;
          }
          .bl-featured-panel {
            aspect-ratio: 16 / 9;
          }
        }

        .bl-meta {
          display: block;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(17, 17, 20, 0.4);
          margin-bottom: 1rem;
        }

        .bl-meta-dot {
          color: var(--accent);
        }

        .bl-featured-title {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-size: clamp(26px, 3.4vw, 40px);
          line-height: 1.16;
          letter-spacing: -0.01em;
          margin: 0 0 1.1rem;
          max-width: 22ch;
        }

        .bl-excerpt {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.65;
          color: rgba(17, 17, 20, 0.55);
          max-width: 46ch;
          margin: 0 0 1.5rem;
        }

        /* ---------- secondary grid ---------- */
        .bl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(32px, 5vw, 64px);
        }

        @media (max-width: 720px) {
          .bl-grid {
            grid-template-columns: 1fr;
          }
        }

        .bl-post {
          position: relative;
          padding-top: clamp(28px, 4vw, 40px);
          border-top: 1px solid rgba(17, 17, 20, 0.08);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms var(--ease) var(--stagger), transform 700ms var(--ease) var(--stagger);
        }

        .bl-grid.is-in .bl-post {
          opacity: 1;
          transform: translateY(0);
        }

        .bl-post-glow {
          position: absolute;
          top: -60px;
          left: -40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201, 162, 75, 0.24), transparent 70%);
          filter: blur(10px);
          opacity: 0;
          transition: opacity 560ms var(--ease);
          pointer-events: none;
          z-index: 0;
        }

        .bl-post:hover .bl-post-glow {
          opacity: 1;
        }

        .bl-post-title {
          position: relative;
          z-index: 1;
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-size: clamp(21px, 2.2vw, 26px);
          line-height: 1.24;
          letter-spacing: -0.005em;
          margin: 0 0 0.9rem;
          max-width: 30ch;
        }

        .bl-post .bl-excerpt {
          position: relative;
          z-index: 1;
          max-width: 42ch;
        }

        /* ---------- link ---------- */
        .bl-link {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
          text-decoration: none;
        }

        .bl-link-arrow {
          transition: transform 420ms var(--ease);
        }

        .bl-link:hover .bl-link-arrow {
          transform: translateX(4px);
        }

        .bl-link-line {
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 420ms var(--ease);
        }

        .bl-link:hover .bl-link-line {
          transform: scaleX(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .bl-header,
          .bl-featured,
          .bl-post {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .bl-featured-panel {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}