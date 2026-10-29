import { useEffect } from 'react';
import { BACK_COVER_ID, DESIGNED_FACE_IDS } from './faceIds';
import { FACE_COMPONENTS } from './faces';

// Fonts used by the faces; each is requested explicitly so the capture never shows a fallback.
const FONT_SPECS = [
  '500 100px "Space Grotesk"',
  '600 100px "Space Grotesk"',
  '700 100px "Space Grotesk"',
  'italic 400 100px "Instrument Serif"',
  '400 20px "Inter"',
  '500 20px "Inter"',
  '500 20px "JetBrains Mono"',
];
const SAMPLE = 'AaÁÉÍÓÚáéíóúÑñ0123456789 ↓↗·—';

async function waitForAssets(): Promise<void> {
  await Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec, SAMPLE).catch(() => [])));
  await document.fonts.ready;
  await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => undefined)));
  // Two frames so layout and paint settle before the screenshot.
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

function FaceList() {
  return (
    <div className="p-10 font-mono text-[16px] text-ink">
      <p className="mb-4 text-muted">Caras diseñadas (abre /__pages?n=ID)</p>
      <ul className="space-y-2">
        {DESIGNED_FACE_IDS.map((id) => (
          <li key={id}>
            <a className="link" href={`/__pages?n=${id}`}>
              {id === BACK_COVER_ID ? 'Contraportada' : `Cara ${String(id).padStart(2, '0')}`}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Isolated render of one face at 1600x1100 for the export script (`/__pages?n=K`).
 * Sets `data-ready="true"` on the frame once fonts and images are loaded.
 */
export function PageRoute() {
  const n = Number(new URLSearchParams(window.location.search).get('n'));
  const Face = Number.isInteger(n) ? FACE_COMPONENTS[n] : undefined;

  useEffect(() => {
    // The book app locks scrolling; this route must be scrollable when previewed in a small window.
    document.body.style.overflow = 'auto';
    if (!Face) return;
    let cancelled = false;
    void waitForAssets().then(() => {
      if (!cancelled) document.querySelector('[data-page-frame]')?.setAttribute('data-ready', 'true');
    });
    return () => {
      cancelled = true;
    };
  }, [Face]);

  return Face ? <Face /> : <FaceList />;
}
