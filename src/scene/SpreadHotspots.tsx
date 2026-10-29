import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { portfolio, type Project } from '../content/portfolio';
import { hotspotsForFace, type Hotspot } from '../lib/hotspots';
import { motion, prefersReducedMotion } from '../lib/motion';
import { isPlaceholder } from '../lib/placeholder';
import { SPREADS, hashFromPage } from '../lib/spreads';
import { BACK_COVER_ID, FACE_SIZE } from '../pages-design/faceIds';
import { useBook } from '../store/useBook';
import { ContactForm } from '../ui/ContactForm';
import { COMPACT_FILL } from './CameraRig';
import { COVER_THICK, COVER_W, LAST_LEAF, PAGE_THICK, PAGE_W, PITCH, STACK_BASE_Y } from './bookLayout';
import { zoomState } from './zoomCamera';

const { contact, person, projects } = portfolio;

// --- Tuning -----------------------------------------------------------------
/** drei Html (transform) draws 1 css px as `distanceFactor / 400` world units. */
const distanceFactorFor = (worldWidth: number): number => (worldWidth / FACE_SIZE.w) * 400;
/** Lifts the flat DOM layer just above the paper so it never sits inside it. */
const SURFACE_LIFT = 0.001;
const FADE_MS = 200;
/** One-page mode: comfortable touch target (screen px) and how far a printed button may grow to reach it. */
const TOUCH_TARGET_PX = 44;
const TOUCH_MAX_GROWTH = 1.8;
// ------------------------------------------------------------------------------

const projectOf = (key: string): Project | undefined => projects.find((p) => p.id === key);

/** Final URL of a link hotspot: always read from the content, the exported json only locates it. */
function resolveHref(h: Hotspot): string | null {
  const [head, kind] = h.id.split('-');
  const project = projectOf(head);
  if (project && kind === 'github') return project.repo;
  if (project && kind === 'demo') return project.demo;
  if (h.id === 'email') return `mailto:${contact.email}`;
  if (h.id === 'linkedin') return contact.linkedin;
  if (h.id === 'github') return contact.github;
  return h.href;
}

function linkLabel(h: Hotspot): string {
  const [head, kind] = h.id.split('-');
  const project = projectOf(head);
  if (project && kind === 'github') return `Repositorio de ${project.name} en GitHub (se abre en una pestaña nueva)`;
  if (project && kind === 'demo') return `Demo en vivo de ${project.name} (se abre en una pestaña nueva)`;
  if (h.id === 'email') return `Escribir un correo a ${contact.email}`;
  if (h.id === 'linkedin') return `LinkedIn de ${person.shortName} (se abre en una pestaña nueva)`;
  if (h.id === 'github') return `GitHub de ${person.shortName} (se abre en una pestaña nueva)`;
  return h.id;
}

/**
 * Position in face pixels. `touchPx` (> 0 in one-page mode) is how many face pixels make a comfortable touch target:
 * small buttons grow around their centre towards it, up to TOUCH_MAX_GROWTH so neighbours do not overlap.
 */
const rect = (h: Hotspot, touchPx = 0): CSSProperties => {
  const grow = (size: number) => (touchPx > size ? Math.min(touchPx, size * TOUCH_MAX_GROWTH) : size);
  const width = grow(h.w);
  const height = grow(h.h);
  return {
    position: 'absolute',
    left: h.x - (width - h.w) / 2,
    top: h.y - (height - h.h) / 2,
    width,
    height,
    pointerEvents: 'auto',
  };
};

/** Pill-shaped hotspots (buttons) get round corners; rows and panels a softer radius. */
const radiusOf = (h: Hotspot): number => (h.h < 80 ? 999 : 16);

const HOT =
  'block cursor-pointer outline-none transition-[box-shadow,background-color] duration-150 hover:bg-[rgba(92,225,230,0.12)] hover:shadow-[0_0_0_4px_rgba(92,225,230,0.95)] focus-visible:bg-[rgba(92,225,230,0.12)] focus-visible:shadow-[0_0_0_4px_rgba(92,225,230,0.95)]';

/** A click on a hotspot must not also turn the page (the book's hit area sits underneath). */
const swallow = (event: ReactMouseEvent): boolean => {
  event.stopPropagation();
  if (zoomState.dragged) {
    event.preventDefault(); // this click ended a pan, not a press
    return false;
  }
  return true;
};

/** While the pointer is over a hotspot the book's corner lift is off (the flat layer would not follow it). */
const hoverProps = (id: string) => ({
  onPointerEnter: () => {
    const book = useBook.getState();
    book.setHoveredSide(null);
    book.setHoveredHotspot(id);
  },
  onPointerLeave: () => useBook.getState().setHoveredHotspot(null),
});

function GotoSpot({ h, touchPx }: { h: Hotspot; touchPx: number }) {
  const page = h.page ?? 0;
  return (
    <a
      href={hashFromPage(page)}
      aria-label={`Ir a ${SPREADS[page]?.label ?? 'la página'}`}
      className={HOT}
      style={{ ...rect(h, touchPx), borderRadius: radiusOf(h) }}
      {...hoverProps(h.id)}
      onClick={(event) => {
        if (!swallow(event)) return;
        event.preventDefault();
        useBook.getState().setTarget(page);
      }}
    />
  );
}

function LinkSpot({ h, touchPx }: { h: Hotspot; touchPx: number }) {
  const href = resolveHref(h);
  if (!href || isPlaceholder(href)) return null;
  const external = !href.startsWith('mailto:');
  return (
    <a
      href={href}
      aria-label={linkLabel(h)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={HOT}
      style={{ ...rect(h, touchPx), borderRadius: radiusOf(h) }}
      {...hoverProps(h.id)}
      onClick={swallow}
    />
  );
}

/** CV button: a real download once the PDF exists, otherwise a visible placeholder (never a dead link). */
function DownloadSpot({ h, touchPx }: { h: Hotspot; touchPx: number }) {
  if (person.cvAvailable) {
    return (
      <a
        href={person.cv}
        download
        aria-label="Descargar CV en PDF"
        className={HOT}
        style={{ ...rect(h, touchPx), borderRadius: radiusOf(h) }}
        {...hoverProps(h.id)}
        onClick={swallow}
      />
    );
  }
  return (
    <div
      role="link"
      aria-disabled="true"
      aria-label="Descargar CV: el archivo aún no está disponible"
      title="El PDF del CV aún no está disponible"
      className="flex items-center justify-center text-center font-mono text-[20px] uppercase tracking-[0.1em] text-[#1b1813]"
      style={{
        ...rect(h, touchPx),
        borderRadius: radiusOf(h),
        background: 'rgba(255,181,71,0.92)',
        outline: '3px dashed #1b1813',
        outlineOffset: -6,
        cursor: 'not-allowed',
      }}
      onClick={swallow}
    >
      [CV PRÓXIMAMENTE]
    </div>
  );
}

// How the demo clip is clipped so it matches the printed screen it plays over.
const VIDEO_SHAPE: Record<string, CSSProperties> = {
  argos: { borderRadius: '0 0 18px 18px' },
  segundoaire: { borderRadius: 52 },
  arcofisio: {
    WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 70px)',
    maskImage: 'linear-gradient(to right, transparent 0, #000 70px)',
  },
};

/** Short demo clip over the printed capture: plays on hover / focus, pauses on leave (click toggles). */
function VideoSpot({ h }: { h: Hotspot }) {
  const project = projectOf(h.id.replace(/^video-/, ''));
  const video = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false); // a frame is on screen: fade the clip in over the capture
  const [reduced] = useState(prefersReducedMotion);

  if (!project || isPlaceholder(project.video)) return null;

  const play = () => void video.current?.play().catch(() => undefined);
  const stop = () => {
    const v = video.current;
    if (!v) return;
    v.pause();
    if (v.readyState > 0) v.currentTime = 0;
    setLive(false);
  };

  return (
    <button
      type="button"
      aria-label={`Demo en video de ${project.name}`}
      className={`${HOT} overflow-hidden p-0`}
      style={{ ...rect(h), ...VIDEO_SHAPE[project.id] }}
      onPointerEnter={(event) => {
        hoverProps(h.id).onPointerEnter();
        if (!reduced && event.pointerType !== 'touch') play(); // reduced motion: only on click
      }}
      onPointerLeave={() => {
        hoverProps(h.id).onPointerLeave();
        stop();
      }}
      onFocus={() => !reduced && play()}
      onBlur={stop}
      onClick={(event) => {
        if (!swallow(event)) return;
        const v = video.current;
        if (v && !v.paused) stop();
        else play();
      }}
    >
      <video
        ref={video}
        src={project.video}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => setLive(true)}
        className="h-full w-full object-cover"
        style={{ opacity: live ? 1 : 0, transition: 'opacity 250ms' }}
      />
    </button>
  );
}

function FormSpot({ h, compact }: { h: Hotspot; compact: boolean }) {
  if (compact) {
    // The printed area is a few dozen pixels wide on a phone: a big button opens the form in a sheet instead.
    return (
      <button
        type="button"
        aria-label="Abrir el formulario de contacto"
        className="flex flex-col items-center justify-center gap-[18px] bg-white p-[24px] text-center font-display text-[66px] font-semibold leading-[1.05] text-black"
        style={{ ...rect(h), borderRadius: 40 }}
        onClick={(event) => {
          if (!swallow(event)) return;
          useBook.getState().setContactOpen(true);
        }}
      >
        Escribir un mensaje
        <span aria-hidden="true" className="font-mono text-[34px] uppercase tracking-[0.12em]">
          Tocar para abrir →
        </span>
      </button>
    );
  }
  return (
    <div
      style={rect(h)}
      {...hoverProps(h.id)}
      // Typing, text selection and clicks inside the form belong to the form: no pan, no page turn.
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <ContactForm variant="book" />
    </div>
  );
}

function Spot({ h, touchPx, compact }: { h: Hotspot; touchPx: number; compact: boolean }) {
  switch (h.action) {
    case 'goto':
      return <GotoSpot h={h} touchPx={touchPx} />;
    case 'link':
      return <LinkSpot h={h} touchPx={touchPx} />;
    case 'download':
      return <DownloadSpot h={h} touchPx={touchPx} />;
    case 'video':
      return <VideoSpot h={h} />;
    case 'form':
      return <FormSpot h={h} compact={compact} />;
    default:
      return null;
  }
}

/** One face worth of hotspots in face pixels (1600x1100), faded in after the first positioned frame. */
function FaceDom({ spots, touchPx, compact }: { spots: readonly Hotspot[]; touchPx: number; compact: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // The Html layer is placed by the first rendered frame; showing it before would flash it unscaled.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  return (
    <div
      ref={root}
      style={{
        position: 'relative',
        width: FACE_SIZE.w,
        height: FACE_SIZE.h,
        opacity: shown ? 1 : 0,
        transition: motion.reduced ? 'none' : `opacity ${FADE_MS}ms`,
        pointerEvents: 'none',
      }}
      // Focusing a control inside a transformed layer can make the browser scroll its clipped ancestors.
      onFocusCapture={() => {
        requestAnimationFrame(() => {
          for (let el = root.current?.parentElement; el; el = el.parentElement) {
            el.scrollTop = 0;
            el.scrollLeft = 0;
          }
        });
      }}
    >
      {spots.map((h) => (
        <Spot key={h.id} h={h} touchPx={touchPx} compact={compact} />
      ))}
    </div>
  );
}

function FaceLayer({
  face,
  x,
  y,
  worldWidth,
  touchPx,
  compact,
}: {
  face: number;
  /** Centre of the face on the desk (book space). */
  x: number;
  y: number;
  worldWidth: number;
  touchPx: number;
  compact: boolean;
}) {
  const spots = hotspotsForFace(face);
  if (!spots.length) return null;
  return (
    <Html
      transform
      position={[x, y, 0]}
      rotation={[-Math.PI / 2, 0, 0]} // lies flat on the paper, top of the face towards the back of the desk
      distanceFactor={distanceFactorFor(worldWidth)}
      pointerEvents="none"
    >
      <FaceDom spots={spots} touchPx={touchPx} compact={compact} />
    </Html>
  );
}

// Height of the top surface of the visible faces (matches pivotY / stack maths in Book.tsx).
const leftY = (spread: number) =>
  STACK_BASE_Y + (spread - 1) * PITCH + (spread === 1 ? COVER_THICK : PAGE_THICK) / 2 + SURFACE_LIFT;
const rightY = (spread: number) => STACK_BASE_Y + (LAST_LEAF - spread) * PITCH + PAGE_THICK / 2 + SURFACE_LIFT;
const backCoverY = STACK_BASE_Y + LAST_LEAF * PITCH + COVER_THICK / 2 + SURFACE_LIFT;

/**
 * Real DOM (links, buttons, the demo video, the contact form) laid over the visible faces while the book
 * is still. The page textures keep the look; this layer only adds what must be clickable or editable.
 * It is flat (no curl, light or post-processing), so it is unmounted whenever a leaf is moving.
 */
export function SpreadHotspots() {
  const page = useBook((s) => s.page);
  const moving = useBook((s) => s.moving);
  const compact = useBook((s) => s.compact);
  const viewportWidth = useThree((s) => s.size.width);

  if (moving || page < 1) return null;

  // Face pixels per comfortable touch target: one face spans about COMPACT_FILL of the viewport width.
  const touchPx = compact ? TOUCH_TARGET_PX / ((viewportWidth * COMPACT_FILL) / FACE_SIZE.w) : 0;

  if (page >= 10) {
    return (
      <FaceLayer
        key="back"
        face={BACK_COVER_ID}
        x={-COVER_W / 2}
        y={backCoverY}
        worldWidth={COVER_W}
        touchPx={touchPx}
        compact={compact}
      />
    );
  }

  return (
    <>
      <FaceLayer
        key={`${page}-L`}
        face={2 * page - 1}
        x={-PAGE_W / 2}
        y={leftY(page)}
        worldWidth={PAGE_W}
        touchPx={touchPx}
        compact={compact}
      />
      <FaceLayer
        key={`${page}-R`}
        face={2 * page}
        x={PAGE_W / 2}
        y={rightY(page)}
        worldWidth={PAGE_W}
        touchPx={touchPx}
        compact={compact}
      />
    </>
  );
}
