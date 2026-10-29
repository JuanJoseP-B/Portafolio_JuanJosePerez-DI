import { PageFrame } from '../PageFrame';
import { Folio, PageHeader, getProject } from '../parts';

const project = getProject('arcofisio');

const PANEL = { w: 1300, h: 790 };
const SQUARE = PANEL.h; // the watch window is a square as tall as the panel, flush right

// The capture is 707x544 with the round watch (diameter ~410 px) centred at (348, 280) on a beige
// backdrop. The video is a square crop where the watch fills ~95 % of the side, so the capture is
// cropped to the square that makes both watches the same size: side = 410 / 0.95 = 432 px.
const CAPTURE = { w: 707, h: 544, cx: 348, cy: 280, side: 432 };
const K = SQUARE / CAPTURE.side;
const BACKDROP = '#e9dcc4'; // same beige as the capture and the video

/** Face 11 — ArcoFisio capture (left page of spread 6, dark, amber accent). The video plays over the watch (Fase 5). */
export function Face11ArcoShot() {
  return (
    <PageFrame theme="dark" side="L">
      <PageHeader tone="dark" tag="Proyecto 03" left={110} right={190} />

      <div
        className="absolute overflow-hidden"
        style={{
          left: 110,
          top: 190,
          width: PANEL.w,
          height: PANEL.h,
          borderRadius: 30,
          background: BACKDROP,
          border: `2px solid ${project.accent}66`,
          boxShadow: `0 0 90px ${project.accent}2e, 0 30px 80px rgba(0,0,0,0.6)`,
        }}
      >
        <div className="absolute" style={{ left: 64, top: 70, width: PANEL.w - SQUARE - 110 }}>
          <p className="font-mono text-[22px] uppercase tracking-[0.16em]" style={{ color: '#7a4f0c' }}>
            {project.name} · Smartwatch
          </p>
          <p className="mt-6 font-serif text-[64px] italic leading-[1.04] text-paper-ink">{project.highlights[1]}</p>
        </div>
        <span
          className="absolute rounded-pill px-6 py-3 font-mono text-[22px] leading-none text-ink"
          style={{ left: 64, bottom: 64, background: 'rgba(5,6,10,0.82)', border: '1.5px solid rgba(255,255,255,0.25)' }}
        >
          ▶ Demo en video
        </span>

        {/* The video plays over this square; the rectangle is read by the export script. */}
        <div
          data-hotspot="video-arcofisio"
          data-action="video"
          className="absolute overflow-hidden"
          style={{
            left: PANEL.w - SQUARE,
            top: 0,
            width: SQUARE,
            height: SQUARE,
            // Fades the left edge so the cropped soft shadow of the watch does not show a seam.
            WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 70px)',
            maskImage: 'linear-gradient(to right, transparent 0, #000 70px)',
          }}
        >
          <img
            src={project.cover}
            alt={`Captura de ${project.name}: pantalla del reloj`}
            style={{
              position: 'absolute',
              width: CAPTURE.w * K,
              height: CAPTURE.h * K,
              left: -(CAPTURE.cx - CAPTURE.side / 2) * K,
              top: -(CAPTURE.cy - CAPTURE.side / 2) * K,
              maxWidth: 'none',
              display: 'block',
            }}
          />
        </div>
      </div>

      <Folio face={11} side="L" tone="dark" />
    </PageFrame>
  );
}
