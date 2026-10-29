import type { CSSProperties, ReactNode } from 'react';
import { FACE_SIZE } from './faceIds';

export type PageTheme = 'light' | 'paper' | 'dark' | 'cover';

// Values mirror the design tokens (void, paper-white, paper, cover).
const BACKGROUND: Record<PageTheme, string> = {
  light: '#f7f5ef',
  paper: '#ece4d2',
  dark: '#05060a',
  cover: '#12151f',
};

// Paper / cloth grain: tiny SVG noise, tiled.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// Shading next to the spine, so each page reads as part of a bound book.
const GUTTER_PX = 150;

interface PageFrameProps {
  theme: PageTheme;
  /** Which page of the spread this is: the spine sits on the opposite edge. Omit for the cover. */
  side?: 'L' | 'R';
  children: ReactNode;
}

/** Exact 1600x1100 canvas for one face. The export script screenshots `[data-page-frame]`. */
export function PageFrame({ theme, side, children }: PageFrameProps) {
  const dark = theme === 'dark' || theme === 'cover';

  const frame: CSSProperties = {
    width: FACE_SIZE.w,
    height: FACE_SIZE.h,
    background: BACKGROUND[theme],
  };

  const gutter: CSSProperties | null = side
    ? {
        width: GUTTER_PX,
        [side === 'L' ? 'right' : 'left']: 0,
        background: `linear-gradient(${side === 'L' ? 'to left' : 'to right'}, rgba(0,0,0,${
          dark ? 0.55 : 0.2
        }), rgba(0,0,0,0))`,
      }
    : null;

  return (
    <div data-page-frame className="relative overflow-hidden" style={frame}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          opacity: dark ? 0.07 : 0.06,
          mixBlendMode: dark ? 'screen' : 'multiply',
        }}
      />
      <div className="relative h-full w-full">{children}</div>
      {gutter && <div className="absolute top-0 bottom-0" style={gutter} />}
    </div>
  );
}
