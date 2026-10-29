import { useEffect, useRef, useState } from 'react';
import { markEntered, useLoadProgress, useLoadReady } from '../lib/loadProgress';
import { motion } from '../lib/motion';
import { ui } from '../content/portfolio';

// --- Tuning -----------------------------------------------------------------
/** The loader stays at least this long so a fast load does not flash it. */
const MIN_VISIBLE_MS = 700;
const FADE_MS = 600;
// ------------------------------------------------------------------------------

/**
 * Full-screen loader over the scene: monogram, real progress (page textures + fonts) and a fade-out.
 * When it starts fading the camera begins its entry dolly (`markEntered`). It never covers the text version:
 * `hidden` removes it, and it offers a shortcut to that version while the scene loads.
 */
export function Loader({ hidden, onSkipToText }: { hidden: boolean; onSkipToText: () => void }) {
  const progress = useLoadProgress();
  const ready = useLoadReady();
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading');
  const startedAt = useRef(performance.now());

  // Ready (and shown long enough): fade out after two frames, so the scene has drawn at least once.
  useEffect(() => {
    if (!ready || phase !== 'loading' || hidden) return;
    let first = 0;
    let second = 0;
    const timer = window.setTimeout(
      () => {
        first = requestAnimationFrame(() => {
          second = requestAnimationFrame(() => {
            markEntered();
            setPhase('leaving');
          });
        });
      },
      motion.reduced ? 0 : Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt.current)),
    );
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [ready, phase, hidden]);

  useEffect(() => {
    if (phase !== 'leaving') return;
    const timer = window.setTimeout(() => setPhase('gone'), motion.reduced ? 0 : FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Went straight to the text version: the book still gets its entry when the visitor comes back.
  useEffect(() => {
    if (hidden) markEntered();
  }, [hidden]);

  if (hidden || phase === 'gone') return null;

  const percent = Math.round(progress * 100);
  const leaving = phase === 'leaving';

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8 bg-void px-6"
      style={{ opacity: leaving ? 0 : 1, transition: `opacity ${FADE_MS}ms ease`, pointerEvents: leaving ? 'none' : 'auto' }}
    >
      <div
        aria-hidden="true"
        className="grid h-24 w-24 place-items-center rounded-full border-2 border-accent/80 font-display text-3xl font-bold text-ink"
      >
        JJ
      </div>

      <div className="w-full max-w-xs">
        <div
          role="progressbar"
          aria-label="Progreso de carga"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-1 w-full overflow-hidden rounded-pill bg-white/10"
        >
          <div
            className="h-full origin-left bg-accent"
            style={{ transform: `scaleX(${progress})`, transition: 'transform 200ms ease-out' }}
          />
        </div>
        <p className="mt-3 flex justify-between font-mono text-xs uppercase tracking-[0.12em] text-muted">
          <span>Abriendo el libro</span>
          <span aria-hidden="true">{percent}%</span>
        </p>
        {/* Announced in quarters so a screen reader is not interrupted on every percent. */}
        <p role="status" className="sr-only">
          Cargando el portafolio, {Math.floor(percent / 25) * 25} %
        </p>
      </div>

      <button
        type="button"
        onClick={onSkipToText}
        className="rounded-pill border border-glass-border bg-glass px-4 py-2 text-xs text-muted transition-colors hover:border-white/30 hover:text-ink"
      >
        {ui.textVersion}
      </button>
    </div>
  );
}
