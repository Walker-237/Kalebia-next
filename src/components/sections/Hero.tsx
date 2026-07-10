"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { GhostType, GhostWord } from "@/components/GhostType";
import { SectionMarker } from "@/components/SectionMarker";
import { MagneticButton } from "@/components/MagneticButton";
import { EditorialLink } from "@/components/EditorialLink";

const SOCIALS = ["Instagram", "TikTok", "LinkedIn", "WhatsApp"];

const DECORATIVE_WORDS: GhostWord[] = [
  { word: "COMMUNITY", top: "4%", left: "-6%", size: "12rem", opacity: 0.045 },
  { word: "PROJET", top: "38%", left: "10%", size: "11rem", opacity: 0.04 },
  { word: "STRATEGY", top: "70%", left: "-4%", size: "9rem", opacity: 0.035 },
];

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const onHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setParallax({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={onHeroMove}
      className="relative min-h-screen overflow-hidden pt-40 pb-24"
    >
      <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-8 lg:grid-cols-12 lg:px-16">
        {/* ───────────── Left / editorial column ───────────── */}
        <div className="relative flex flex-col justify-center lg:col-span-5 lg:pt-10">
          <GhostType words={DECORATIVE_WORDS} />

          <SectionMarker
            index="01"
            label="DOUALA, CAMEROUN · FR / EN"
            className="fade-up delay-0 relative z-10 mb-8"
          />

          {/* editorial eyebrow */}
          <div className="fade-up delay-1 relative z-10 mb-12 flex flex-col gap-3">
            <span className="h-px w-full bg-gradient-to-r from-[#C9A24B]/70 via-[#C9A24B]/20 to-transparent" />
            <span className="text-[11px] font-light tracking-[0.32em] text-[#8A6C22] uppercase">
              Community Manager · Project Manager
            </span>
            <span className="h-px w-full bg-gradient-to-r from-[#C9A24B]/70 via-[#C9A24B]/20 to-transparent" />
          </div>

          {/* headline */}
          <h1 className="relative z-10 mb-10 select-none">
            <span className="reveal-line font-display text-[13vw] leading-[0.9] font-light text-[#111114] sm:text-[6.5vw] lg:text-[3.2vw]">
              <span className="delay-2">
                Des communautés qui{" "}
                <em className="text-[#C9A24B] not-italic">vibrent.</em>
              </span>
            </span>
            <span className="reveal-line font-display -mt-1 ml-[6%] text-[13vw] leading-[0.9] font-normal text-[#111114] sm:text-[6.5vw] lg:text-[3.2vw]">
              <span className="delay-3">
                Des projets qui{" "}
                <em className="text-[#C9A24B] not-italic">aboutissent.</em>
              </span>
            </span>
          </h1>

          <p className="fade-up delay-4 relative z-10 mb-12 max-w-[30ch] text-[15px] leading-[1.9] text-[#111114]/55">
            J&apos;accompagne les marques à transformer une audience
            en communauté engagée, et une idée en projet livré, du
            cadrage à la mesure.
          </p>

          <div className="fade-up delay-5 relative z-10 flex flex-col items-start gap-6">
            <MagneticButton href="#contact" variant="solid">
              Travaillons ensemble
            </MagneticButton>
            <EditorialLink href="#realisations">
              Voir mes réalisations
            </EditorialLink>
          </div>

          <div className="fade-up delay-6 relative z-10 mt-16 flex items-center gap-4 text-[#111114]/40">
            {SOCIALS.map((s, i) => (
              <span key={s} className="flex items-center gap-4">
                <a
                  href="#"
                  className="group relative text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:text-[#111114]"
                >
                  {s}
                  <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[#C9A24B] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
                {i < SOCIALS.length - 1 && (
                  <span className="text-[#111114]/15">/</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* ───────────── Right / portrait ───────────── */}
        <div className="relative lg:col-span-7">
          <div
            className="fade-up delay-2 relative mx-auto -mt-8 h-[62vh] w-full max-w-[560px] lg:absolute lg:top-1/2 lg:right-[-4vw] lg:mt-0 lg:h-[128%] lg:w-[46vw] lg:max-w-none lg:-translate-y-1/2"
            style={{
              transform: `translate(${parallax.x * 10}px, ${parallax.y * 8}px)`,
            }}
          >
            <Image
              src="/hero-kalebia.png"
              alt="Kalebia Nyoue Franck, Community Manager & Project Manager à Douala"
              fill
              priority
              className="object-contain object-bottom drop-shadow-[0_40px_60px_rgba(17,17,20,0.12)] lg:object-right-bottom"
              sizes="(min-width: 1024px) 46vw, 90vw"
            />
          </div>

          <div className="fade-up delay-6 absolute bottom-6 left-1/2 z-20 w-fit -translate-x-1/2 rounded-full border border-white/40 bg-white/30 px-5 py-2.5 text-[11px] tracking-[0.08em] text-[#111114]/70 backdrop-blur-md lg:left-auto lg:right-[8vw] lg:translate-x-0">
            Basé à Douala · Disponible pour missions
          </div>
        </div>
      </div>
    </section>
  );
}
