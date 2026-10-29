import generated from './hotspots.generated.json';

/**
 * Interactive rectangles of every book face, in the 1600x1100 face space. They are measured from the
 * printed designs by `npm run pages:export` (every `[data-hotspot]` element), so the clickable areas
 * always match what is drawn on the page.
 */
export interface Hotspot {
  id: string;
  /** goto = jump to a spread, link = external URL / mailto, download = CV, video = hover demo, form = contact form. */
  action: 'goto' | 'link' | 'download' | 'video' | 'form' | null;
  /** Destination spread for `goto`. */
  page: number | null;
  href: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
}

const byFace = generated as unknown as Record<string, Hotspot[]>;

export const hotspotsForFace = (face: number): readonly Hotspot[] => byFace[String(face)] ?? [];
