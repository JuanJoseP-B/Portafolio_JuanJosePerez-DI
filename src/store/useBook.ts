import { create } from 'zustand';
import { clampPage, hashFromPage, pageFromHash } from '../lib/spreads';

type Side = 'left' | 'right' | null;

/** One page at a time: phones and narrow / portrait windows (the open spread would be too small to read). */
export const COMPACT_QUERY = '(max-width: 767px), (max-aspect-ratio: 4/5)';
const isCompact = (): boolean => typeof window !== 'undefined' && window.matchMedia(COMPACT_QUERY).matches;

export type BookState = {
  /** 0 = closed, 1..9 = spreads, 10 = closed from behind. */
  page: number;
  /** Destination while navigating (Phase 3 will flip page by page until it arrives). */
  target: number;
  hoveredSide: Side;
  hoveredHotspot: string | null;
  /** Narrow / portrait viewport: the camera frames a single face of the open spread. */
  compact: boolean;
  /** Face shown in compact mode while a spread is open (reset to the left face whenever the spread changes). */
  faceSide: 'L' | 'R';
  /** One-page mode: the contact form opens in a sheet over the scene (the printed form area is too small to type in). */
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  /** True while any leaf is flipping or waiting to flip (set on navigation, cleared by the book). The Html hotspot layer only exists while false. */
  moving: boolean;
  setTarget: (n: number) => void;
  /** Go one spread forward / back (page 0 -> 1 opens the book, 10 is the back cover). */
  next: () => void;
  prev: () => void;
  /** Compact mode: go one face forward / back (left -> right face of a spread, then the next spread). */
  nextFace: () => void;
  prevFace: () => void;
  setCompact: (compact: boolean) => void;
  setHoveredSide: (side: Side) => void;
  setHoveredHotspot: (id: string | null) => void;
  /** Written by the book only when the value changes (never once per frame). */
  setMoving: (moving: boolean) => void;
  /** Read location.hash into the store (does not write the hash back). */
  syncFromHash: () => void;
};

/**
 * The site always opens on the front cover (page 0) or the welcome spread (page 1): a stale or shared
 * hash such as #contacto must not decide the first page. Rewrites the hash in place (no history entry,
 * no hashchange event) before the store reads it. Later hash changes still navigate normally.
 */
function resetHashOnLoad(): void {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;
  if (pageFromHash(hash) > 1) {
    window.history.replaceState(null, '', `${pathname}${search}${hashFromPage(0)}`);
  }
}

resetHashOnLoad();

const initialPage = (): number =>
  typeof window === 'undefined' ? 0 : pageFromHash(window.location.hash);

export const useBook = create<BookState>()((set, get) => ({
  page: initialPage(),
  target: initialPage(),
  hoveredSide: null,
  hoveredHotspot: null,
  compact: isCompact(),
  faceSide: 'L',
  contactOpen: false,
  moving: false,

  setTarget: (n) => {
    const next = clampPage(n);
    // Phase 1: jump straight to the destination. The leaves start flipping on the next frame; flag it
    // now so the hotspot layer of the old spread is not shown for that frame.
    set({
      target: next,
      page: next,
      faceSide: 'L',
      moving: next !== get().target ? true : get().moving,
    });
    // Only rewrite the hash when it does not already resolve to this page,
    // so aliases (e.g. #experiencia) are kept.
    if (typeof window !== 'undefined' && pageFromHash(window.location.hash) !== next) {
      window.location.hash = hashFromPage(next);
    }
  },

  next: () => get().setTarget(get().target + 1),
  prev: () => get().setTarget(get().target - 1),

  nextFace: () => {
    const { target, faceSide } = get();
    if (target >= 1 && target <= 9 && faceSide === 'L') set({ faceSide: 'R' });
    else get().setTarget(target + 1);
  },
  prevFace: () => {
    const { target, faceSide } = get();
    if (target >= 1 && target <= 9 && faceSide === 'R') {
      set({ faceSide: 'L' });
      return;
    }
    get().setTarget(target - 1);
    // Going back lands on the right face of the previous spread.
    if (target - 1 >= 1 && target - 1 <= 9) set({ faceSide: 'R' });
  },
  setContactOpen: (contactOpen) => set({ contactOpen }),
  setCompact: (compact) => {
    if (get().compact !== compact) set({ compact });
  },

  setHoveredSide: (hoveredSide) => {
    if (get().hoveredSide !== hoveredSide) set({ hoveredSide });
  },
  setHoveredHotspot: (hoveredHotspot) => {
    if (get().hoveredHotspot !== hoveredHotspot) set({ hoveredHotspot });
  },

  setMoving: (moving) => {
    if (get().moving !== moving) set({ moving });
  },

  syncFromHash: () => {
    const next = pageFromHash(window.location.hash);
    const changed = next !== get().target;
    // faceSide only resets when the spread really changes: our own hash writes echo back here.
    set(
      changed
        ? { target: next, page: next, faceSide: 'L', moving: true }
        : { target: next, page: next },
    );
  },
}));

/** Keep the store in sync with browser back/forward and manual hash edits. Returns a cleanup. */
export function initHashSync(): () => void {
  const sync = () => useBook.getState().syncFromHash();
  sync();
  window.addEventListener('hashchange', sync);
  window.addEventListener('popstate', sync);
  return () => {
    window.removeEventListener('hashchange', sync);
    window.removeEventListener('popstate', sync);
  };
}
