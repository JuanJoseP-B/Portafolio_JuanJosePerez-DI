import { useLanguage } from '../store/useLanguage';
import { getUi } from '../content/portfolio';

/** Opens the text portfolio; positioning is handled by Overlay. */
export function TextVersionButton({ onToggleText }: { onToggleText: () => void }) {
  const { lang } = useLanguage();
  const t = getUi(lang);
  return (
    <button
      type="button"
      onClick={onToggleText}
      className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-pill border border-accent bg-accent px-4 py-2 text-xs font-semibold text-void shadow-[0_0_22px_rgba(92,225,230,0.3)] transition-colors hover:border-white hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {t.textVersion}
      <span aria-hidden="true">→</span>
    </button>
  );
}
