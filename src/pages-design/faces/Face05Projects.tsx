import { PageFrame } from '../PageFrame';
import { Folio, PageHeader, getProject } from '../parts';

// One row per project: platform comes from each project's description; `page` is the deep-dive spread.
const ROWS = [
  { project: getProject('argos'), platform: 'Escritorio y web', page: 4 },
  { project: getProject('segundoaire'), platform: 'Android nativo', page: 5 },
  { project: getProject('arcofisio'), platform: 'Smartwatch', page: 6 },
];

/** Face 5 — Mis proyectos, intro (left page of spread 3, light). */
export function Face05Projects() {
  return (
    <PageFrame theme="light" side="L">
      <PageHeader tone="light" tag="Proyectos" left={110} right={190} />

      <h1
        className="absolute font-display text-[150px] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-paper-ink"
        style={{ left: 104, top: 150 }}
      >
        Mis
        <br />
        proyectos
      </h1>
      <p
        className="absolute font-serif text-[230px] italic leading-none text-paper-ink"
        style={{ right: 200, top: 130, opacity: 0.9 }}
      >
        03
      </p>

      <ol className="absolute" style={{ left: 110, right: 190, top: 490 }}>
        {ROWS.map(({ project, platform, page }, i) => (
          <li
            key={project.id}
            data-hotspot={`goto-${page}`}
            data-action="goto"
            data-page={page}
            className="relative flex items-center gap-8 py-[28px]"
            style={{ borderTop: '1.5px solid rgba(27,24,19,0.25)' }}
          >
            <span
              className="absolute rounded-full"
              style={{ left: 0, top: -3, width: 90, height: 5, background: project.accent }}
            />
            <span className="w-[52px] font-mono text-[24px] text-paper-muted">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-display text-[68px] font-bold leading-none tracking-[-0.035em] text-paper-ink">
              {project.name}
            </span>
            <span className="flex-1 text-right">
              <span className="block font-serif text-[38px] italic leading-none text-paper-muted">{platform}</span>
              <span className="mt-3 block font-mono text-[22px] leading-none text-paper-muted">
                {project.stack.slice(0, 3).join(' · ')}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <Folio face={5} side="L" tone="light" />
    </PageFrame>
  );
}
