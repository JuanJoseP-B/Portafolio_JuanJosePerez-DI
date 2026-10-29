import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LAST_PAGE, SPREADS } from '../lib/spreads';
import { useBook } from '../store/useBook';

const BUTTON =
  'pointer-events-auto grid h-11 w-11 place-items-center rounded-pill border border-glass-border bg-glass text-ink backdrop-blur-md transition-colors hover:border-white/30 disabled:pointer-events-none disabled:opacity-40';

/** One-page (phone) mode: previous / next face buttons with the current section, always reachable by thumb. */
export function FaceNav() {
  const compact = useBook((s) => s.compact);
  const page = useBook((s) => s.page);
  const faceSide = useBook((s) => s.faceSide);
  const nextFace = useBook((s) => s.nextFace);
  const prevFace = useBook((s) => s.prevFace);

  if (!compact) return null;
  const open = page >= 1 && page <= 9;

  return (
    <div
      role="group"
      aria-label="Navegación por páginas"
      className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-3"
    >
      <button type="button" aria-label="Página anterior" className={BUTTON} disabled={page <= 0} onClick={prevFace}>
        <ChevronLeft size={22} strokeWidth={1.5} />
      </button>

      <p
        aria-live="polite"
        className="flex min-w-[8.5rem] max-w-[11rem] flex-col items-center gap-1.5 rounded-pill border border-glass-border bg-glass px-3 py-1.5 text-center text-[11px] text-ink backdrop-blur-md"
      >
        <span className="w-full truncate">{SPREADS[page].label}</span>
        {open && (
          <span aria-hidden="true" className="flex gap-1">
            <span className={`h-1 w-4 rounded-pill ${faceSide === 'L' ? 'bg-accent' : 'bg-white/25'}`} />
            <span className={`h-1 w-4 rounded-pill ${faceSide === 'R' ? 'bg-accent' : 'bg-white/25'}`} />
          </span>
        )}
      </p>

      <button type="button" aria-label="Página siguiente" className={BUTTON} disabled={page >= LAST_PAGE} onClick={nextFace}>
        <ChevronRight size={22} strokeWidth={1.5} />
      </button>
    </div>
  );
}
