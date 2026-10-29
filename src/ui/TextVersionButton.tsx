import { ui } from '../content/portfolio';
import { useBook } from '../store/useBook';

/** Small floating button over the book scene that opens the full text version (which holds the site footer). */
export function TextVersionButton({ onToggleText }: { onToggleText: () => void }) {
  // One-page mode: the bottom row belongs to the face buttons, so this sits just above them, on the left.
  const compact = useBook((s) => s.compact);
  return (
    <button
      type="button"
      onClick={onToggleText}
      className={`pointer-events-auto absolute rounded-pill border border-glass-border bg-glass px-3 py-1.5 text-[11px] text-muted backdrop-blur-md transition-colors hover:border-white/30 hover:text-ink sm:text-xs ${
        compact ? 'bottom-[4.5rem] left-4' : 'bottom-4 right-4 sm:bottom-6 sm:right-10'
      }`}
    >
      {ui.textVersion}
    </button>
  );
}
