import { useEffect, useRef, useState } from 'react';
import { markEntered, useLoadReady } from '../lib/loadProgress';
import { initialHoldMs } from '../lib/loadingMotion';
import { motion } from '../lib/motion';
import { getUi } from '../content/portfolio';
import { useLanguage } from '../store/useLanguage';
import { LoadingSkeleton } from './LoadingSkeleton';

// --- Tuning -----------------------------------------------------------------
const FADE_MS = 600;
// ------------------------------------------------------------------------------

/**
 * Full-screen loader over the scene, driven by texture and font readiness.
 * When it starts fading the camera begins its entry dolly (`markEntered`). It never covers the text version:
 * `hidden` removes it, and it offers a shortcut to that version while the scene loads.
 */
export function Loader({ hidden, onSkipToText }: { hidden: boolean; onSkipToText: () => void }) {
  const lang = useLanguage((s) => s.lang);
  const ui = getUi(lang);
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
      initialHoldMs(performance.now() - startedAt.current, motion.reduced),
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

  const leaving = phase === 'leaving';

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8 bg-void px-6"
      style={{ opacity: leaving ? 0 : 1, transition: `opacity ${FADE_MS}ms ease`, pointerEvents: leaving ? 'none' : 'auto' }}
    >
      <LoadingSkeleton mode="book" />

      <div className="relative mt-auto w-full max-w-xs">
        <p role="status" className="text-center font-mono text-xs uppercase tracking-[0.12em] text-muted">
          {lang === 'en' ? 'Opening the book' : 'Abriendo el libro'}
        </p>
      </div>

      <button
        type="button"
        onClick={onSkipToText}
        className="relative mb-8 rounded-pill border border-glass-border bg-glass px-4 py-2 text-xs text-muted transition-colors hover:border-white/30 hover:text-ink"
      >
        {ui.textVersion}
      </button>
    </div>
  );
}
