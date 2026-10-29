/**
 * Exports every designed book face to WebP textures.
 *
 *   npm run pages:export                  # all faces, 1x and 2x
 *   npm run pages:export -- --faces=1,2   # only some faces (merged into the existing manifest)
 *   npm run pages:export -- --scale=2     # only the 2x images (--scale=1: only the 1x images)
 *   npm run pages:export -- --url=http://localhost:5173
 *
 * It uses the running dev server (http://localhost:5173 by default); if none answers it starts
 * Vite on port 5199 for the duration of the export.
 *
 * Output (public/textures/pages/):
 *   page-NN.webp          1600x1100 texture (the back cover, id 20, is written as back-cover.webp)
 *   page-NN@mobile.webp   800x550 texture (used by the mobile build in Phase 6)
 *   page-NN@2x.webp       3200x2200 texture, loaded only while the book is zoomed in (not for the cover)
 *   manifest.json         faces available (+ `hires` faces with a 2x image) + version (cache busting)
 *   hotspots.generated.json  bounding boxes of every [data-hotspot] element, per face (from the 1x pass)
 *
 * The hotspots are also written to src/lib/hotspots.generated.json, which the interaction layer
 * (src/scene/SpreadHotspots.tsx) imports at build time.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { BACK_COVER_ID, DESIGNED_FACE_IDS, FACE_SIZE } from '../src/pages-design/faceIds';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'textures', 'pages');
const HOTSPOTS_SRC = path.join(ROOT, 'src', 'lib', 'hotspots.generated.json');
const DEFAULT_URL = 'http://localhost:5173';
const FALLBACK_PORT = 5199;

const WEBP_QUALITY = 88;
const MOBILE_QUALITY = 82;
const MOBILE_SIZE = { w: 800, h: 550 };
const HIRES_QUALITY = 85; // 3200x2200: slightly lower quality keeps files small without visible loss
const HIRES_SKIP = new Set([0, BACK_COVER_ID]); // the covers are never seen zoomed

interface Hotspot {
  id: string;
  action: string | null;
  page: number | null;
  href: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Manifest {
  version: number;
  generatedAt: string;
  faces: number[];
  backCover?: boolean;
  hires?: number[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const pad = (n: number) => String(n).padStart(2, '0');
/** Base file name of a face: the back cover has its own name, the rest are page-NN. */
const baseName = (id: number) => (id === BACK_COVER_ID ? 'back-cover' : `page-${pad(id)}`);

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

async function isUp(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    return res.ok;
  } catch {
    return false;
  }
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

/** Starts Vite only when no server is running; returns the base URL and a stop function. */
async function ensureServer(): Promise<{ base: string; stop: () => void }> {
  const requested = arg('url') ?? DEFAULT_URL;
  if (await isUp(requested)) return { base: requested, stop: () => undefined };

  console.log(`No dev server at ${requested}; starting Vite on port ${FALLBACK_PORT}...`);
  const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
  const child: ChildProcess = spawn(process.execPath, [viteBin, '--port', String(FALLBACK_PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  const base = `http://localhost:${FALLBACK_PORT}`;
  for (let i = 0; i < 80; i++) {
    if (await isUp(base)) return { base, stop: () => void child.kill() };
    await sleep(500);
  }
  child.kill();
  throw new Error('Vite did not start in time.');
}

async function main() {
  const requested = arg('faces')
    ?.split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n));
  const faces = requested?.length ? requested : [...DESIGNED_FACE_IDS];
  const unknown = faces.filter((id) => !DESIGNED_FACE_IDS.includes(id));
  if (unknown.length) throw new Error(`Faces without a design: ${unknown.join(', ')}`);

  const scaleArg = arg('scale');
  if (scaleArg !== undefined && scaleArg !== '1' && scaleArg !== '2') throw new Error('--scale must be 1 or 2');
  const scales: (1 | 2)[] = scaleArg === '1' ? [1] : scaleArg === '2' ? [2] : [1, 2];

  await mkdir(OUT_DIR, { recursive: true });
  const { base, stop } = await ensureServer();
  console.log(`Exporting faces [${faces.join(', ')}] at ${scales.map((s) => `${s}x`).join(' + ')} from ${base}`);

  const browser = await chromium.launch();
  const hotspotsByFace: Record<string, Hotspot[]> = {};
  const hiresExported: number[] = [];

  try {
    for (const scale of scales) {
      const context = await browser.newContext({
        viewport: { width: FACE_SIZE.w, height: FACE_SIZE.h },
        deviceScaleFactor: scale,
      });
      const page = await context.newPage();
      page.on('pageerror', (err) => console.warn('  page error:', err.message));

      const ids = scale === 1 ? faces : faces.filter((id) => !HIRES_SKIP.has(id));
      for (const id of ids) {
        await page.goto(`${base}/__pages?n=${id}`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
        const frame = page.locator('[data-page-frame][data-ready="true"]');
        await frame.waitFor({ timeout: 90_000 });

        const png = await frame.screenshot({ type: 'png', animations: 'disabled', caret: 'hide' });

        if (scale === 2) {
          const file = path.join(OUT_DIR, `${baseName(id)}@2x.webp`);
          await sharp(png).webp({ quality: HIRES_QUALITY }).toFile(file);
          const meta = await sharp(file).metadata();
          if (meta.width !== FACE_SIZE.w * 2 || meta.height !== FACE_SIZE.h * 2) {
            throw new Error(`Face ${id} @2x: expected ${FACE_SIZE.w * 2}x${FACE_SIZE.h * 2}, got ${meta.width}x${meta.height}`);
          }
          hiresExported.push(id);
          const kb = Math.round((await stat(file)).size / 1024);
          console.log(`  face ${pad(id)} @2x  ${meta.width}x${meta.height}  ${kb} KB`);
          continue;
        }

        const file = path.join(OUT_DIR, `${baseName(id)}.webp`);
        await sharp(png).webp({ quality: WEBP_QUALITY }).toFile(file);
        await sharp(png)
          .resize(MOBILE_SIZE.w, MOBILE_SIZE.h)
          .webp({ quality: MOBILE_QUALITY })
          .toFile(path.join(OUT_DIR, `${baseName(id)}@mobile.webp`));

        const meta = await sharp(file).metadata();
        if (meta.width !== FACE_SIZE.w || meta.height !== FACE_SIZE.h) {
          throw new Error(`Face ${id}: expected ${FACE_SIZE.w}x${FACE_SIZE.h}, got ${meta.width}x${meta.height}`);
        }

        // Runs in the browser: bounding boxes of interactive elements, relative to the frame.
        hotspotsByFace[String(id)] = await page.evaluate(() => {
          const root = document.querySelector('[data-page-frame]') as HTMLElement;
          const origin = root.getBoundingClientRect();
          return Array.from(root.querySelectorAll<HTMLElement>('[data-hotspot]')).map((el) => {
            const r = el.getBoundingClientRect();
            return {
              id: el.dataset.hotspot as string,
              action: el.dataset.action ?? null,
              page: el.dataset.page ? Number(el.dataset.page) : null,
              href: el.dataset.href ?? null,
              x: Math.round(r.left - origin.left),
              y: Math.round(r.top - origin.top),
              w: Math.round(r.width),
              h: Math.round(r.height),
            };
          });
        });

        const kb = Math.round((await stat(file)).size / 1024);
        console.log(`  face ${pad(id)}  ${meta.width}x${meta.height}  ${kb} KB  hotspots: ${hotspotsByFace[String(id)].length}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    stop();
  }

  // Merge with what an earlier (possibly partial) export left behind.
  const previous = await readJson<Manifest>(path.join(OUT_DIR, 'manifest.json'));
  const previousHotspots = (await readJson<Record<string, Hotspot[]>>(path.join(OUT_DIR, 'hotspots.generated.json'))) ?? {};

  // The back cover is flagged separately (manifest.backCover), not listed among the page faces.
  const mergedFaces = scales.includes(1) ? faces.filter((id) => id !== BACK_COVER_ID) : [];
  const backCoverExported = scales.includes(1) && faces.includes(BACK_COVER_ID);
  const mergedHires = [...new Set([...(previous?.hires ?? []), ...hiresExported])].sort((a, b) => a - b);
  const manifest: Manifest = {
    version: Date.now(),
    generatedAt: new Date().toISOString(),
    faces: [...new Set([...(previous?.faces ?? []), ...mergedFaces])].sort((a, b) => a - b),
    ...(previous?.backCover || backCoverExported ? { backCover: true } : {}),
    ...(mergedHires.length ? { hires: mergedHires } : {}),
  };
  await writeFile(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  const hotspotsJson = JSON.stringify({ ...previousHotspots, ...hotspotsByFace }, null, 2) + '\n';
  await writeFile(path.join(OUT_DIR, 'hotspots.generated.json'), hotspotsJson);
  await writeFile(HOTSPOTS_SRC, hotspotsJson);
  console.log(`Done. Manifest faces: [${manifest.faces.join(', ')}]  hires: [${mergedHires.join(', ')}]`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
