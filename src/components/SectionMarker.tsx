export function SectionMarker({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`text-[11px] tracking-[0.3em] text-[#111114]/30 ${className}`}
    >
      {index} — {label}
    </span>
  );
}
