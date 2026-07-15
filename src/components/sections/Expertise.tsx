"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionMarker } from "@/components/SectionMarker";
import { GhostType } from "@/components/GhostType";
import { EditorialLink } from "@/components/EditorialLink";

type Skill = {
  label: string;
  detail: string;
};

const COMMUNITY_SKILLS: Skill[] = [
  { label: "Stratégie éditoriale", detail: "Ligne de contenu, calendrier, ton de marque" },
  { label: "Croissance organique", detail: "Communautés de 0 à 100K, sans achat média" },
  { label: "Community management", detail: "Modération, animation, réponse à l'audience" },
  { label: "Partenariats créateurs", detail: "Sourcing, négociation, suivi de campagne" },
];

const PROJECT_SKILLS: Skill[] = [
  { label: "Direction de marque", detail: "Positionnement, identité verbale, cohérence" },
  { label: "Gestion de projet", detail: "Cadrage, delivery, coordination multi-équipes" },
  { label: "Production de contenu", detail: "Direction artistique, tournage, montage" },
  { label: "Reporting & data", detail: "KPIs, lecture d'audience, itération" },
];

/**
 * LiquidGlassCard
 * Stacked optical layers instead of one blurred div:
 *   1. transmission   — base translucency + light blur, lets color from
 *                        behind bleed through softly
 *   2. diffusion       — a second, heavier blur masked to fade out toward
 *                        the center, so the middle reads clearer and blur
 *                        intensifies toward the perimeter (curved-glass cue)
 *   3. reflections     — top sheen + a specular glint that tracks the
 *                        cursor + small corner highlights
 *   4. edge refraction — a conic-gradient "border": bright at the top rim,
 *                        fading to almost nothing at the bottom, standing
 *                        in for a flat border color
 *   5. shadowing       — inset AO top/bottom to imply material thickness,
 *                        plus a soft diffuse outer contact shadow
 */
function LiquidGlassCard({
  skill,
  align = "left",
}: {
  skill: Skill;
  align?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 30, y: 20 });
  const [hovering, setHovering] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`group relative isolate overflow-hidden rounded-[30px] px-7 py-8 flex flex-col gap-2 transition-transform duration-[650ms] ${
        hovering ? "-translate-y-1.5" : "translate-y-0"
      } ${align === "right" ? "sm:text-right sm:items-end" : ""}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {/* 1. transmission */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 backdrop-blur-[6px]"
        style={{
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.10) 100%)",
        }}
      />

      {/* 2. diffusion — stronger blur, masked to fade toward the center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 backdrop-blur-2xl"
        style={{
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 40%, transparent 30%, black 88%)",
          maskImage:
            "radial-gradient(120% 120% at 50% 40%, transparent 30%, black 88%)",
        }}
      />

      {/* internal diffusion bloom — faint veiling, not a flat tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5] mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(65% 55% at 30% 20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      {/* 3a. top sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-80"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 60%)",
        }}
      />

      {/* 3b. specular glint — follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-[650ms]"
        style={{
          opacity: hovering ? 0.75 : 0.35,
          background: `radial-gradient(180px 180px at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 65%)`,
        }}
      />

      {/* 3c. corner highlights */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-2 -left-2 h-16 w-16 opacity-60 mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -right-3 h-14 w-14 opacity-30 mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)" }}
      />

      {/* 4. edge refraction — conic "border": bright top rim fading to
          near-nothing at the bottom, instead of a flat border color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[30px] transition-opacity duration-[650ms]"
        style={{
          padding: 1,
          background:
            "conic-gradient(from 200deg at 50% 50%, rgba(255,255,255,0.85) 0deg, rgba(255,255,255,0.05) 90deg, rgba(255,255,255,0.02) 180deg, rgba(255,255,255,0.05) 270deg, rgba(255,255,255,0.85) 360deg)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: hovering ? 1 : 0.75,
        }}
      />

      {/* 5. shadowing — inner AO to fake thickness + soft outer contact shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[30px]"
        style={{
          boxShadow:
            "inset 0 1px 1px rgba(255,255,255,0.5), inset 0 14px 20px -18px rgba(255,255,255,0.6), inset 0 -16px 22px -18px rgba(17,17,20,0.18)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 -z-40 rounded-[36px] transition-opacity duration-[650ms]"
        style={{
          boxShadow: hovering
            ? "0 28px 45px -20px rgba(17,17,20,0.35)"
            : "0 16px 30px -18px rgba(17,17,20,0.25)",
        }}
      />

      {/* content — crisp, unblurred, hierarchy via opacity not blur */}
      <span className="relative font-[Inter] font-medium text-base md:text-lg text-ink drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
        {skill.label}
      </span>
      <span className="relative font-[Inter] font-light text-sm text-ink/70 leading-relaxed">
        {skill.detail}
      </span>

      <div className="relative mt-1 h-px w-8 origin-left scale-x-100 bg-[var(--accent)]/70 transition-transform duration-500 group-hover:scale-x-150" />
    </div>
  );
}

function SkillColumn({
  heading,
  subheading,
  skills,
  align = "left",
  delayStart = 0,
}: {
  heading: string;
  subheading: string;
  skills: Skill[];
  align?: "left" | "right";
  delayStart?: number;
}) {
  return (
    <div className={align === "right" ? "lg:text-right" : ""}>
      <Reveal delay={delayStart}>
        <p className="text-[11px] tracking-[0.3em] text-white/40 mb-4">
          {subheading}
        </p>
      </Reveal>

      <Reveal delay={delayStart + 80}>
        <h3 className="font-[Fraunces] font-light text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-white mb-12">
          {heading}
        </h3>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {skills.map((skill, i) => (
          <Reveal key={skill.label} delay={delayStart + 160 + i * 120}>
            <LiquidGlassCard skill={skill} align={align} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Expertise() {
  return (
    <section id="expertise" className="relative overflow-hidden py-24 lg:py-40 px-8 lg:px-16 bg-[var(--bg)]">
      <div className="relative max-w-[1600px] mx-auto">
        <Reveal>
          <SectionMarker index="03" label="EXPERTISE" />
        </Reveal>

        {/* Dark, color-rich panel behind the glass grid — the flat off-white
            page background gives the material nothing to refract, so this
            section gets its own backdrop for the cards to sit on. */}
        <div className="relative mt-10 lg:mt-16 rounded-[40px] overflow-hidden px-6 py-10 sm:px-12 sm:py-12 lg:px-16 lg:py-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(120% 90% at 15% 0%, #2b2440 0%, #171625 45%, #0d0c14 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-70"
            style={{
              background:
                "radial-gradient(45% 55% at 85% 15%, rgba(201,162,75,0.25) 0%, rgba(201,162,75,0) 60%), radial-gradient(40% 45% at 10% 85%, rgba(120,90,190,0.35) 0%, rgba(120,90,190,0) 65%)",
            }}
          />
          <GhostType
            words={[
              { word: "COMMUNAUTÉ", top: "4%", left: "-2%", size: "clamp(4rem,11vw,9rem)", opacity: 0.06 },
              { word: "MARQUE", top: "60%", left: "46%", size: "clamp(4rem,11vw,9rem)", opacity: 0.06 },
            ]}
            parallaxFactor={-0.04}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
            <div className="lg:col-span-6">
              <SkillColumn
                heading="Communauté"
                subheading="LE LIEN HUMAIN"
                skills={COMMUNITY_SKILLS}
                align="left"
                delayStart={0}
              />
            </div>

            <div className="hidden lg:block lg:col-span-1 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
            </div>

            <div className="lg:col-span-5">
              <SkillColumn
                heading="Projet"
                subheading="LA MARQUE EN MOUVEMENT"
                skills={PROJECT_SKILLS}
                align="left"
                delayStart={120}
              />
            </div>
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-10 lg:mt-16 flex justify-start">
            <EditorialLink href="#realisations">
              Voir les réalisations
            </EditorialLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}