import { useLanguage } from '../store/useLanguage';

/**
 * Small pill that toggles between ES and EN.
 * Designed to sit next to other floating controls without clashing with the aesthetic.
 */
export function LanguageButton({ className = '' }: { className?: string }) {
  const { lang, toggle } = useLanguage();
  const next = lang === 'es' ? 'EN' : 'ES';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch language to ${next}`}
      className={`pointer-events-auto rounded-pill border border-glass-border bg-glass px-3 py-1.5 text-[11px] text-muted backdrop-blur-md transition-colors hover:border-white/30 hover:text-ink sm:text-xs ${className}`}
    >
      <span aria-hidden="true" className="font-mono tracking-wider">
        {lang.toUpperCase()} / {next}
      </span>
    </button>
  );
}

