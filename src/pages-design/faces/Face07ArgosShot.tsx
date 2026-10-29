import { PageFrame } from '../PageFrame';
import { BrowserFrame, Folio, PageHeader, getProject } from '../parts';

const project = getProject('argos');
const HOST = project.demo.replace(/^https?:\/\//, '').replace(/\/$/, '');

// The capture is 1365x642; shown at the frame width it keeps its aspect ratio (no stretching).
const FRAME_W = 1290;
const SHOT_H = Math.round((FRAME_W * 642) / 1365);

/** Face 7 — ARGOS capture (left page of spread 4, dark). The video plays over the screenshot (Fase 5). */
export function Face07ArgosShot() {
  return (
    <PageFrame theme="dark" side="L">
      <PageHeader tone="dark" tag={`${project.name} · ${project.subtitle}`} left={110} right={190} />

      <p className="absolute font-mono text-[22px] uppercase tracking-[0.16em]" style={{ left: 112, top: 178, color: project.accent }}>
        01 · Pantalla de acceso
      </p>
      <h1 className="absolute font-serif text-[104px] italic leading-none text-ink" style={{ left: 106, top: 214 }}>
        Acceso de operadores
      </h1>

      <BrowserFrame
        url={HOST}
        hotspot="video-argos"
        action="video"
        style={{ left: 110, top: 345, width: FRAME_W }}
      >
        <div className="relative" style={{ height: SHOT_H }}>
          <img
            src={project.cover}
            alt={`Captura de ${project.name}: acceso de operadores`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span
            className="absolute rounded-pill px-6 py-3 font-mono text-[22px] leading-none text-ink"
            style={{ right: 28, bottom: 28, background: 'rgba(5,6,10,0.82)', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >
            ▶ Demo en video
          </span>
        </div>
      </BrowserFrame>

      <Folio face={7} side="L" tone="dark" />
    </PageFrame>
  );
}
