import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { MathUtils, Vector3 } from 'three';
import { isEntered } from '../lib/loadProgress';
import { motion } from '../lib/motion';
import { useBook } from '../store/useBook';
import { COVER_W, PAGE_W } from './bookLayout';
import type { V3 } from './types';
import { ZOOM_SMOOTH_TIME, isZoomInteracting, resetZoom, solveZoomCamera, zoomState, type ZoomView } from './zoomCamera';

// --- Tuning -----------------------------------------------------------------
export const CAMERA_FOV = 35;
/**
 * Base poses (direction + look-at point). "closed" is roughly 30 degrees from the vertical.
 * Raise position.y for a more top-down view; move position.z closer to 0 to straighten it.
 * The distance of "open" and "closed" is then adjusted by OPEN_FILL / CLOSED_DISTANCE_FACTOR below.
 */
export const CAMERA_POSES: Record<'closed' | 'open' | 'closedBack', { position: V3; lookAt: V3 }> = {
  closed: { position: [0, 3.38, 2.15], lookAt: [0, 0, 0.2] },
  // Open book: closer and more top-down, centred on the spine.
  open: { position: [0, 3.05, 1.45], lookAt: [0, 0, 0.4] },
  // Book closed from behind: same framing as "closed" (the book is mirrored on the desk).
  closedBack: { position: [0, 3.38, 2.15], lookAt: [0, 0, 0.2] },
};
const SMOOTH_TIME = 0.7; // seconds; higher = slower camera
/** With prefers-reduced-motion the camera follows its target without easing. */
const REDUCED_MOTION_SMOOTH_TIME = 0.0001;

/**
 * Open book: fraction of the window width the spread should cover. The camera distance is computed
 * from the window aspect so the framing holds on 16:9, 16:10 and 4:3 windows.
 * Previous value: none (fixed distance, which covered ~0.73 of a 16:9 window).
 */
export const OPEN_FILL = 0.84;
/** Camera distance limits (world units) for the open pose. */
const OPEN_DISTANCE_LIMITS: [number, number] = [2.3, 4.6];
/**
 * Closed / closed-back book: fraction of the original camera distance (1 = previous framing,
 * smaller = closer). Previous value: 1.
 */
export const CLOSED_DISTANCE_FACTOR = 0.9;

// --- One page at a time (phones, narrow / portrait windows) ---
/** Nearly top-down so a single page reads without foreshortening. */
const COMPACT_OPEN_POSE: { position: V3; lookAt: V3 } = { position: [0, 3.3, 0.78], lookAt: [0, 0, 0.4] };
/** Fraction of the window width one page covers. */
export const COMPACT_FILL = 0.96;
const COMPACT_DISTANCE_LIMITS: [number, number] = [1.6, 9];
/** Fraction of the window width the closed book covers. */
const COMPACT_CLOSED_FILL = 0.9;
/** Closed book centre relative to the camera look-at x (the spine sits at -0.52 / +0.52 on the desk, see Book.tsx). */
const COMPACT_CLOSED_CENTER_X = COVER_W / 2 - 0.52;

// --- Entry dolly and idle drift (closed book only) ---
/** At the start the camera is pulled back along its view direction by this fraction of its distance... */
const INTRO_PULLBACK = 0.55;
/** ...and raised by this much; both ease to zero once the loader has finished. */
const INTRO_RISE = 0.9;
const INTRO_SMOOTH = 0.9; // seconds
const DRIFT_AMPLITUDE: V3 = [0.07, 0.025, 0.04]; // world units (x, y, z)
const DRIFT_SPEED = 0.33; // rad / s of the slowest component
const DRIFT_FADE = 1.2; // seconds to fade the drift in / out
// ------------------------------------------------------------------------------

export type CameraPose = keyof typeof CAMERA_POSES;

const TAN_HALF_FOV = Math.tan(MathUtils.degToRad(CAMERA_FOV / 2));
const OPEN_SPREAD_WIDTH = 2 * COVER_W; // both pages plus the cover boards
const PAGE_FRAME_WIDTH = COVER_W; // one page plus its cover board

/** Writes the final camera position / look-at for a pose and window aspect into the given vectors. */
function resolvePose(
  pose: CameraPose,
  aspect: number,
  position: Vector3,
  lookAt: Vector3,
  compact = false,
  side: 'L' | 'R' = 'L',
) {
  const base = compact && pose === 'open' ? COMPACT_OPEN_POSE : CAMERA_POSES[pose];
  lookAt.set(...base.lookAt);
  position.set(...base.position).sub(lookAt); // offset from the look-at point
  const length = position.length();

  let distance: number;
  if (pose === 'open') {
    distance = compact
      ? MathUtils.clamp(
          PAGE_FRAME_WIDTH / (COMPACT_FILL * 2 * TAN_HALF_FOV * aspect),
          COMPACT_DISTANCE_LIMITS[0],
          COMPACT_DISTANCE_LIMITS[1],
        )
      : MathUtils.clamp(
          OPEN_SPREAD_WIDTH / (OPEN_FILL * 2 * TAN_HALF_FOV * aspect),
          OPEN_DISTANCE_LIMITS[0],
          OPEN_DISTANCE_LIMITS[1],
        );
  } else {
    distance = length * CLOSED_DISTANCE_FACTOR;
    // A portrait window is narrower than the closed book at the desktop distance: back off until it fits.
    if (compact) distance = Math.max(distance, COVER_W / (COMPACT_CLOSED_FILL * 2 * TAN_HALF_FOV * aspect));
  }

  position.multiplyScalar(distance / length).add(lookAt);

  if (compact) {
    // Centre on the visible page (open) or on the closed book (the desk layout offsets it from x = 0).
    const shift =
      pose === 'open' ? (side === 'L' ? -PAGE_W / 2 : PAGE_W / 2) : pose === 'closed' ? COMPACT_CLOSED_CENTER_X : -COMPACT_CLOSED_CENTER_X;
    position.x += shift;
    lookAt.x += shift;
  }
}

const zoomView: ZoomView = {
  aspect: 1,
  tanHalfFov: TAN_HALF_FOV,
  basePos: new Vector3(),
  baseLook: new Vector3(),
  halfWidth1: 1,
  spanHalf: COVER_W,
};

/** The open pose as the zoom math needs it, for a given viewport aspect (shared object, do not keep it). */
export function getZoomView(aspect: number): ZoomView {
  const { compact, faceSide } = useBook.getState();
  resolvePose('open', aspect, zoomView.basePos, zoomView.baseLook, compact, faceSide);
  zoomView.aspect = aspect;
  zoomView.halfWidth1 = zoomView.basePos.distanceTo(zoomView.baseLook) * TAN_HALF_FOV * aspect;
  zoomView.spanHalf = compact ? COVER_W / 2 : COVER_W;
  return zoomView;
}

const viewDirection = new Vector3();

/** Eases the camera towards a pose. Everything lives in refs: no state updates per frame. */
export function CameraRig({ pose = 'closed' }: { pose?: CameraPose }) {
  const lookAt = useRef(new Vector3(...CAMERA_POSES.closed.lookAt));
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());
  // Entry dolly (1 -> 0) and idle drift (0 -> 1) amounts; a deep link or reduced motion skips the dolly.
  // `time` is our own accumulator: R3F resets `clock.elapsedTime` whenever the frameloop restarts (hidden tab), which would jerk the drift phase.
  const fx = useRef({ intro: useBook.getState().page === 0 && !motion.reduced ? 1 : 0, drift: 0, time: 0 });
  const compact = useBook((s) => s.compact);
  const faceSide = useBook((s) => s.faceSide);

  // Zoom only exists on the open book: leaving that pose resets it.
  useEffect(() => {
    if (pose !== 'open') resetZoom();
  }, [pose]);

  // One-page mode: turning to another face starts at the fitted view of that face.
  useEffect(() => {
    if (compact) resetZoom();
  }, [compact, faceSide]);

  useFrame(({ camera, size }, delta) => {
    const aspect = size.width / size.height;
    const reduced = motion.reduced;
    let smooth = reduced ? REDUCED_MOTION_SMOOTH_TIME : SMOOTH_TIME;

    if (pose === 'open') {
      solveZoomCamera(
        getZoomView(aspect),
        zoomState.level,
        zoomState.panX,
        zoomState.panZ,
        targetPosition.current,
        targetLookAt.current,
      );
      if (isZoomInteracting()) smooth = reduced ? REDUCED_MOTION_SMOOTH_TIME : ZOOM_SMOOTH_TIME;
    } else {
      resolvePose(pose, aspect, targetPosition.current, targetLookAt.current, compact, faceSide);
    }

    const state = fx.current;
    state.time += Math.min(delta, 0.1);
    const entered = isEntered();
    if (reduced) {
      state.intro = 0;
      state.drift = 0;
    } else {
      easing.damp(state, 'intro', entered ? 0 : state.intro, INTRO_SMOOTH, delta);
      easing.damp(state, 'drift', pose === 'closed' && entered ? 1 : 0, DRIFT_FADE, delta);
    }

    if (state.intro > 0.001) {
      // Pulled back and up while the loader is on screen, then dollying in to the closed pose.
      viewDirection.copy(targetPosition.current).sub(targetLookAt.current);
      targetPosition.current.addScaledVector(viewDirection, state.intro * INTRO_PULLBACK);
      targetPosition.current.y += state.intro * INTRO_RISE;
    }
    if (state.drift > 0.001) {
      const t = state.time * DRIFT_SPEED;
      targetPosition.current.x += Math.sin(t) * DRIFT_AMPLITUDE[0] * state.drift;
      targetPosition.current.y += Math.sin(t * 1.43 + 1.2) * DRIFT_AMPLITUDE[1] * state.drift;
      targetPosition.current.z += Math.cos(t * 0.87) * DRIFT_AMPLITUDE[2] * state.drift;
    }

    easing.damp3(camera.position, targetPosition.current, smooth, delta);
    easing.damp3(lookAt.current, targetLookAt.current, smooth, delta);
    camera.lookAt(lookAt.current);
  });

  return null;
}

/** Picks the pose from the book state; lives apart so the Canvas parent does not re-render on page changes. */
export function BookCameraRig() {
  const page = useBook((s) => s.page);
  const pose: CameraPose = page === 0 ? 'closed' : page >= 10 ? 'closedBack' : 'open';
  return <CameraRig pose={pose} />;
}
