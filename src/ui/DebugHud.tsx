import { useEffect, useState } from 'react';
import { SPREADS } from '../lib/spreads';
import { useBook } from '../store/useBook';

/** Dev-only panel to inspect and drive the book state (page <-> hash). */
export function DebugHud() {
  const page = useBook((s) => s.page);
  const target = useBook((s) => s.target);
  const setTarget = useBook((s) => s.setTarget);
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <aside
      aria-label="Panel de depuración (solo desarrollo)"
      className="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-2rem)] rounded-md border border-glass-border bg-surface/90 p-3 font-mono text-xs text-ink shadow-glass backdrop-blur"
    >
      <p className="mb-2 text-muted">
        dev · page <span className="text-accent">{page}</span> · target{' '}
        <span className="text-accent">{target}</span> · hash{' '}
        <span className="text-accent">{hash || '(vacío)'}</span>
      </p>
      <div className="flex flex-wrap gap-1">
        {SPREADS.map((s) => (
          <button
            key={s.page}
            type="button"
            title={s.label}
            onClick={() => setTarget(s.page)}
            className={`h-7 min-w-7 rounded-sm border px-2 transition-colors ${
              s.page === page
                ? 'border-accent text-accent'
                : 'border-glass-border text-muted hover:text-ink'
            }`}
          >
            {s.page}
          </button>
        ))}
      </div>
    </aside>
  );
}
