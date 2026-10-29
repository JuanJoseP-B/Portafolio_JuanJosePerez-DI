// Plain TS (no JSX) so the Node export script can import it.
// Face ids follow src/scene/bookLayout.ts (physical numbering: spread k = faces 2k-1 and 2k).

/** Id of the back cover (exterior). It is exported as back-cover.webp instead of page-NN.webp. */
export const BACK_COVER_ID = 20;

/** Faces that have a design: 0 = front cover, 1-19 = interior faces, 20 = back cover. */
export const DESIGNED_FACE_IDS: readonly number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, BACK_COVER_ID,
];

/** Every face is drawn at this size (same 1.4545 aspect as the 3D page). */
export const FACE_SIZE = { w: 1600, h: 1100 } as const;

/** Index entries: where each chapter starts. `page` is the book spread to jump to. */
export interface IndexEntry {
  label: string;
  /** Face where the chapter starts; null = back cover. */
  face: number | null;
  page: number;
}
