import { MathUtils, Vector3 } from 'three';
import { COVER_H } from './bookLayout';

// Continuous zoom for the open book: state + camera math. No React, no per-frame allocations.
//
// Model: the camera looks at a focus point F on the desk plane. At zoom 1 and no pan it is exactly the
// "open" pose. Zooming moves the camera along its view direction (distance = d0 / zoom), panning moves F,
// and above a certain zoom the view direction straightens towards the vertical (less foreshortening).
// Zoom-to-cursor and drag-to-pan keep the grabbed desk point under the pointer by translating F.

// --- Tuning -----------------------------------------------------------------
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 2.5;
/** Wheel: zoom *= exp(-delta * sensitivity). One 100 px notch is about +/-17 %. */
export const WHEEL_SENSITIVITY = 0.0016;
/** Trackpad pinch arrives as a wheel event with ctrlKey and small deltas. */
export const PINCH_SENSITIVITY = 0.012;
/** Multiplier for the + / - keys and the on-screen buttons. */
export const BUTTON_ZOOM_STEP = 1.25;
/** Zoom reached by the Z key when starting from the fitted view. */
export const TOGGLE_ZOOM_LEVEL = 2;
/** Below this the level snaps back to exactly 1 (and the pan to the centre). */
export const ZOOM_SNAP_FIT = 1.03;
/** Dragging pans only above this zoom. */
export const PAN_MIN_LEVEL = 1.05;
/** Pointer travel (px) before a press becomes a drag instead of a click. */
export const DRAG_THRESHOLD_PX = 5;
/** From this zoom a click no longer turns the page (arrows / keys still do) and corner hover is off. */
export const ZOOM_CLICK_BLOCK = 1.3;
/** Camera smoothing (s) while zooming / panning; page-to-page pose changes keep their own, slower time. */
export const ZOOM_SMOOTH_TIME = 0.28;
/** How long (ms) after the last zoom input the faster smoothing stays active. */
export const INPUT_ACTIVE_MS = 1000;
/** Straightening towards a top-down view: starts at FROM, reaches MAX (0..1 of the way to vertical) at TO. */
const STRAIGHTEN_FROM = 1;
const STRAIGHTEN_TO = 2.2;
const STRAIGHTEN_MAX = 0.75; // stay below 1 so the view direction is never exactly vertical
/** Extra desk (world units) the pan may reveal around the book edges. */
const PAN_MARGIN = 0.12;
/** Height of the desk strip used to anchor the cursor (about the top of the page stacks). */
const ANCHOR_PLANE_Y = 0.04;
// ------------------------------------------------------------------------------

/** Mutable on purpose: read inside useFrame and event handlers without re-rendering anything. */
export const zoomState = {
  /** Target zoom (the camera eases towards it). */
  level: 1,
  /** Target focus offset from the open pose's look-at point, on the desk plane (world units). */
  panX: 0,
  panZ: 0,
  dragging: false,
  /** True from the moment a press turned into a drag until the next pointerdown (blocks the click). */
  dragged: false,
  /** performance.now() of the last zoom / pan input. */
  lastInput: 0,
};

const listeners = new Set<() => void>();
export function subscribeZoom(callback: () => void): () => void {
  listeners.add(callback);
  return () => void listeners.delete(callback);
}
const emit = () => listeners.forEach((callback) => callback());
const markInput = () => {
  zoomState.lastInput = performance.now();
};

/** Everything the zoom math needs to know about the base ("open") pose and the viewport. */
export interface ZoomView {
  aspect: number;
  tanHalfFov: number;
  basePos: Vector3;
  baseLook: Vector3;
  /** Half width of the desk strip visible at zoom 1, around the focus point (world units). */
  halfWidth1: number;
  /** Half width (world units) of the area the focus may roam: the whole spread, or one page in one-page mode. */
  spanHalf: number;
}

const UP = new Vector3(0, 1, 0);
const dir = new Vector3();
const offset = new Vector3();
const camPos = new Vector3();
const camLook = new Vector3();
const forward = new Vector3();
const right = new Vector3();
const upAxis = new Vector3();
const ray = new Vector3();
const hitA = new Vector3();
const hitB = new Vector3();

const smoothstep = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Camera position / look-at for a zoom level and pan. At level 1 and zero pan it equals the base pose. */
export function solveZoomCamera(
  view: ZoomView,
  level: number,
  panX: number,
  panZ: number,
  outPos: Vector3,
  outLook: Vector3,
): void {
  offset.copy(view.basePos).sub(view.baseLook);
  const baseDistance = offset.length();
  dir.copy(offset).divideScalar(baseDistance);
  dir.lerp(UP, STRAIGHTEN_MAX * smoothstep(STRAIGHTEN_FROM, STRAIGHTEN_TO, level)).normalize();

  outLook.set(view.baseLook.x + panX, view.baseLook.y, view.baseLook.z + panZ);
  outPos.copy(outLook).addScaledVector(dir, baseDistance / level);
}

/** Where the screen ray (NDC, y up) hits the desk, for the camera defined by level / pan. */
function hitDesk(view: ZoomView, level: number, panX: number, panZ: number, ndcX: number, ndcY: number, out: Vector3) {
  solveZoomCamera(view, level, panX, panZ, camPos, camLook);
  forward.copy(camLook).sub(camPos).normalize();
  right.crossVectors(forward, UP).normalize();
  upAxis.crossVectors(right, forward);
  ray
    .copy(forward)
    .addScaledVector(right, ndcX * view.tanHalfFov * view.aspect)
    .addScaledVector(upAxis, ndcY * view.tanHalfFov);
  const t = (ANCHOR_PLANE_Y - camPos.y) / ray.y;
  return out.copy(camPos).addScaledVector(ray, t);
}

/** Keeps the focus inside the book (plus a small margin); at zoom 1 the range is zero. */
function clampPan(view: ZoomView): void {
  const halfX = view.halfWidth1 / zoomState.level;
  const halfZ = halfX / view.aspect;
  const rangeX = Math.max(0, view.spanHalf - halfX + PAN_MARGIN);
  const rangeZ = Math.max(0, COVER_H / 2 - halfZ + PAN_MARGIN);
  zoomState.panX = MathUtils.clamp(zoomState.panX, -rangeX, rangeX);
  zoomState.panZ = MathUtils.clamp(zoomState.panZ, -rangeZ, rangeZ);
}

const clampLevel = (level: number) => (level < ZOOM_SNAP_FIT ? ZOOM_MIN : Math.min(level, ZOOM_MAX));

/** Sets the zoom keeping the desk point under the cursor (NDC) fixed. */
export function zoomAt(view: ZoomView, ndcX: number, ndcY: number, newLevel: number): void {
  const level = clampLevel(newLevel);
  hitDesk(view, zoomState.level, zoomState.panX, zoomState.panZ, ndcX, ndcY, hitA);
  zoomState.level = level;
  hitDesk(view, level, zoomState.panX, zoomState.panZ, ndcX, ndcY, hitB);
  zoomState.panX += hitA.x - hitB.x;
  zoomState.panZ += hitA.z - hitB.z;
  clampPan(view);
  markInput();
  emit();
}

/** Drag: moves the focus so the desk point that was under (fromNdc) ends up under (toNdc). */
export function panDrag(view: ZoomView, fromX: number, fromY: number, toX: number, toY: number): void {
  hitDesk(view, zoomState.level, zoomState.panX, zoomState.panZ, fromX, fromY, hitA);
  hitDesk(view, zoomState.level, zoomState.panX, zoomState.panZ, toX, toY, hitB);
  zoomState.panX += hitA.x - hitB.x;
  zoomState.panZ += hitA.z - hitB.z;
  clampPan(view);
  markInput();
}

export function resetZoom(): void {
  if (zoomState.level === ZOOM_MIN && zoomState.panX === 0 && zoomState.panZ === 0) return;
  zoomState.level = ZOOM_MIN;
  zoomState.panX = 0;
  zoomState.panZ = 0;
  markInput();
  emit();
}

export const isZoomed = (): boolean => zoomState.level > ZOOM_MIN + 0.001;
/** True while the faster zoom smoothing should apply. */
export const isZoomInteracting = (): boolean =>
  isZoomed() || performance.now() - zoomState.lastInput < INPUT_ACTIVE_MS;
/** A click must not turn the page: after a drag, or while zoomed in. */
export const isFlipBlocked = (): boolean => zoomState.dragged || zoomState.level >= ZOOM_CLICK_BLOCK;
/** Corner hover is off while dragging or zoomed in. */
export const isHoverSuppressed = (): boolean => zoomState.dragging || zoomState.level >= ZOOM_CLICK_BLOCK;
