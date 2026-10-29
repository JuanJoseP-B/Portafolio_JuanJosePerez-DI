import { PageFrame } from '../PageFrame';

/** Faces 17 and 19 — clean paper (negative space before the closing page / blank back of the last leaf). */
export function FaceBlank() {
  return <PageFrame theme="light" side="L">{null}</PageFrame>;
}
