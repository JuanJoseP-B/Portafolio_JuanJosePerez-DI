import { CanvasTexture, SRGBColorSpace, type Object3D, type Mesh } from 'three';

/** Deterministic PRNG so procedural textures look the same on every load. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/**
 * Draws into a canvas and wraps it in a texture. Drawing runs again once web fonts
 * are ready, so text uses the real typefaces instead of the fallback.
 */
export function makeCanvasTexture(w: number, h: number, draw: Draw, srgb = true): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, w, h);

  const texture = new CanvasTexture(canvas);
  if (srgb) texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  void document.fonts?.ready.then(() => {
    draw(ctx, w, h);
    texture.needsUpdate = true;
  });
  return texture;
}

/** Marks every mesh under `root` as shadow caster and receiver. */
export function enableShadows(root: Object3D | null): void {
  root?.traverse((obj) => {
    const mesh = obj as Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}

export type WoodKind = 'albedo' | 'rough' | 'bump';

/** Dark wood with horizontal grain. One painter, three maps (albedo, roughness, bump). */
export function drawWood(kind: WoodKind): Draw {
  return (ctx, w, h) => {
    const rand = mulberry32(7);

    if (kind === 'albedo') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2b1e15');
      grad.addColorStop(1, '#1d140e');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = kind === 'rough' ? '#a6a6a6' : '#808080';
    }
    ctx.fillRect(0, 0, w, h);

    // Broad tonal bands: subtle plank-to-plank variation.
    for (let i = 0; i < 16; i++) {
      const y = rand() * h;
      const bandH = 20 + rand() * 90;
      const a = 0.04 + rand() * 0.1;
      if (kind === 'albedo') {
        ctx.fillStyle = rand() > 0.5 ? `rgba(0,0,0,${a})` : `rgba(96,66,42,${a * 0.6})`;
      } else {
        ctx.fillStyle = rand() > 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`;
      }
      ctx.fillRect(0, y, w, bandH);
    }

    // Fine grain streaks.
    ctx.lineCap = 'round';
    for (let i = 0; i < 1500; i++) {
      const y = rand() * h;
      const x0 = rand() * w;
      const len = w * (0.15 + rand() * 0.6);
      const amp = 0.6 + rand() * 3.2;
      const freq = 0.004 + rand() * 0.012;
      const phase = rand() * Math.PI * 2;
      const light = rand() > 0.55;
      const a = 0.04 + rand() * 0.14;

      if (kind === 'albedo') {
        ctx.strokeStyle = light ? `rgba(122,88,58,${a})` : `rgba(0,0,0,${a * 1.4})`;
      } else if (kind === 'rough') {
        ctx.strokeStyle = light ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
      } else {
        ctx.strokeStyle = light ? `rgba(255,255,255,${a * 0.6})` : `rgba(0,0,0,${a * 1.2})`;
      }
      ctx.lineWidth = 0.5 + rand() * 1.6;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      for (let x = x0; x <= x0 + len; x += 24) {
        ctx.lineTo(x, y + Math.sin(x * freq + phase) * amp);
      }
      ctx.stroke();
    }

    // Pores.
    for (let i = 0; i < 5000; i++) {
      const a = 0.08 + rand() * 0.2;
      ctx.fillStyle = kind === 'albedo' ? `rgba(0,0,0,${a})` : `rgba(0,0,0,${a * 1.2})`;
      ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2.5, 1);
    }
  };
}
