// Route loading fallback. Calm by design — a single pulsing mark and a quiet
// line, no spinner chrome. `motion-safe` keeps it still for reduced-motion.
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center px-6"
    >
      <p className="marginalia inline-flex items-center gap-3 text-[1rem]">
        <span aria-hidden="true" className="text-terracotta motion-safe:animate-pulse">
          ✦
        </span>
        <span className="display-italic text-ink-soft">Carregando…</span>
      </p>
    </div>
  );
}
