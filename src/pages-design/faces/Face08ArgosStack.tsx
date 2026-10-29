import { ui } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Folio, PageHeader, Pill, getProject } from '../parts';

const project = getProject('argos');

/** Face 8 — ARGOS, how it is built (right page of spread 4, light). */
export function Face08ArgosStack() {
  return (
    <PageFrame theme="light" side="R">
      <PageHeader tone="light" tag="Arquitectura" left={150} right={100} />

      <h1 className="absolute font-serif text-[132px] italic leading-none text-paper-ink" style={{ left: 144, top: 140 }}>
        Cómo está hecho
      </h1>
      <p className="absolute font-mono text-[22px] uppercase tracking-[0.16em] text-paper-muted" style={{ left: 152, top: 300 }}>
        {project.name} · {project.subtitle}
      </p>

      <ol className="absolute" style={{ left: 150, right: 100, top: 385 }}>
        {project.highlights.map((item, i) => (
          <li
            key={item}
            className="flex items-baseline gap-7 py-[26px]"
            style={{ borderTop: '1.5px solid rgba(27,24,19,0.22)' }}
          >
            <span className="w-[56px] font-mono text-[24px] text-paper-muted">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.02em] text-paper-ink">
              {item}
            </span>
          </li>
        ))}
      </ol>

      <div className="absolute flex gap-5" style={{ left: 150, top: 880 }}>
        <Pill id="argos-github-2" href={project.repo} tone="light">
          {ui.github}
        </Pill>
        <Pill id="argos-demo-2" href={project.demo} tone="light" solid={false}>
          {ui.liveDemo}
        </Pill>
      </div>

      <Folio face={8} side="R" tone="light" />
    </PageFrame>
  );
}
