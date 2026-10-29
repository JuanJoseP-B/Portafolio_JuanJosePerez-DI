// Live view of the `prefers-reduced-motion` setting for code that cannot re-render (useFrame, listeners).

const QUERY = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches;

/** Mutable on purpose: read inside useFrame without subscribing. Kept up to date by the listener below. */
export const motion = { reduced: prefersReducedMotion() };

if (typeof window !== 'undefined') {
  const media = window.matchMedia(QUERY);
  const update = () => {
    motion.reduced = media.matches;
  };
  // Safari < 14 only has the deprecated addListener.
  if (media.addEventListener) media.addEventListener('change', update);
  else media.addListener(update);
}
