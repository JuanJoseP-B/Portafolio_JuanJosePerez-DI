import { useSyncExternalStore } from 'react';

// Real loading progress for the loader: page textures (from the manifest) and the web fonts.
// Plain module state with a tiny subscription, so the scene can report from anywhere without re-rendering it.

// --- Tuning -----------------------------------------------------------------
/** The loader never waits longer than this for the textures (a slow network keeps the numbered placeholders). */
const SAFETY_MS = 12000;
/** Fonts only delay the loader this long. */
const FONTS_MAX_MS = 3000;
const WEIGHT = { manifest: 0.05, textures: 0.85, fonts: 0.1 };
// ------------------------------------------------------------------------------

const state = {
  /** True once the manifest answered (or failed): the number of textures to wait for is known. */
  manifestKnown: false,
  texturesTotal: 0,
  texturesDone: 0,
  fontsReady: false,
  forced: false,
  /** Set by the loader when its fade-out ends: the camera dolly and the hero title wait for it. */
  entered: false,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
export const subscribeLoad = (l: () => void): (() => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

const progress = (): number => {
  if (state.forced) return 1;
  const textures = state.texturesTotal > 0 ? Math.min(1, state.texturesDone / state.texturesTotal) : 1;
  return (
    (state.manifestKnown ? WEIGHT.manifest + WEIGHT.textures * textures : 0) + (state.fontsReady ? WEIGHT.fonts : 0)
  );
};

/** 0..1 in steps of 0.01 (primitive snapshot: React re-renders only when the shown percentage changes). */
export const getProgress = (): number => Math.round(progress() * 100) / 100;
export const isLoadReady = (): boolean =>
  state.forced || (state.manifestKnown && state.texturesDone >= state.texturesTotal && state.fontsReady);
export const isEntered = (): boolean => state.entered;

/** Called by the book textures once the manifest is known: `total` images will be fetched (0 = nothing to wait for). */
export function reportManifest(total: number): void {
  state.manifestKnown = true;
  state.texturesTotal = total;
  emit();
}

/** One texture finished (loaded or failed): a failed one keeps its placeholder and must not stall the loader. */
export function reportTextureSettled(): void {
  state.texturesDone += 1;
  emit();
}

export function markEntered(): void {
  if (state.entered) return;
  state.entered = true;
  emit();
}

export function useLoadProgress(): number {
  return useSyncExternalStore(subscribeLoad, getProgress);
}
export function useLoadReady(): boolean {
  return useSyncExternalStore(subscribeLoad, isLoadReady);
}
export function useEntered(): boolean {
  return useSyncExternalStore(subscribeLoad, isEntered);
}

// --- Fonts + safety net (module load = app start) ---------------------------------------------
if (typeof window !== 'undefined') {
  const done = () => {
    if (state.fontsReady) return;
    state.fontsReady = true;
    emit();
  };
  const fonts = document.fonts;
  if (fonts?.load) {
    const wanted = [
      '500 16px "Inter"',
      '600 16px "Space Grotesk"',
      'italic 16px "Instrument Serif"',
      '500 16px "JetBrains Mono"',
    ];
    void Promise.race([
      Promise.all(wanted.map((font) => fonts.load(font))).then(() => undefined),
      new Promise<void>((resolve) => setTimeout(resolve, FONTS_MAX_MS)),
    ])
      .catch(() => undefined)
      .then(done);
  } else {
    done();
  }

  setTimeout(() => {
    if (!state.forced) {
      state.forced = true;
      emit();
    }
  }, SAFETY_MS);
}
