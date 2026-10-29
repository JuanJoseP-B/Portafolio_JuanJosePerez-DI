import { PageFrame } from '../PageFrame';
import { Folio, PageHeader, getProject } from '../parts';

const project = getProject('segundoaire');

/**
 * Face 9 — SegundoAire (left page of spread 5, light).
 * Phone frame around the capture; the demo video plays over it on hover (Fase 5).
 */
export function Face09SegundoAireShot() {
  return (
    <PageFrame theme="light" side="L">
      <PageHeader tone="light" tag="Proyecto 02" left={110} right={190} />

      <h1 className="absolute font-serif text-[132px] italic leading-none text-paper-ink" style={{ left: 104, top: 150 }}>
        {project.subtitle}
      </h1>
      <p className="absolute font-mono text-[22px] uppercase tracking-[0.16em] text-paper-muted" style={{ left: 112, top: 312 }}>
        {project.name} · Android nativo
      </p>

      {/* Soft halo in the project accent behind the phone. */}
      <div
        className="absolute rounded-full"
        style={{ left: 640, top: 340, width: 640, height: 640, background: project.accent, opacity: 0.22 }}
      />

      <div
        className="absolute"
        style={{
          left: 790,
          top: 355,
          width: 340,
          height: 630,
          borderRadius: 60,
          border: '8px solid #1b1813',
          background: '#f7f5ef',
          boxShadow: '0 30px 60px rgba(27,24,19,0.25)',
        }}
      >
        {/* The video plays over this capture (Fase 5); the rectangle is read by the export script. */}
        <div
          data-hotspot="video-segundoaire"
          data-action="video"
          className="absolute overflow-hidden"
          style={{ inset: 0, borderRadius: 52 }}
        >
          <img
            src={project.cover}
            alt={`Captura de ${project.name}: elige las apps que quieres vigilar`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span
            className="absolute rounded-pill px-6 py-3 font-mono text-[22px] leading-none text-ink"
            style={{ left: '50%', bottom: 26, transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'rgba(5,6,10,0.82)', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >
            ▶ Demo en video
          </span>
        </div>
        <span
          className="absolute rounded-full"
          style={{ left: '50%', top: 14, width: 90, height: 14, marginLeft: -45, background: '#1b1813' }}
        />
      </div>

      <Folio face={9} side="L" tone="light" />
    </PageFrame>
  );
}
