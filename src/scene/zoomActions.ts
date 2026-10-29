import { useBook } from '../store/useBook';
import { getZoomView } from './CameraRig';
import { PAN_MIN_LEVEL, TOGGLE_ZOOM_LEVEL, resetZoom, zoomAt, zoomState } from './zoomCamera';

// Zoom commands shared by the canvas input, the keyboard and the on-screen buttons.
// The canvas fills the window, so the window aspect is the camera aspect.

/** Zoom only exists while a spread is open (pages 1..9). */
export const isBookOpen = (): boolean => {
  const target = useBook.getState().target;
  return target >= 1 && target <= 9;
};

const windowAspect = () => window.innerWidth / Math.max(1, window.innerHeight);

/** Multiplies the zoom, anchored at a point of the screen (NDC; default = centre). */
export function zoomStep(factor: number, ndcX = 0, ndcY = 0): void {
  if (!isBookOpen()) return;
  zoomAt(getZoomView(windowAspect()), ndcX, ndcY, zoomState.level * factor);
}

/** Z key: back to the fitted view if zoomed, otherwise to TOGGLE_ZOOM_LEVEL at the centre. */
export function toggleZoom(): void {
  if (!isBookOpen()) return;
  if (zoomState.level > PAN_MIN_LEVEL) resetZoom();
  else zoomAt(getZoomView(windowAspect()), 0, 0, TOGGLE_ZOOM_LEVEL);
}

export { resetZoom };
