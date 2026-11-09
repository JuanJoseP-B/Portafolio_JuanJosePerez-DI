import { useLanguage } from '../store/useLanguage';
import { getUi } from '../content/portfolio';

/** Small floating button that opens the full text version. Positioning is handled by the parent wrapper in Overlay. */
export function TextVersionButton({ onToggleText }: { onToggleText: () => void }) {
  const { lang } = useLanguage();
  const t = getUi(lang);
  return (
    <button
      type="button"
      onClick={onToggleText}
      className="pointer-events-auto rounded-pill border border-glass-border bg-glass px-3 py-1.5 text-[11px] text-muted backdrop-blur-md transition-colors hover:border-white/30 hover:text-ink sm:text-xs"
    >
      {t.textVersion}
    </button>
  );
}
