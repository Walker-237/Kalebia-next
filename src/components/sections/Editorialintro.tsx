"use client";

import { GhostType, GhostWord } from "@/components/GhostType";
import { SectionMarker } from "@/components/SectionMarker";
import { Reveal } from "@/components/Reveal";

const DECORATIVE_WORDS: GhostWord[] = [
  { word: "GENS", top: "2%", left: "62%", size: "10rem", opacity: 0.04 },
  { word: "MARQUES", top: "48%", left: "-4%", size: "11rem", opacity: 0.04 },
  { word: "DÉLAIS", top: "80%", left: "55%", size: "9rem", opacity: 0.035 },
];

export function EditorialIntro() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-44">
      <GhostType words={DECORATIVE_WORDS} parallaxFactor={-0.03} />

      <div className="relative z-10 mx-auto max-w-[1600px] px-8 lg:px-16">
        <Reveal>
          <SectionMarker index="02" label="À PROPOS" className="mb-16 block" />
        </Reveal>

        {/* Massive wrapped sentence — the centerpiece */}
        <Reveal delay={100}>
          <h2 className="font-display max-w-[22ch] text-[11vw] leading-[1.02] font-light text-[#111114] sm:text-[7vw] lg:max-w-[17ch] lg:text-[4.6vw]">
            Je fais le lien entre{" "}
            <em className="text-[#C9A24B] not-italic">les gens</em>, les{" "}
            <em className="text-[#C9A24B] not-italic">marques</em> et les{" "}
            <em className="text-[#C9A24B] not-italic">délais</em>.
          </h2>
        </Reveal>

        {/* Supporting copy — wraps around the statement, asymmetrically */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 lg:col-start-1">
            <Reveal delay={150}>
              <p className="font-display text-xl leading-snug font-normal text-[#111114] lg:text-2xl">
                Une double casquette, une seule logique : faire
                avancer les projets et les communautés.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-6">
            <Reveal delay={250}>
              <p className="text-[15px] leading-[1.9] text-[#111114]/55">
                À la croisée du contenu, de la stratégie et de la
                coordination, j&apos;aide les équipes à construire des
                communautés vivantes et à mener leurs projets jusqu&apos;au
                lancement.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <Reveal delay={350}>
              <p className="text-[15px] leading-[1.9] text-[#111114]/55">
                Mon terrain de jeu : les réseaux sociaux, les
                calendriers éditoriaux, les campagnes, et tout ce qui
                transforme une bonne idée en résultat mesurable.
              </p>
              <p className="mt-6 text-[11px] tracking-[0.2em] text-[#111114]/35 uppercase">
                Bilingue Français / English — Douala
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}