import { portfolio, type TimelineEntry } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Folio, PageHeader } from '../parts';

const { education, experience } = portfolio;

function Timeline({ title, items }: { title: string; items: TimelineEntry[] }) {
  return (
    <section>
      <h2 className="mb-8 font-mono text-[20px] uppercase tracking-[0.14em] text-accent">{title}</h2>
      <ol className="relative space-y-14 pl-9" style={{ borderLeft: '2px solid rgba(255,255,255,0.18)' }}>
        {items.map((item) => (
          <li key={`${item.years}-${item.title}`} className="relative">
            <span
              className="absolute rounded-full bg-accent"
              style={{ left: -45, top: 8, width: 14, height: 14, boxShadow: '0 0 14px rgba(92,225,230,0.6)' }}
            />
            <p className="font-mono text-[24px] text-accent">{item.years}</p>
            <p className="mt-1 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              {item.title}
            </p>
            <p className="mt-2 text-[26px] leading-snug text-muted">{item.institution}</p>
            {item.note && <p className="mt-3 text-[26px] leading-[1.4] text-muted">{item.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Face 4 — Experiencia académica y laboral (right page of spread 2, dark). */
export function Face04Experience() {
  return (
    <PageFrame theme="dark" side="R">
      <PageHeader tone="dark" tag="Experiencia" left={150} right={100} />

      <h1
        className="absolute font-display text-[130px] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink"
        style={{ left: 144, top: 130 }}
      >
        Experiencia
      </h1>
      <p
        className="absolute font-serif text-[60px] italic leading-none text-muted"
        style={{ left: 150, top: 262 }}
      >
        académica y laboral
      </p>

      <div className="absolute flex gap-16" style={{ left: 150, right: 100, top: 400 }}>
        <div style={{ width: 480 }}>
          <Timeline title="Experiencia Académica" items={education} />
        </div>
        <div className="flex-1">
          <Timeline title="Experiencia Laboral / Práctica Competitiva" items={experience} />
        </div>
      </div>

      <Folio face={4} side="R" tone="dark" />
    </PageFrame>
  );
}
