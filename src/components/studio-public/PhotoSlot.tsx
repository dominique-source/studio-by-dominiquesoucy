/**
 * Honest placeholder for a photographic slot the approved maquettes show as
 * a real athlete/action photograph. The animation kit (Studio_by_Dominique
 * _Soucy_Animation_Kit.zip) ships atmosphere textures, glow graphics and
 * hand-drawn marks — but no actual photography. Rather than fabricate a
 * fake photo, this renders a clearly-a-placeholder panel sized and framed
 * exactly like the reference slot, ready to receive a real <img> the moment
 * one is supplied. It is not a broken <img> — nothing here 404s.
 */
export function PhotoSlot({
  label,
  aspect = "4 / 5",
  torn = false,
  className = "",
}: {
  label: string;
  aspect?: string;
  torn?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#12161d] via-[#0a0d12] to-[#05070a] ${className}`}
      style={{
        aspectRatio: aspect,
        clipPath: torn ? "polygon(2% 0%, 100% 3%, 98% 100%, 0% 97%)" : undefined,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-30">
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M4 20c1.4-4 4.4-6 8-6s6.6 2 8 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <p className="max-w-[80%] text-[10px] font-medium uppercase tracking-[0.14em] text-white/25">{label}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,120,255,0.08),transparent_60%)]" />
    </div>
  );
}
