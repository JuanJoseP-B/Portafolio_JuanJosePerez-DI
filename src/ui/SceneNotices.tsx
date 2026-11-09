import { useLanguage } from '../store/useLanguage';

const BUTTON =
  'rounded-pill border border-glass-border bg-glass px-4 py-2 text-sm text-ink transition-colors hover:border-white/30';

/** Banner at the top of the text version when it is shown instead of the 3D book. */
export function FallbackNotice({ reason, onRetry }: { reason: 'unsupported' | 'error'; onRetry?: () => void }) {
  const lang = useLanguage((s) => s.lang);
  return (
    <div role="alert" className="border-b border-accent-warm/40 bg-surface px-4 py-3 text-sm text-ink sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p>
          {lang === 'en' ? (reason === 'unsupported'
            ? 'Your browser does not support 3D graphics (WebGL), so the text version is shown.'
            : 'The 3D book could not start, so the text version is shown.') : reason === 'unsupported'
            ? 'Tu navegador no permite gráficos 3D (WebGL), así que te mostramos la versión de texto del portafolio.'
            : 'No se pudo iniciar el libro 3D, así que te mostramos la versión de texto del portafolio.'}
        </p>
        {onRetry && (
          <button type="button" className={BUTTON} onClick={onRetry}>
            {lang === 'en' ? 'Retry the 3D book' : 'Reintentar el libro 3D'}
          </button>
        )}
      </div>
    </div>
  );
}

/** Shown while the browser has taken the graphics context away mid-session (it hides itself if it comes back). */
export function ContextLostNotice({ onRetry, onText }: { onRetry: () => void; onText: () => void }) {
  const lang = useLanguage((s) => s.lang);
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="context-lost-title"
      className="pointer-events-auto fixed inset-0 z-[65] grid place-items-center bg-void/85 px-6 backdrop-blur-sm"
    >
      <div className="max-w-sm rounded-xl border border-glass-border bg-surface p-6 text-center shadow-glass">
        <h2 id="context-lost-title" className="font-display text-xl font-semibold text-ink">
          {lang === 'en' ? '3D scene unavailable' : 'Se perdió la escena 3D'}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {lang === 'en' ? 'The browser stopped the graphics. You can retry or read the text version.' : 'El navegador detuvo los gráficos (suele pasar por poca memoria). Puedes reintentar o leer la versión de texto.'}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" className={`${BUTTON} bg-white text-black hover:bg-[#e8eaf0]`} onClick={onRetry}>
            {lang === 'en' ? 'Retry' : 'Reintentar'}
          </button>
          <button type="button" className={BUTTON} onClick={onText}>
            {lang === 'en' ? 'View text version' : 'Ver versión texto'}
          </button>
        </div>
      </div>
    </div>
  );
}

