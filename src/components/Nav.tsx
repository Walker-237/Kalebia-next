const NAV_LINKS = [
  "À propos",
  "Expertise",
  "Réalisations",
  "Formations",
  "Insights",
  "Méthode",
];

function NavLink({ label }: { label: string }) {
  return (
    <a href="#" className="group relative py-1 text-[13px] text-[#111114]/65">
      <span className="transition-colors duration-300 group-hover:text-[#111114]">
        {label}
      </span>
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#C9A24B] transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}

export function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#111114]/[0.06] bg-[#FAFAF7]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-6 lg:px-16">
        <a href="#" className="font-display text-[15px] tracking-tight">
          Kalebia&nbsp;<span className="text-[#C9A24B]">Nyoue</span>&nbsp;Franck
        </a>
        <nav className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link} label={link} />
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden text-[13px] tracking-[0.02em] text-[#111114]/70 transition-colors hover:text-[#111114] lg:inline"
        >
          Me contacter →
        </a>
      </div>
    </header>
  );
}
