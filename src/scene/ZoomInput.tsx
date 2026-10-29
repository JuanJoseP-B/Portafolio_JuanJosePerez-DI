import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useBook } from '../store/useBook';
import { getZoomView } from './CameraRig';
import { isBookOpen, resetZoom, toggleZoom, zoomStep } from './zoomActions';
import {
  BUTTON_ZOOM_STEP,
  DRAG_THRESHOLD_PX,
  PAN_MIN_LEVEL,
  PINCH_SENSITIVITY,
  WHEEL_SENSITIVITY,
  ZOOM_CLICK_BLOCK,
  panDrag,
  subscribeZoom,
  zoomAt,
  zoomState,
} from './zoomCamera';

const LINE_HEIGHT_PX = 16; // wheel deltaMode 1 (lines)
const PAGE_HEIGHT_PX = 100; // wheel deltaMode 2 (pages)

// One-page (compact) mode: a quick, mostly horizontal swipe at the fitted view turns the face.
const SWIPE_MIN_PX = 48;
const SWIPE_MAX_MS = 800;
const SWIPE_HORIZONTAL_RATIO = 1.5; // |dx| must exceed |dy| by this factor

/**
 * Pointer and keyboard input for the zoom (renders nothing; lives inside the Canvas to reach its element).
 * Wheel = zoom to the cursor, drag = pan, double click = back to the fitted view, Z / + / - / 0 = keyboard.
 * Touch: two fingers pinch-zoom, one finger pans when zoomed; in one-page mode a swipe at 1x turns the face.
 * Listeners sit on the element that wraps the canvas and the drei <Html> layers (hotspots, video, form), so
 * the wheel and the pan also work over them; overlay buttons and the text version never trigger them.
 */
export function ZoomInput() {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const el = gl.domElement;
    // R3F wraps the canvas in two divs; the outer one is the event source and the parent of every <Html> layer.
    const surface = el.parentElement?.parentElement ?? el;
    const previousTouchAction = surface.style.touchAction;
    surface.style.touchAction = 'none'; // let pointer events drive the pan instead of browser scrolling

    let pressed = false;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    // Touch pointers (for the pinch) and the press that might become a swipe.
    const touches = new Map<number, { x: number; y: number }>();
    let pinch: { distance: number; level: number } | null = null;
    let swipe: { id: number; x: number; y: number; time: number } | null = null;

    // Client coordinates -> NDC of the canvas (y up).
    const ndcX = (clientX: number, rect: DOMRect) => ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = (clientY: number, rect: DOMRect) => -(((clientY - rect.top) / rect.height) * 2 - 1);

    const updateCursor = () => {
      el.style.cursor = zoomState.dragging ? 'grabbing' : zoomState.level > PAN_MIN_LEVEL ? 'grab' : '';
    };

    const onWheel = (event: WheelEvent) => {
      if (!isBookOpen()) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? LINE_HEIGHT_PX : event.deltaMode === 2 ? PAGE_HEIGHT_PX : 1;
      const sensitivity = event.ctrlKey ? PINCH_SENSITIVITY : WHEEL_SENSITIVITY;
      const rect = el.getBoundingClientRect();
      zoomAt(
        getZoomView(rect.width / rect.height),
        ndcX(event.clientX, rect),
        ndcY(event.clientY, rect),
        zoomState.level * Math.exp(-event.deltaY * unit * sensitivity),
      );
    };

    const pinchGeometry = () => {
      const [a, b] = [...touches.values()];
      return { distance: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touches.size === 2 && isBookOpen()) {
        // A second finger: cancel any pan or swipe and start pinching from the current zoom.
        pressed = false;
        swipe = null;
        zoomState.dragging = false;
        zoomState.dragged = true; // the lift of the fingers must not count as a tap
        pinch = { distance: Math.max(1, pinchGeometry().distance), level: zoomState.level };
        return;
      }
      if (event.button !== 0 || !event.isPrimary) return;
      zoomState.dragged = false;
      swipe = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
      if (!isBookOpen()) return;
      pressed = true;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = lastY = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (touches.has(event.pointerId)) touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pinch && touches.size >= 2) {
        const now = pinchGeometry();
        const rect = el.getBoundingClientRect();
        zoomAt(
          getZoomView(rect.width / rect.height),
          ndcX(now.x, rect),
          ndcY(now.y, rect),
          pinch.level * (now.distance / pinch.distance),
        );
        return;
      }
      if (!pressed || event.pointerId !== pointerId) return;

      if (!zoomState.dragging) {
        if (zoomState.level <= PAN_MIN_LEVEL) return;
        if (Math.hypot(event.clientX - startX, event.clientY - startY) < DRAG_THRESHOLD_PX) return;
        zoomState.dragging = true;
        zoomState.dragged = true; // the click that follows the release must not turn the page
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          // The pointer may already be gone; the drag still works while it stays over the canvas.
        }
        lastX = event.clientX;
        lastY = event.clientY;
        updateCursor();
        return;
      }

      const rect = el.getBoundingClientRect();
      panDrag(
        getZoomView(rect.width / rect.height),
        ndcX(lastX, rect),
        ndcY(lastY, rect),
        ndcX(event.clientX, rect),
        ndcY(event.clientY, rect),
      );
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const endDrag = (event?: PointerEvent) => {
      if (event) {
        touches.delete(event.pointerId);
        if (pinch && touches.size < 2) {
          pinch = null;
          pressed = false; // the finger left on the screen must not start a pan
        }
      } else {
        touches.clear();
        pinch = null;
      }
      if (event && event.pointerId !== pointerId) return;
      pressed = false;
      if (zoomState.dragging) {
        zoomState.dragging = false;
        if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
        updateCursor();
      }
    };
    // Leaving the page mid-press (opening a demo link in a new tab) never delivers the pointerup:
    // drop any pan, pinch or swipe still "in progress" so none of it survives the trip.
    const onBlur = () => {
      swipe = null;
      endDrag();
    };
    const onVisibility = () => {
      if (document.hidden) onBlur();
    };

    /** One-page mode: a quick horizontal swipe at the fitted view turns one face (left = forward). */
    const onPointerUp = (event: PointerEvent) => {
      const start = swipe;
      if (start && event.pointerId === start.id) {
        swipe = null;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (
          !pinch &&
          useBook.getState().compact &&
          zoomState.level <= PAN_MIN_LEVEL &&
          Math.abs(dx) >= SWIPE_MIN_PX &&
          Math.abs(dx) > SWIPE_HORIZONTAL_RATIO * Math.abs(dy) &&
          performance.now() - start.time <= SWIPE_MAX_MS
        ) {
          zoomState.dragged = true; // the tap that follows the release must not act
          const book = useBook.getState();
          if (dx < 0) book.nextFace();
          else book.prevFace();
        }
      }
      endDrag(event);
    };
    const onPointerCancel = (event: PointerEvent) => {
      swipe = null;
      endDrag(event);
    };

    // Page flips never use double click, so it only has one job: leave the zoom.
    const onDoubleClick = (event: MouseEvent) => {
      if (zoomState.level <= PAN_MIN_LEVEL) return;
      event.preventDefault();
      resetZoom();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      if (!isBookOpen()) return;

      switch (event.key) {
        case 'z':
        case 'Z':
          event.preventDefault();
          toggleZoom();
          break;
        case '+':
        case '=':
          event.preventDefault();
          zoomStep(BUTTON_ZOOM_STEP);
          break;
        case '-':
        case '_':
          event.preventDefault();
          zoomStep(1 / BUTTON_ZOOM_STEP);
          break;
        case '0':
          event.preventDefault();
          resetZoom();
          break;
      }
    };

    const offZoom = subscribeZoom(() => {
      // Zoomed in: no corner lift, and a stale hover must not keep the book "pressed".
      if (zoomState.level >= ZOOM_CLICK_BLOCK) useBook.getState().setHoveredSide(null);
      updateCursor();
    });

    surface.addEventListener('wheel', onWheel, { passive: false });
    surface.addEventListener('pointerdown', onPointerDown);
    surface.addEventListener('pointermove', onPointerMove);
    surface.addEventListener('pointerup', onPointerUp);
    surface.addEventListener('pointercancel', onPointerCancel);
    surface.addEventListener('lostpointercapture', endDrag);
    surface.addEventListener('dblclick', onDoubleClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      offZoom();
      surface.removeEventListener('wheel', onWheel);
      surface.removeEventListener('pointerdown', onPointerDown);
      surface.removeEventListener('pointermove', onPointerMove);
      surface.removeEventListener('pointerup', onPointerUp);
      surface.removeEventListener('pointercancel', onPointerCancel);
      surface.removeEventListener('lostpointercapture', endDrag);
      surface.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      surface.style.touchAction = previousTouchAction;
      el.style.cursor = '';
      zoomState.dragging = false;
    };
  }, [gl]);

  return null;
}
