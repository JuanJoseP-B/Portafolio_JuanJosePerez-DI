import { ui } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Chip, Folio, PageHeader, Pill, getProject } from '../parts';

const project = getProject('argos');

/** Face 6 — ARGOS (right page of spread 3, dark, cyan accent). */
export function Face06Argos() {
  return (
    <PageFrame theme="dark" side="R">
      <div
        className="absolute rounded-full"
        style={{
          right: -260,
          top: -260,
          width: 980,
          height: 980,
          background: `radial-gradient(circle, ${project.accent}2e 0%, transparent 62%)`,
        }}
      />
      <PageHeader tone="dark" tag="Proyecto 01" left={150} right={100} />

      <h1
        className="absolute font-display text-[270px] font-bold uppercase leading-[0.85] tracking-[-0.055em] text-ink"
        style={{ left: 140, top: 150 }}
      >
        {project.name}
      </h1>
      <p
        className="absolute font-serif text-[92px] italic leading-none"
        style={{ left: 150, top: 402, color: project.accent }}
      >
        {project.subtitle}
      </p>

      <span
        className="absolute rounded-pill px-6 py-3 font-mono text-[22px] uppercase leading-none tracking-[0.12em]"
        style={{ left: 150, top: 530, color: project.accent, border: `1.5px solid ${project.accent}` }}
      >
        {project.highlights[0].replace(/\.$/, '')}
      </span>

      <p className="absolute text-[34px] leading-[1.4] text-ink" style={{ left: 150, top: 625, width: 1040 }}>
        {project.description}
      </p>

      <ul className="absolute flex flex-wrap gap-3" style={{ left: 150, top: 810, width: 1250 }}>
        {project.stack.map((tech) => (
          <Chip key={tech} tone="dark">
            {tech}
          </Chip>
        ))}
      </ul>

      <div className="absolute flex gap-5" style={{ left: 150, top: 910 }}>
        <Pill id="argos-github" href={project.repo} tone="dark">
          {ui.github}
        </Pill>
        <Pill id="argos-demo" href={project.demo} tone="dark" solid={false}>
          {ui.liveDemo}
        </Pill>
      </div>

      <Folio face={6} side="R" tone="dark" />
    </PageFrame>
  );
}
