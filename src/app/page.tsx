import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { EditorialIntro } from "@/components/sections/Editorialintro";
import Expertise from "@/components/sections/Expertise";
import SocialPlatformsOrbit from "@/components/sections/Socialplatformsorbit";
import Blog from "@/components/sections/Blog";
import Formations from "@/components/sections/Formations";
import Impact from "@/components/sections/Impact";
import Methode from "@/components/sections/Methode";
import Temoignages from "@/components/sections/Temoignages";
import Partenaires from "@/components/sections/Partenaires";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#111114]">
      <Nav />
      <Hero />
      <EditorialIntro />
      <Expertise />
      <SocialPlatformsOrbit />
      <Blog />
      <Formations />
      <Impact />
      <Methode />
      <Temoignages />
      <Partenaires />
      <Contact />
    </div>
  );
}