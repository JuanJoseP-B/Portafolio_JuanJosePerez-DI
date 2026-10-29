import { Bone, BoxGeometry, Float32BufferAttribute, Group, Skeleton, SkinnedMesh, Uint16BufferAttribute, type Material } from 'three';
import {
  BONE_COUNT,
  COVER_H,
  COVER_THICK,
  COVER_W,
  PAGE_H,
  PAGE_THICK,
  PAGE_W,
  SEGMENTS,
  type LeafSpec,
} from './bookLayout';

// --- Tuning -----------------------------------------------------------------
/** Fraction of the leaf (from the spine) that stays almost rigid; the tip bends the most. */
const RIGID_FRACTION = 0.3;
/** Covers are boards: they bend only this fraction of what a paper leaf bends. */
export const COVER_STIFFNESS = 0.12;
// ------------------------------------------------------------------------------

/**
 * Share of the total bend given to each bone (index 0 = root, always 0). Sums to 1, so a bend of
 * `a` radians means the tip ends up rotated `a` radians relative to the root.
 */
export const BEND_WEIGHTS: number[] = (() => {
  const raw = Array.from({ length: BONE_COUNT }, (_, j) =>
    j === 0 ? 0 : Math.max(0, j / (BONE_COUNT - 1) - RIGID_FRACTION),
  );
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((r) => r / sum);
})();

export interface LeafRig {
  spec: LeafSpec;
  /** Pivot at the spine: rotate it around z to flip the leaf. */
  group: Group;
  mesh: SkinnedMesh;
  bones: Bone[];
  stiffness: number;
}

/**
 * Flat box lying in the xz plane (x = along the page from the spine, z = depth, y = thickness),
 * spine edge at x = 0. The back face (-y) gets UVs so that it reads upright once the leaf is
 * flipped around the z axis; `mapW/mapH` is the area the back texture covers.
 */
function buildLeafGeometry(w: number, h: number, thick: number, mapW: number, mapH: number): BoxGeometry {
  const geometry = new BoxGeometry(w, thick, h, SEGMENTS, 1, 1);
  geometry.translate(w / 2, 0, 0);

  const position = geometry.getAttribute('position');
  const uv = geometry.getAttribute('uv');
  const index = geometry.getIndex()!;

  // BoxGeometry material groups: 0 +x, 1 -x, 2 +y (front), 3 -y (back), 4 +z, 5 -z.
  const backVertices = new Set<number>();
  for (const group of geometry.groups) {
    if (group.materialIndex !== 3) continue;
    for (let k = group.start; k < group.start + group.count; k++) backVertices.add(index.getX(k));
  }
  backVertices.forEach((v) => uv.setXY(v, 1 - position.getX(v) / mapW, 0.5 - position.getZ(v) / mapH));
  uv.needsUpdate = true;

  // Each vertex follows the bone that sits at its column.
  const segment = w / SEGMENTS;
  const skinIndex = new Uint16Array(position.count * 4);
  const skinWeight = new Float32Array(position.count * 4);
  for (let v = 0; v < position.count; v++) {
    const column = Math.round(position.getX(v) / segment);
    skinIndex[v * 4] = Math.min(column, BONE_COUNT - 1);
    skinWeight[v * 4] = 1;
  }
  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndex, 4));
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeight, 4));
  return geometry;
}

/**
 * Builds one leaf: a SkinnedMesh with a chain of BONE_COUNT bones along x.
 * `materials` follows the BoxGeometry group order [+x, -x, front, back, +z, -z].
 * `backMapsBoard` makes the back texture cover the whole board (back cover) instead of a page-sized area.
 */
export function createLeafRig(spec: LeafSpec, materials: Material[], backMapsBoard = false): LeafRig {
  const isCover = spec.kind === 'cover';
  const w = isCover ? COVER_W : PAGE_W;
  const h = isCover ? COVER_H : PAGE_H;
  const thick = isCover ? COVER_THICK : PAGE_THICK;

  const geometry = buildLeafGeometry(
    w,
    h,
    thick,
    backMapsBoard ? COVER_W : PAGE_W,
    backMapsBoard ? COVER_H : PAGE_H,
  );

  const segment = w / SEGMENTS;
  const bones: Bone[] = [];
  for (let j = 0; j < BONE_COUNT; j++) {
    const bone = new Bone();
    if (j > 0) {
      bone.position.x = segment;
      bones[j - 1].add(bone);
    }
    bones.push(bone);
  }

  const mesh = new SkinnedMesh(geometry, materials);
  mesh.add(bones[0]);
  mesh.updateMatrixWorld(true);
  mesh.bind(new Skeleton(bones)); // computes the inverses from the rest pose
  mesh.frustumCulled = false;

  const group = new Group();
  group.add(mesh);

  return { spec, group, mesh, bones, stiffness: isCover ? COVER_STIFFNESS : 1 };
}
