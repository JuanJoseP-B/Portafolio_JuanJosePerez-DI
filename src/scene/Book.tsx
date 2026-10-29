import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { easing } from 'maath';
import { DoubleSide, MathUtils, MeshStandardMaterial, type Group, type Material, type Mesh } from 'three';
import { motion } from '../lib/motion';
import { useBook } from '../store/useBook';
import {
  COVER_H,
  COVER_THICK,
  COVER_W,
  LAST_LEAF,
  LEAF_COUNT,
  LEAVES,
  PAGE_H,
  PAGE_W,
  PITCH,
  STACK_BASE_Y,
  flippedCountFor,
} from './bookLayout';
import { COVER_COLOR, PAPER_COLOR, createBookTextures } from './bookTextures';
import { BEND_WEIGHTS, createLeafRig, type LeafRig } from './leafRig';
import { enableShadows } from './textures';
import type { V3 } from './types';
import { SpreadHotspots } from './SpreadHotspots';
import { useBookKeys } from './useBookKeys';
import { isFlipBlocked, isHoverSuppressed, subscribeZoom, zoomState } from './zoomCamera';

// --- Tuning -----------------------------------------------------------------
const FLIP_SECONDS = 0.9; // paper leaf, spine to spine
const COVER_FLIP_SECONDS = 1.1; // front / back cover boards
const STAGGER_SECONDS = 0.12; // delay between leaves when jumping several spreads
const BEND_TOTAL = 0.75; // rad: peak tip rotation relative to the root while a leaf is in flight
const HOVER_LIFT = 0.12; // rad: how much the free corner rises on hover
const HOVER_SMOOTH = 0.2; // seconds
const LAYOUT_SMOOTH = 0.45; // seconds: book sliding between closed / open / closed-back
/**
 * Longest time step (seconds) the flip timeline advances in one frame. The timeline is our own
 * accumulator, not `state.clock.elapsedTime`: R3F resets that clock to 0 every time `frameloop`
 * switches (hidden tab -> visible), which used to rewind every finished flip.
 */
const MAX_FRAME_DELTA = 0.25;
/** With prefers-reduced-motion every move is (nearly) instant: no flip animation, no stagger, no corner lift. */
const REDUCED_FLIP_SCALE = 0.01;
const REDUCED_LAYOUT_SMOOTH = 0.0001;

/** Spine position on the desk and yaw. Closed sits right of the spine, closed-back mirrors it. */
const LAYOUTS: Record<'closed' | 'open' | 'closedBack', { position: V3; yawDeg: number }> = {
  closed: { position: [-0.52, 0, 0.75], yawDeg: 8 },
  open: { position: [0, 0, 0.42], yawDeg: 0 },
  closedBack: { position: [0.52, 0, 0.75], yawDeg: -8 },
};

/**
 * Multiplies every page texture (cover boards excluded) to keep the white paper below the point
 * where it burns out and loses text contrast. '#ffffff' = no change; '#eaeaea' ~ 0.82 in linear light.
 * Previous value: '#ffffff' (no tint).
 */
const PAGE_TINT = '#eaeaea';

const HIT_HEIGHT = 0.1; // y of the invisible click / hover areas
const SPINE_OPEN_HEIGHT = 0.012;
// ------------------------------------------------------------------------------

const BLOCK_W = PAGE_W - 0.014;
const BLOCK_D = PAGE_H - 0.014;
const BLOCK_BOTTOM = 0.002;
const CLOSED_THICKNESS = STACK_BASE_Y + LAST_LEAF * PITCH + COVER_THICK / 2 - BLOCK_BOTTOM;

interface LeafAnim {
  p: number; // 0 = resting on the right, 1 = flipped on the left
  from: number;
  to: number;
  t0: number;
  dur: number;
  hover: number;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** One-page mode with a spread open: taps on the book do nothing (swipe and the face buttons turn faces). */
const tapBlocked = (): boolean => {
  const { compact, target } = useBook.getState();
  return compact && target >= 1 && target <= 9;
};

const layoutFor = (flipped: number) =>
  flipped === 0 ? LAYOUTS.closed : flipped >= LEAF_COUNT ? LAYOUTS.closedBack : LAYOUTS.open;

/** Pivot height: rises above both stacks first, then settles onto the stack where it lands. */
function pivotY(i: number, p: number): number {
  const right = STACK_BASE_Y + (LAST_LEAF - i) * PITCH;
  const left = STACK_BASE_Y + i * PITCH;
  const high = Math.max(right, left);
  return right + (high - right) * smoothstep(0, 0.3, p) + (left - high) * smoothstep(0.7, 1, p);
}

/**
 * Flip angle around the spine plus bend along the leaf. The bend is positive early and negative late
 * (sin 2*pi*p), so the tip is always above the page plane at both ends and never digs into a stack.
 * Hover raises the free corner: +rel on the right stack, -rel on the left one.
 */
function poseLeaf(rig: LeafRig, a: LeafAnim): void {
  const i = rig.spec.index;
  rig.group.rotation.z = Math.PI * a.p;
  rig.group.position.y = pivotY(i, a.p);

  const settled = Math.cos(Math.PI * a.p) ** 2; // 1 at rest, 0 mid-flight
  const bend = BEND_TOTAL * Math.sin(2 * Math.PI * a.p);
  const lift = HOVER_LIFT * a.hover * (1 - 2 * a.p) * settled;
  const rel = (bend + lift) * rig.stiffness;
  for (let j = 1; j < rig.bones.length; j++) rig.bones[j].rotation.z = rel * BEND_WEIGHTS[j];
}

/** Paper block under each stack so the page edges read as a solid book instead of gaps. */
function updateBlock(mesh: Mesh | null, count: number, side: 1 | -1): void {
  if (!mesh) return;
  const top = STACK_BASE_Y + (count - 1) * PITCH - 0.0025;
  const height = top - BLOCK_BOTTOM;
  mesh.visible = count > 0.5 && height > 0.001;
  if (!mesh.visible) return;
  mesh.scale.set(BLOCK_W, height, BLOCK_D);
  mesh.position.set(side * (BLOCK_W / 2 + 0.004), BLOCK_BOTTOM + height / 2, 0);
}

/** Rounded spine: tall only while the book is closed (either way), a thin hinge while open. */
function updateSpine(mesh: Mesh | null, flippedSum: number): void {
  if (!mesh) return;
  const closedness = Math.max(0, 1 - flippedSum / 1.2, 1 - (LEAF_COUNT - flippedSum) / 1.2);
  const height = MathUtils.lerp(SPINE_OPEN_HEIGHT, CLOSED_THICKNESS, closedness);
  const radius = height / 2;
  // Bulges to the left while the book rests on the right of the spine, to the right when closed-back.
  mesh.scale.set(flippedSum > LEAF_COUNT / 2 ? -radius : radius, 1, radius);
  mesh.position.set(0, BLOCK_BOTTOM + radius, 0);
}

function createAssets(maxAnisotropy: number, mobile: boolean) {
  const textures = createBookTextures(maxAnisotropy, mobile);
  const materials: Material[] = [];
  const material = (params: ConstructorParameters<typeof MeshStandardMaterial>[0]) => {
    const m = new MeshStandardMaterial(params);
    materials.push(m);
    return m;
  };

  const paperEdge = material({ color: PAPER_COLOR, roughness: 0.9 });
  const coverEdge = material({ color: COVER_COLOR, roughness: 0.7 });
  const endpaper = material({ color: PAPER_COLOR, roughness: 0.9 });

  const leaves = LEAVES.map((spec) => {
    const page = (face: number | null) =>
      material({ map: face === null ? null : textures.faces[face], color: PAGE_TINT, roughness: 0.85 });
    const isCover = spec.kind === 'cover';
    const edge = isCover ? coverEdge : paperEdge;

    let front: Material;
    let back: Material;
    if (spec.index === 0) {
      front = material({ map: textures.cover, roughness: 0.7 });
      back = page(spec.backFace);
    } else if (spec.index === LAST_LEAF) {
      front = endpaper;
      back = material({ map: textures.backCover, roughness: 0.7 });
    } else {
      front = page(spec.frontFace);
      back = page(spec.backFace);
    }
    return createLeafRig(spec, [edge, edge, front, back, edge, edge], spec.index === LAST_LEAF);
  });

  return {
    leaves,
    textures,
    dispose: () => {
      textures.dispose();
      materials.forEach((m) => m.dispose());
      leaves.forEach((l) => l.mesh.geometry.dispose());
    },
  };
}

/** The interactive book: covers, leaves with bones, page blocks, spine, hover / click / keyboard. */
export function Book() {
  const gl = useThree((s) => s.gl);
  const page = useBook((s) => s.page);
  const hoveredSide = useBook((s) => s.hoveredSide);
  const setHoveredSide = useBook((s) => s.setHoveredSide);
  const next = useBook((s) => s.next);
  const prev = useBook((s) => s.prev);

  useBookKeys();

  // Phones start with the light textures; rotating the device later keeps whatever was loaded.
  const assets = useMemo(() => createAssets(gl.capabilities.getMaxAnisotropy(), useBook.getState().compact), [gl]);
  useEffect(() => () => assets.dispose(), [assets]);

  // Sharper 2x faces for the visible spread while zoomed in; released when zooming back out.
  useEffect(() => {
    const update = () => assets.textures.updateHiRes(zoomState.level, useBook.getState().target);
    update();
    const offZoom = subscribeZoom(update);
    const offBook = useBook.subscribe((state, previous) => {
      if (state.target !== previous.target) update();
    });
    return () => {
      offZoom();
      offBook();
    };
  }, [assets]);

  // Initial state comes from the hash, so a deep link starts already flipped (no animation).
  const initialFlipped = useMemo(() => flippedCountFor(useBook.getState().target), []);
  const initialLayout = layoutFor(initialFlipped);
  const anim = useMemo(
    () =>
      assets.leaves.map((rig, i): LeafAnim => {
        const p = i < initialFlipped ? 1 : 0;
        const a: LeafAnim = { p, from: p, to: p, t0: 0, dur: 0, hover: 0 };
        poseLeaf(rig, a);
        return a;
      }),
    [assets, initialFlipped],
  );

  const root = useRef<Group>(null);
  const visual = useRef<Group>(null);
  const leftBlock = useRef<Mesh>(null);
  const rightBlock = useRef<Mesh>(null);
  const spine = useRef<Mesh>(null);

  // Store values read inside useFrame live in refs: no re-render per frame.
  const targetRef = useRef(useBook.getState().target);
  const hoverRef = useRef(useBook.getState().hoveredSide);
  const hotspotRef = useRef(useBook.getState().hoveredHotspot);
  const wantRef = useRef(initialFlipped);
  // Monotonic flip timeline (seconds); every `t0` in `anim` lives on it, so it must never be reset or rewound.
  const timeRef = useRef(0);
  useEffect(() => {
    targetRef.current = useBook.getState().target;
    hoverRef.current = useBook.getState().hoveredSide;
    hotspotRef.current = useBook.getState().hoveredHotspot;
    return useBook.subscribe((s) => {
      targetRef.current = s.target;
      hoverRef.current = s.hoveredSide;
      hotspotRef.current = s.hoveredHotspot;
    });
  }, []);

  useLayoutEffect(() => {
    const sum = anim.reduce((acc, a) => acc + a.p, 0);
    updateBlock(leftBlock.current, sum, -1);
    updateBlock(rightBlock.current, LEAF_COUNT - sum, 1);
    updateSpine(spine.current, sum);
    enableShadows(visual.current);
  }, [anim]);

  useEffect(() => {
    document.body.style.cursor = hoveredSide ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hoveredSide]);

  // The hit area under the pointer can disappear when the page changes.
  useEffect(() => setHoveredSide(null), [page, setHoveredSide]);

  // Coming back to the tab (e.g. after opening a demo link): pointerleave never fired while it was
  // hidden, so forget any hover that is no longer true. The flip state needs nothing here: the
  // timeline above keeps running from where it stopped and the watchdog in useFrame settles any leaf.
  useEffect(() => {
    const forgetPointer = () => {
      const book = useBook.getState();
      book.setHoveredSide(null);
      book.setHoveredHotspot(null);
    };
    const onVisibility = () => {
      if (!document.hidden) forgetPointer();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) forgetPointer();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  useFrame((_state, delta) => {
    timeRef.current += Math.min(delta, MAX_FRAME_DELTA);
    const now = timeRef.current;
    const want = flippedCountFor(targetRef.current);

    if (want !== wantRef.current) {
      const previous = wantRef.current;
      wantRef.current = want;
      const schedule = (i: number, to: 0 | 1, order: number) => {
        const a = anim[i];
        const base = LEAVES[i].kind === 'cover' ? COVER_FLIP_SECONDS : FLIP_SECONDS;
        a.from = a.p;
        a.to = to;
        const reduced = motion.reduced;
        a.t0 = now + (reduced ? 0 : order * STAGGER_SECONDS);
        a.dur = base * Math.max(0.4, Math.abs(to - a.p)) * (reduced ? REDUCED_FLIP_SCALE : 1);
      };
      // Forward flips leaves in order; backward undoes them from the top of the left stack.
      if (want > previous) for (let i = previous, k = 0; i < want; i++, k++) schedule(i, 1, k);
      else for (let i = previous - 1, k = 0; i >= want; i--, k++) schedule(i, 0, k);
    }

    // No corner lift while zoomed, dragging, or with the pointer over a hotspot (the flat Html layer would not follow it).
    const side = motion.reduced || isHoverSuppressed() || hotspotRef.current ? null : hoverRef.current;
    const topRight = want <= LAST_LEAF ? want : -1;
    const topLeft = want - 1;
    let flippedSum = 0;
    let moving = false;

    for (let i = 0; i < LEAF_COUNT; i++) {
      const a = anim[i];
      const u = a.dur > 0 ? MathUtils.clamp((now - a.t0) / a.dur, 0, 1) : 1;
      a.p = u >= 1 ? a.to : a.from + (a.to - a.from) * easeInOutCubic(u);
      if (u >= 1 && a.to !== (i < want ? 1 : 0)) {
        // Watchdog: a leaf at rest must sit on the side the target says. If it does not (stale
        // animation, interrupted schedule), put it there now instead of leaving pages overlapped.
        a.from = a.to = a.p = i < want ? 1 : 0;
        a.dur = 0;
      }
      flippedSum += a.p;
      if (u < 1) moving = true;

      const hovered = (side === 'right' && i === topRight) || (side === 'left' && i === topLeft);
      easing.damp(a, 'hover', hovered ? 1 : 0, HOVER_SMOOTH, delta);
      poseLeaf(assets.leaves[i], a);
    }

    updateBlock(leftBlock.current, flippedSum, -1);
    updateBlock(rightBlock.current, LEAF_COUNT - flippedSum, 1);
    updateSpine(spine.current, flippedSum);

    // Writes to the store only when the value changes (twice per flip), never once per frame.
    useBook.getState().setMoving(moving);

    if (root.current) {
      const layout = layoutFor(want);
      const smooth = motion.reduced ? REDUCED_LAYOUT_SMOOTH : LAYOUT_SMOOTH;
      easing.damp3(root.current.position, layout.position, smooth, delta);
      easing.damp(root.current.rotation, 'y', MathUtils.degToRad(layout.yawDeg), smooth, delta);
    }
  });

  const over = (side: 'left' | 'right') => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isHoverSuppressed()) return;
    setHoveredSide(side);
  };
  const out = (side: 'left' | 'right') => () => {
    if (useBook.getState().hoveredSide === side) setHoveredSide(null);
  };

  // Closed book: only the right half exists; closed-back: only the left half.
  const showRight = page !== 10;
  const showLeft = page !== 0;

  return (
    <group
      ref={root}
      position={initialLayout.position}
      rotation={[0, MathUtils.degToRad(initialLayout.yawDeg), 0]}
    >
      <group ref={visual}>
        {assets.leaves.map((rig) => (
          <primitive key={rig.spec.index} object={rig.group} />
        ))}

        <mesh ref={leftBlock}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={PAPER_COLOR} roughness={0.95} />
        </mesh>
        <mesh ref={rightBlock}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={PAPER_COLOR} roughness={0.95} />
        </mesh>

        {/* Half cylinder along z; scaled every frame to the current stack thickness. */}
        <mesh ref={spine} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, COVER_H, 24, 1, false, Math.PI, Math.PI]} />
          <meshStandardMaterial color={COVER_COLOR} roughness={0.7} side={DoubleSide} />
        </mesh>
      </group>

      {/* Clickable DOM on top of the visible spread (links, video, contact form); only while the book is still. */}
      <SpreadHotspots />

      {/* Invisible click / hover areas, one per half of the book. */}
      {showRight && (
        <mesh
          position={[COVER_W / 2, HIT_HEIGHT, 0]}
          onPointerOver={over('right')}
          onPointerOut={out('right')}
          onClick={(e) => {
            e.stopPropagation();
            if (isFlipBlocked() || tapBlocked()) return; // zoomed in, a drag, or one-page mode (swipe / buttons)
            next();
          }}
        >
          <boxGeometry args={[COVER_W, 0.02, COVER_H]} />
          <meshBasicMaterial colorWrite={false} depthWrite={false} />
        </mesh>
      )}
      {showLeft && (
        <mesh
          position={[-COVER_W / 2, HIT_HEIGHT, 0]}
          onPointerOver={over('left')}
          onPointerOut={out('left')}
          onClick={(e) => {
            e.stopPropagation();
            if (isFlipBlocked() || tapBlocked()) return;
            prev();
          }}
        >
          <boxGeometry args={[COVER_W, 0.02, COVER_H]} />
          <meshBasicMaterial colorWrite={false} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
