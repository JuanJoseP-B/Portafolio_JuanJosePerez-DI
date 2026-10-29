import { ui } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Chip, Folio, PageHeader, Pill, getProject } from '../parts';

const project = getProject('arcofisio');

/** Face 12 — ArcoFisio (right page of spread 6, light; amber is used only for shapes, not text). */
export function Face12ArcoFisio() {
  return (
    <PageFrame theme="light" side="R">
      <PageHeader tone="light" tag="Proyecto 03" left={150} right={100} />

      <h1
        className="absolute font-display text-[178px] font-bold uppercase leading-[0.88] tracking-[-0.01em] text-paper-ink"
        style={{ left: 142, top: 140 }}
      >
        {project.name}
      </h1>
      <span className="absolute rounded-full" style={{ left: 150, top: 318, width: 110, height: 8, background: project.accent }} />
      <p className="absolute font-serif text-[76px] italic leading-none text-paper-muted" style={{ left: 150, top: 350 }}>
        {project.subtitle}
      </p>

      <p className="absolute text-[32px] leading-[1.4] text-paper-ink" style={{ left: 150, top: 480, width: 1060 }}>
        {project.description}
      </p>

      <ul className="absolute space-y-3" style={{ left: 150, top: 615, width: 1150 }}>
        {project.highlights.slice(1).map((item) => (
          <li key={item} className="flex gap-5 text-[28px] leading-[1.35] text-paper-muted">
            <span className="mt-[13px] shrink-0 rounded-full" style={{ width: 12, height: 12, background: project.accent }} />
            {item}
          </li>
        ))}
      </ul>

      <ul className="absolute flex flex-wrap gap-3" style={{ left: 150, top: 815, width: 1250 }}>
        {project.stack.map((tech) => (
          <Chip key={tech} tone="light">
            {tech}
          </Chip>
        ))}
      </ul>

      <div className="absolute flex gap-5" style={{ left: 150, top: 920 }}>
        <Pill id="arcofisio-github" href={project.repo} tone="light">
          {ui.github}
        </Pill>
        <Pill id="arcofisio-demo" href={project.demo} tone="light" solid={false}>
          {ui.liveDemo}
        </Pill>
      </div>

      <Folio face={12} side="R" tone="light" />
    </PageFrame>
  );
}
