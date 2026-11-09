import { getPortfolio, getTr, getUi } from '../../content/portfolio';
import type { Project } from '../../content/portfolio';
import { useLanguage } from '../../store/useLanguage';
import { Placeholder as T } from '../Placeholder';
import { ProjectMedia } from './ProjectMedia';
import { CONTAINER, Ext, Serif, SectionHead } from './shared';

const CODE_COLOR: Record<Project['id'], string> = {
  argos: 'text-accent',
  segundoaire: 'text-success',
  arcofisio: 'text-accent-warm',
};

function ProjectCard({ project, enabled }: { project: Project; enabled: boolean }) {
  const { lang } = useLanguage();
  const uiCopy = getUi(lang);

  return (
    <article
      id={`proyectos/${project.id}`}
      className="flex flex-col overflow-hidden rounded-md border border-[rgba(255,255,255,.1)] bg-surface"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[rgba(255,255,255,.08)] px-4 py-3">
        <span data-anim="count" className={`font-mono text-xs ${CODE_COLOR[project.id]}`}>
          {project.code}
        </span>
        <span className="rounded-pill border border-glass-border px-2 py-[2px] font-mono text-[11px] text-muted">
          <T>{project.status}</T>
        </span>
      </div>

      <ProjectMedia project={project} enabled={enabled} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="m-0 flex flex-col gap-[2px]">
          <span className="font-display text-[30px] font-bold tracking-[-.01em]">{project.name}</span>
          <Serif className="text-[22px] text-muted">{project.subtitle}</Serif>
        </h3>
        <p className="m-0 text-sm leading-[1.55] text-muted">{project.description}</p>
        <ul aria-label={lang === 'en' ? `${project.name} technologies` : `Tecnologías de ${project.name}`} className="m-0 flex list-none flex-wrap gap-[6px] p-0 font-mono text-[11px]">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-sm border border-glass-border px-[7px] py-[3px]">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Ext href={project.repo} label={uiCopy.github} ariaLabel={`GitHub - ${project.name}`} />
          <Ext href={project.demo} label={uiCopy.liveDemo} ariaLabel={`Demo - ${project.name}`} />
        </div>
      </div>
    </article>
  );
}

/** "Expedientes de caso": the three projects as case-file cards with a playable demo clip each. */
export function TextProjects({ active }: { active: boolean }) {
  const { lang } = useLanguage();
  const projects = getPortfolio(lang).projects;
  const tr = getTr(lang);

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-title"
      className={`${CONTAINER} flex flex-col gap-12 pb-[120px]`}
    >
      <SectionHead id="proyectos-title" counter={`${tr.textProjects.counter} · ${projects.length} ${lang === 'en' ? 'open cases' : 'casos abiertos'}`}>
        {tr.textProjects.title} <Serif>{lang === 'en' ? 'cases' : 'de caso'}</Serif>
      </SectionHead>
      <div data-anim="pin-horizontal" className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} enabled={active} />
        ))}
      </div>
    </section>
  );
}
