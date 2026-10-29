import { useEffect } from 'react';
import { COMPACT_QUERY, useBook } from '../store/useBook';

/** Keeps `compact` in the book store in sync with the viewport (rotation, window resize). Mount once. */
export function useCompactMode(): void {
  useEffect(() => {
    const media = window.matchMedia(COMPACT_QUERY);
    const sync = () => useBook.getState().setCompact(media.matches);
    sync();
    if (media.addEventListener) media.addEventListener('change', sync);
    else media.addListener(sync);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', sync);
      else media.removeListener(sync);
    };
  }, []);
}
