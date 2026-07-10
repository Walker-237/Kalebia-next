export function EditorialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 text-[13px] tracking-[0.03em] text-[#111114]/60 transition-colors duration-300 hover:text-[#111114]"
    >
      <span className="relative">
        {children}
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#111114]/40 transition-transform duration-400 ease-out group-hover:scale-x-100" />
      </span>
      <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}
