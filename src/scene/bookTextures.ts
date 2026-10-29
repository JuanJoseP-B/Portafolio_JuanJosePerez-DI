import { SRGBColorSpace, TextureLoader, type Texture } from 'three';
import { reportManifest, reportTextureSettled } from '../lib/loadProgress';
import {
  FACES,
  PAGES_MANIFEST_URL,
  backCoverFileUrl,
  backCoverMobileUrl,
  pageFile2xUrl,
  pageFileMobileUrl,
  pageFileUrl,
  type FaceSpec,
  type PagesManifest,
} from './bookLayout';
import { makeCanvasTexture, mulberry32 } from './textures';

export const COVER_COLOR = '#12151f';
export const PAPER_COLOR = '#e6e0d2';

// Placeholder pages keep the 1600x1100 page aspect (1.4545).
const PLACEHOLDER_W = 768;
const PLACEHOLDER_H = 528;

// --- Zoom sharpness: 2x faces (3200x2200) only for the visible spread ---------------------
const HIRES_LOAD_LEVEL = 1.4; // start loading the visible spread's 2x faces above this zoom
const HIRES_RELEASE_LEVEL = 1.2; // release every 2x face at or below this zoom (hysteresis vs. load)
const HIRES_MAX_FACES = 4; // 2x faces kept in GPU memory at once (each ~28 MB + mipmaps)
const HIRES_KEEP_SPREADS = 1; // an already loaded 2x face stays while within this many spreads of the target
// ------------------------------------------------------------------------------------------

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function drawFace(spec: FaceSpec): Draw {
  return (ctx, w, h) => {
    const dark = spec.theme === 'dark';
    ctx.fillStyle = dark ? '#0d1018' : '#f7f5ef';
    ctx.fillRect(0, 0, w, h);

    // Frame, so the page edge reads clearly while flipping.
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = dark ? '#f4f6fb' : '#1b1813';
    ctx.font = `700 ${Math.round(h * 0.46)}px "Space Grotesk", system-ui, sans-serif`;
    ctx.fillText(String(spec.id).padStart(2, '0'), w / 2, h * 0.45);

    ctx.fillStyle = dark ? '#9aa3b5' : '#5e564a';
    ctx.font = `500 ${Math.round(h * 0.055)}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.fillText(spec.label, w / 2, h * 0.76);
    if (spec.spread !== null) {
      const side = spec.side === 'L' ? 'IZQUIERDA' : 'DERECHA';
      ctx.fillText(`SPREAD ${spec.spread} · ${side}`, w / 2, h * 0.86);
    }

    // Gutter shading next to the spine.
    if (spec.side) {
      const gutter = w * 0.1;
      const x0 = spec.side === 'L' ? w - gutter : gutter;
      const x1 = spec.side === 'L' ? w : 0;
      const grad = ctx.createLinearGradient(x0, 0, x1, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.28)');
      ctx.fillStyle = grad;
      ctx.fillRect(spec.side === 'L' ? w - gutter : 0, 0, gutter, h);
    }
  };
}

function paintCloth(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  const rand = mulberry32(seed);
  ctx.fillStyle = COVER_COLOR;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
  }
}

/** Front cover: foil monogram in a ring and the title underneath. */
const drawCover: Draw = (ctx, w, h) => {
  paintCloth(ctx, w, h, 21);
  const cx = w / 2;
  const cy = h / 2 - 20;
  ctx.strokeStyle = 'rgba(92,225,230,0.85)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 78, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f4f6fb';
  ctx.font = '700 74px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JJ', cx, cy + 4);

  ctx.fillStyle = 'rgba(92,225,230,0.8)';
  ctx.font = '500 26px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('Juan José — Portafolio 2026', cx, cy + 135);
};

/** Back cover (exterior): small foil text. Final contact details arrive in Fase 5. */
const drawBackCover: Draw = (ctx, w, h) => {
  paintCloth(ctx, w, h, 33);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f4f6fb';
  ctx.font = '700 64px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('CONTACTO', w / 2, h * 0.42);
  ctx.fillStyle = 'rgba(92,225,230,0.8)';
  ctx.font = '500 26px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('[EMAIL] · GitHub · LinkedIn', w / 2, h * 0.52);
  ctx.fillText('Hecho con React Three Fiber', w / 2, h * 0.9);
};

export interface BookTextures {
  /** Index = face id; faces 0 is unused (the cover has its own texture). */
  faces: (Texture | null)[];
  cover: Texture;
  backCover: Texture;
  /**
   * Zoom level + target page -> loads / releases the 2x images of the visible spread.
   * Cheap to call on every zoom change; it keeps its own hysteresis.
   */
  updateHiRes: (level: number, page: number) => void;
  dispose: () => void;
}

/** Null when the manifest is missing (e.g. nothing exported yet) or the dev server answered with HTML. */
async function fetchManifest(): Promise<PagesManifest | null> {
  try {
    const res = await fetch(`${PAGES_MANIFEST_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return null;
    const data = (await res.json()) as PagesManifest;
    return Array.isArray(data?.faces) ? data : null;
  } catch {
    return null;
  }
}

/**
 * Replaces the pixels of an existing placeholder texture with an exported image.
 * The Texture object stays the same, so materials already holding it pick the image up;
 * `dispose()` first because the GPU storage of the placeholder has a different size.
 */
function swapImage(
  loader: TextureLoader,
  target: Texture,
  url: string,
  anisotropy: number,
  isDisposed: () => boolean,
  onApplied?: (image: unknown) => void,
) {
  loader.load(
    url,
    (loaded) => {
      reportTextureSettled();
      if (isDisposed()) {
        loaded.dispose();
        return;
      }
      target.dispose();
      target.image = loaded.image;
      target.colorSpace = SRGBColorSpace;
      target.anisotropy = anisotropy;
      target.needsUpdate = true;
      onApplied?.(loaded.image);
    },
    undefined,
    reportTextureSettled, // keep the placeholder if one image fails to load; the loader must not wait for it
  );
}

/**
 * `mobile` loads the 800x550 images as the base and, while zoomed in, the regular 1600x1100 ones in place
 * of the 2x ones (the sharper step on a phone), so a phone never holds more than a few large textures.
 */
export function createBookTextures(maxAnisotropy: number, mobile = false): BookTextures {
  const loader = new TextureLoader();
  let disposed = false;

  const faces = FACES.map((spec): Texture | null => {
    if (spec.id === 0) return null;
    const tex = makeCanvasTexture(PLACEHOLDER_W, PLACEHOLDER_H, drawFace(spec));
    tex.anisotropy = maxAnisotropy;
    return tex;
  });

  const cover = makeCanvasTexture(1400, 962, drawCover);
  const backCover = makeCanvasTexture(1400, 962, drawBackCover);
  cover.anisotropy = maxAnisotropy;
  backCover.anisotropy = maxAnisotropy;

  // --- 2x faces for zoom ---------------------------------------------------------------
  // A face texture is one Texture object whose pixels get swapped: placeholder -> 1x image -> 2x image
  // (while zoomed) -> back to the stored 1x image. `dispose()` before each swap frees the old GPU storage.
  type HiState = 'idle' | 'loading' | 'high';
  let manifestInfo: PagesManifest | null = null;
  const lowImage: unknown[] = []; // the 1x image of each face once applied
  const hiState: HiState[] = FACES.map(() => 'idle');
  const hiWanted: boolean[] = FACES.map(() => false);
  const hiFailed: boolean[] = FACES.map(() => false);
  const hiUsed: number[] = FACES.map(() => 0); // last time (counter) the face was part of the visible spread
  let hiClock = 0;
  let hiActive = false;
  let hiLevel = 1;
  let hiPage = 0;

  const loadHi = (id: number, tex: Texture) => {
    hiState[id] = 'loading';
    loader.load(
      mobile ? pageFileUrl(id, manifestInfo?.version ?? 0) : pageFile2xUrl(id, manifestInfo?.version ?? 0),
      (loaded) => {
        if (disposed || !hiWanted[id]) {
          loaded.dispose();
          hiState[id] = 'idle';
          return;
        }
        tex.dispose();
        tex.image = loaded.image;
        tex.needsUpdate = true;
        hiState[id] = 'high';
      },
      undefined,
      () => {
        hiState[id] = 'idle';
        hiFailed[id] = true; // do not retry in a loop; the 1x image stays
      },
    );
  };

  const releaseHi = (id: number, tex: Texture) => {
    if (lowImage[id] !== undefined) {
      tex.dispose();
      tex.image = lowImage[id];
      tex.needsUpdate = true;
    }
    hiState[id] = 'idle';
  };

  const applyHiRes = () => {
    // On mobile the sharper step is the regular 1x image, which exists for every exported face.
    const hires = mobile ? manifestInfo?.faces : manifestInfo?.hires;
    if (!hires?.length || disposed) return;

    if (hiLevel >= HIRES_LOAD_LEVEL) hiActive = true;
    else if (hiLevel <= HIRES_RELEASE_LEVEL) hiActive = false;
    const spread = hiPage >= 1 && hiPage <= 9 ? hiPage : null;

    // Wanted: the visible spread, plus faces already in 2x that are within one spread of it.
    for (const spec of FACES) {
      if (spec.id === 0 || spec.spread === null) {
        hiWanted[spec.id] = false;
        continue;
      }
      const visible = spread !== null && spec.spread === spread;
      const near = spread !== null && Math.abs(spec.spread - spread) <= HIRES_KEEP_SPREADS;
      hiWanted[spec.id] = hiActive && hires.includes(spec.id) && (visible || (near && hiState[spec.id] !== 'idle'));
      if (visible && hiWanted[spec.id]) hiUsed[spec.id] = ++hiClock;
    }

    // Memory cap: drop the least recently visible faces first.
    const wanted = FACES.filter((spec) => hiWanted[spec.id]);
    if (wanted.length > HIRES_MAX_FACES) {
      wanted.sort((a, b) => hiUsed[a.id] - hiUsed[b.id]);
      for (const spec of wanted.slice(0, wanted.length - HIRES_MAX_FACES)) hiWanted[spec.id] = false;
    }

    for (const spec of FACES) {
      const tex = faces[spec.id];
      if (!tex) continue;
      if (hiWanted[spec.id] && hiState[spec.id] === 'idle' && !hiFailed[spec.id] && lowImage[spec.id] !== undefined) {
        loadHi(spec.id, tex);
      } else if (!hiWanted[spec.id] && hiState[spec.id] === 'high') {
        releaseHi(spec.id, tex);
      }
    }
  };

  // Upgrade placeholders to the exported images listed in the manifest.
  const baseUrl = (id: number, version: number) => (mobile ? pageFileMobileUrl(id, version) : pageFileUrl(id, version));
  void fetchManifest().then((manifest) => {
    if (disposed) return;
    if (!manifest) {
      reportManifest(0); // nothing exported: keep the placeholders and let the loader finish
      return;
    }
    manifestInfo = manifest;
    const isDisposed = () => disposed;
    const ids = manifest.faces.filter((id) => id === 0 || faces[id]);
    reportManifest(ids.length + (manifest.backCover ? 1 : 0));
    for (const id of ids) {
      if (id === 0) swapImage(loader, cover, baseUrl(0, manifest.version), maxAnisotropy, isDisposed);
      else {
        swapImage(loader, faces[id]!, baseUrl(id, manifest.version), maxAnisotropy, isDisposed, (image) => {
          lowImage[id] = image;
          applyHiRes(); // zoom may already be active when the base image arrives
        });
      }
    }
    if (manifest.backCover) {
      const url = mobile ? backCoverMobileUrl(manifest.version) : backCoverFileUrl(manifest.version);
      swapImage(loader, backCover, url, maxAnisotropy, isDisposed);
    }
  });

  return {
    faces,
    cover,
    backCover,
    updateHiRes: (level, page) => {
      hiLevel = level;
      hiPage = page;
      applyHiRes();
    },
    dispose: () => {
      disposed = true;
      faces.forEach((t) => t?.dispose());
      cover.dispose();
      backCover.dispose();
    },
  };
}
