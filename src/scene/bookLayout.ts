// Single place that defines the physical book: leaves, faces and which texture goes where.
//
// Physical model (see odd/tasks/fase-3-libro-3d.md):
// - 11 flippable leaves L0..L10. L0 = front cover board, L10 = back cover board, L1..L9 = paper leaves.
// - Each leaf has a front (face up while it rests on the right) and a back (face up once flipped left).
// - Paper leaf i: front = face 2i, back = face 2i + 1.  L0 back = face 1.
// - Spread k (1..9) shows: left = back of L(k-1) = face 2k-1, right = front of Lk = face 2k.
// - page 0 = closed, page 1..9 = spreads, page 10 = every leaf flipped (closed, back cover on top).

// --- Geometry (world units; 1 unit ~ 1 page-width scale from docs/03) ------------------
export const PAGE_W = 1.28;
export const PAGE_H = 0.88; // size along the desk depth (z)
export const PAGE_THICK = 0.003;
export const COVER_SCALE = 1.04;
export const COVER_W = PAGE_W * COVER_SCALE;
export const COVER_H = PAGE_H * COVER_SCALE;
export const COVER_THICK = 0.012;

/** Segments along x and number of bones in each leaf (bone j sits at column j, the last one is rigid). */
export const SEGMENTS = 30;
export const BONE_COUNT = 30;

/** Vertical distance between resting leaves; exaggerated vs. PAGE_THICK so the stack reads as a book. */
export const PITCH = 0.0075;
export const STACK_BASE_Y = 0.008;
// ---------------------------------------------------------------------------------------

export const LEAF_COUNT = 11;
export const LAST_LEAF = LEAF_COUNT - 1;
export const LAST_PAGE = 10;

/** How many leaves are flipped (resting on the left) for a given page. */
export function flippedCountFor(page: number): number {
  if (page >= LAST_PAGE) return LEAF_COUNT;
  return Math.max(0, Math.floor(page));
}

// --- Exported face images (`npm run pages:export`) ------------------------------------------
// Faces listed in `manifest.json` are loaded from `page-NN.webp`; every other face keeps its
// numbered placeholder. The manifest is the source of truth because Vite dev answers a missing
// static file with index.html and status 200, so probing the image URL cannot tell if it exists.
export const PAGES_DIR = '/textures/pages';
export const PAGES_MANIFEST_URL = `${PAGES_DIR}/manifest.json`;

export interface PagesManifest {
  /** Changes on every export; used to bust the browser cache. */
  version: number;
  /** Face ids that have an exported image (0 = front cover). */
  faces: number[];
  /** True once `back-cover.webp` exists. */
  backCover?: boolean;
  /** Face ids that also have a 2x image (`page-NN@2x.webp`), loaded only while zoomed in. */
  hires?: number[];
}

export const pageFileUrl = (face: number, version = 0): string =>
  `${PAGES_DIR}/page-${String(face).padStart(2, '0')}.webp?v=${version}`;
export const pageFile2xUrl = (face: number, version = 0): string =>
  `${PAGES_DIR}/page-${String(face).padStart(2, '0')}@2x.webp?v=${version}`;
export const backCoverFileUrl = (version = 0): string => `${PAGES_DIR}/back-cover.webp?v=${version}`;
// Phones load the light 800x550 versions as the base image (about a third of the bytes and GPU memory).
export const pageFileMobileUrl = (face: number, version = 0): string =>
  `${PAGES_DIR}/page-${String(face).padStart(2, '0')}@mobile.webp?v=${version}`;
export const backCoverMobileUrl = (version = 0): string => `${PAGES_DIR}/back-cover@mobile.webp?v=${version}`;

export interface FaceSpec {
  id: number;
  spread: number | null;
  side: 'L' | 'R' | null;
  label: string;
  theme: 'light' | 'dark';
}

const face = (
  id: number,
  spread: number | null,
  side: 'L' | 'R' | null,
  label: string,
  theme: 'light' | 'dark',
): FaceSpec => ({ id, spread, side, label, theme });

/** Content is assigned per spread; face 0 is the cover (drawn separately) and face 19 a blank back. */
export const FACES: readonly FaceSpec[] = [
  face(0, null, null, 'Tapa', 'dark'),
  face(1, 1, 'L', 'Índice', 'light'),
  face(2, 1, 'R', 'Bienvenida + CV', 'dark'),
  face(3, 2, 'L', 'Acerca de mí', 'light'),
  face(4, 2, 'R', 'Académica y laboral', 'dark'),
  face(5, 3, 'L', 'Proyectos · Intro', 'light'),
  face(6, 3, 'R', 'ARGOS', 'dark'),
  face(7, 4, 'L', 'ARGOS · detalle', 'dark'),
  face(8, 4, 'R', 'ARGOS · detalle', 'light'),
  face(9, 5, 'L', 'SegundoAire', 'light'),
  face(10, 5, 'R', 'SegundoAire', 'dark'),
  face(11, 6, 'L', 'ArcoFisio', 'dark'),
  face(12, 6, 'R', 'ArcoFisio', 'light'),
  face(13, 7, 'L', 'Testimonios', 'light'),
  face(14, 7, 'R', 'Testimonios', 'dark'),
  face(15, 8, 'L', 'Stack', 'dark'),
  face(16, 8, 'R', 'Arquitectura', 'light'),
  face(17, 9, 'L', 'Vacía', 'light'),
  face(18, 9, 'R', 'Gracias por hojear', 'light'),
  face(19, null, null, 'Dorso en blanco', 'light'),
];

export type LeafKind = 'cover' | 'page';

export interface LeafSpec {
  index: number;
  kind: LeafKind;
  /** Face painted on the front; null = cover cloth (L0) or plain endpaper (L10). */
  frontFace: number | null;
  /** Face painted on the back; null = the back-cover texture (L10). */
  backFace: number | null;
}

export const LEAVES: readonly LeafSpec[] = Array.from({ length: LEAF_COUNT }, (_, i): LeafSpec => {
  if (i === 0) return { index: 0, kind: 'cover', frontFace: null, backFace: 1 };
  if (i === LAST_LEAF) return { index: i, kind: 'cover', frontFace: null, backFace: null };
  return { index: i, kind: 'page', frontFace: 2 * i, backFace: 2 * i + 1 };
});
