import { ui } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Chip, Folio, PageHeader, Pill, getProject } from '../parts';

const project = getProject('segundoaire');

/** Face 10 — SegundoAire (right page of spread 5, dark, green accent). */
export function Face10SegundoAire() {
  return (
    <PageFrame theme="dark" side="R">
      <div
        className="absolute rounded-full"
        style={{
          right: -300,
          top: -300,
          width: 980,
          height: 980,
          background: `radial-gradient(circle, ${project.accent}2b 0%, transparent 62%)`,
        }}
      />
      <PageHeader tone="dark" tag="Proyecto 02" left={150} right={100} />

      <h1
        className="absolute font-display text-[158px] font-bold uppercase leading-[0.88] tracking-[-0.01em] text-ink"
        style={{ left: 142, top: 150 }}
      >
        {project.name}
      </h1>
      <p
        className="absolute font-serif text-[92px] italic leading-none"
        style={{ left: 150, top: 318, color: project.accent }}
      >
        {project.subtitle}
      </p>

      <p className="absolute text-[34px] leading-[1.4] text-ink" style={{ left: 150, top: 470, width: 1040 }}>
        {project.description}
      </p>

      <ul className="absolute space-y-3" style={{ left: 150, top: 660, width: 1150 }}>
        {project.highlights.slice(1).map((item) => (
          <li key={item} className="flex gap-5 text-[28px] leading-[1.35] text-muted">
            <span className="mt-[13px] shrink-0 rounded-full" style={{ width: 12, height: 12, background: project.accent }} />
            {item}
          </li>
        ))}
      </ul>

      <ul className="absolute flex flex-wrap gap-3" style={{ left: 150, top: 800, width: 1250 }}>
        {project.stack.map((tech) => (
          <Chip key={tech} tone="dark">
            {tech}
          </Chip>
        ))}
      </ul>

      <div className="absolute flex gap-5" style={{ left: 150, top: 910 }}>
        <Pill id="segundoaire-github" href={project.repo} tone="dark">
          {ui.github}
        </Pill>
        <Pill id="segundoaire-demo" href={project.demo} tone="dark" solid={false}>
          {ui.liveDemo}
        </Pill>
      </div>

      <Folio face={10} side="R" tone="dark" />
    </PageFrame>
  );
}
