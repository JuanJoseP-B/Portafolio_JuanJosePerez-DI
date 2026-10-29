const BUTTON =
  'rounded-pill border border-glass-border bg-glass px-4 py-2 text-sm text-ink transition-colors hover:border-white/30';

/** Banner at the top of the text version when it is shown instead of the 3D book. */
export function FallbackNotice({ reason, onRetry }: { reason: 'unsupported' | 'error'; onRetry?: () => void }) {
  return (
    <div role="alert" className="border-b border-accent-warm/40 bg-surface px-4 py-3 text-sm text-ink sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p>
          {reason === 'unsupported'
            ? 'Tu navegador no permite gráficos 3D (WebGL), así que te mostramos la versión de texto del portafolio.'
            : 'No se pudo iniciar el libro 3D, así que te mostramos la versión de texto del portafolio.'}
        </p>
        {onRetry && (
          <button type="button" className={BUTTON} onClick={onRetry}>
            Reintentar el libro 3D
          </button>
        )}
      </div>
    </div>
  );
}

/** Shown while the browser has taken the graphics context away mid-session (it hides itself if it comes back). */
export function ContextLostNotice({ onRetry, onText }: { onRetry: () => void; onText: () => void }) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="context-lost-title"
      className="pointer-events-auto fixed inset-0 z-[65] grid place-items-center bg-void/85 px-6 backdrop-blur-sm"
    >
      <div className="max-w-sm rounded-xl border border-glass-border bg-surface p-6 text-center shadow-glass">
        <h2 id="context-lost-title" className="font-display text-xl font-semibold text-ink">
          Se perdió la escena 3D
        </h2>
        <p className="mt-2 text-sm text-muted">
          El navegador detuvo los gráficos (suele pasar por poca memoria). Puedes reintentar o leer la versión de texto.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" className={`${BUTTON} bg-white text-black hover:bg-[#e8eaf0]`} onClick={onRetry}>
            Reintentar
          </button>
          <button type="button" className={BUTTON} onClick={onText}>
            Ver versión texto
          </button>
        </div>
      </div>
    </div>
  );
}
