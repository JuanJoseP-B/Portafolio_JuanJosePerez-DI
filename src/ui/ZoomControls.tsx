import { useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { resetZoom, zoomStep } from '../scene/zoomActions';
import { BUTTON_ZOOM_STEP, ZOOM_CLICK_BLOCK, ZOOM_MAX, ZOOM_MIN, subscribeZoom, zoomState } from '../scene/zoomCamera';
import { useBook } from '../store/useBook';

// Snapshots are primitives, so React re-renders only when the shown value (0.1x steps) or a threshold changes.
const levelSnapshot = () => Math.round(zoomState.level * 10) / 10;
const arrowsSnapshot = () => zoomState.level >= ZOOM_CLICK_BLOCK;

const glassButton =
  'pointer-events-auto grid h-9 w-9 place-items-center rounded-pill border border-glass-border bg-glass text-muted backdrop-blur-md transition-all duration-150 hover:border-white/30 hover:text-ink disabled:pointer-events-none disabled:opacity-40';

/** Zoom level, +/- and reset (bottom right) plus side arrows to turn pages while zoomed in. */
export function ZoomControls() {
  const page = useBook((s) => s.page);
  const next = useBook((s) => s.next);
  const prev = useBook((s) => s.prev);
  const compact = useBook((s) => s.compact);
  const level = useSyncExternalStore(subscribeZoom, levelSnapshot);
  const arrows = useSyncExternalStore(subscribeZoom, arrowsSnapshot);

  if (page < 1 || page > 9) return null;

  return (
    <>
      <div
        role="group"
        aria-label="Zoom"
        className="pointer-events-none absolute bottom-16 right-4 flex items-center gap-2 sm:bottom-[4.5rem] sm:right-10"
      >
        <button
          type="button"
          aria-label="Alejar"
          className={glassButton}
          disabled={level <= ZOOM_MIN}
          onClick={() => zoomStep(1 / BUTTON_ZOOM_STEP)}
        >
          <ZoomOut size={16} strokeWidth={1.5} />
        </button>
        <span
          aria-live="polite"
          className="min-w-[3.25rem] rounded-pill border border-glass-border bg-glass px-3 py-2 text-center font-mono text-xs text-ink backdrop-blur-md"
        >
          {level.toFixed(1)}×
        </span>
        <button
          type="button"
          aria-label="Acercar"
          className={glassButton}
          disabled={level >= ZOOM_MAX}
          onClick={() => zoomStep(BUTTON_ZOOM_STEP)}
        >
          <ZoomIn size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="Restablecer zoom"
          className={glassButton}
          disabled={level <= ZOOM_MIN}
          onClick={resetZoom}
        >
          <RotateCcw size={16} strokeWidth={1.5} />
        </button>
      </div>

      {arrows && !compact && (
        <>
          <button
            type="button"
            aria-label="Página anterior"
            className={`${glassButton} absolute left-3 top-1/2 h-12 w-12 -translate-y-1/2 sm:left-6`}
            disabled={page <= 1}
            onClick={prev}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Página siguiente"
            className={`${glassButton} absolute right-3 top-1/2 h-12 w-12 -translate-y-1/2 sm:right-6`}
            disabled={page >= 9}
            onClick={next}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}
    </>
  );
}
