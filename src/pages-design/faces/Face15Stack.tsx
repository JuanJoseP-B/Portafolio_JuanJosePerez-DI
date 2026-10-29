import { portfolio } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Chip, Folio, Label, PageHeader } from '../parts';

const { extra, projects } = portfolio;

// Everything used in the projects that is not already listed in the author's stack groups.
const LISTED = new Set(Object.values(extra.stack).flat().map((tech) => tech.toLowerCase()));
const FROM_PROJECTS = [...new Set(projects.flatMap((p) => p.stack))].filter((tech) => !LISTED.has(tech.toLowerCase()));

function Group({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <div className="mb-4">
        <Label tone="dark">{title}</Label>
      </div>
      <ul className="flex flex-wrap gap-3">
        {items.map((item) => (
          <Chip key={item} tone="dark">
            {item}
          </Chip>
        ))}
      </ul>
    </section>
  );
}

/** Face 15 — Stack (left page of spread 8, dark). */
export function Face15Stack() {
  const groups = Object.entries(extra.stack);
  return (
    <PageFrame theme="dark" side="L">
      <PageHeader tone="dark" tag="Stack" left={110} right={190} />

      <h1
        className="absolute font-display text-[230px] font-bold uppercase leading-[0.85] tracking-[-0.055em] text-ink"
        style={{ left: 100, top: 130 }}
      >
        Stack
      </h1>
      <p className="absolute font-serif text-[78px] italic leading-none text-accent" style={{ left: 108, top: 335 }}>
        y arquitectura
      </p>

      <div className="absolute grid grid-cols-2 gap-x-14 gap-y-9" style={{ left: 110, right: 190, top: 500 }}>
        {groups.map(([title, items]) => (
          <Group key={title} title={title} items={items} />
        ))}
      </div>
      <div className="absolute" style={{ left: 110, right: 190, top: 770 }}>
        <Group title="En mis proyectos" items={FROM_PROJECTS} />
      </div>

      <Folio face={15} side="L" tone="dark" />
    </PageFrame>
  );
}
