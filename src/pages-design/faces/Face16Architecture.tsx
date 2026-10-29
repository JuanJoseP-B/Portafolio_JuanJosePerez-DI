import { portfolio } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Chip, Folio, Label, PageHeader } from '../parts';

const { extra, person } = portfolio;

/** Face 16 — Engineering approach + hobbies (right page of spread 8, light). */
export function Face16Architecture() {
  return (
    <PageFrame theme="light" side="R">
      <PageHeader tone="light" tag="Arquitectura" left={150} right={100} />

      <h1 className="absolute font-serif text-[112px] italic leading-none text-paper-ink" style={{ left: 144, top: 140 }}>
        Enfoque de ingeniería
      </h1>

      {/* Titles only; the long description of each item stays in the content file. */}
      <ol className="absolute grid grid-cols-4 gap-8" style={{ left: 150, right: 100, top: 310 }}>
        {extra.approach.map((item, i) => (
          <li key={item.title} style={{ borderTop: '2px solid #1b1813', paddingTop: 18 }}>
            <span className="block font-mono text-[22px] text-paper-muted">{String(i + 1).padStart(2, '0')}</span>
            <span className="mt-3 block font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-paper-ink">
              {item.title}
            </span>
          </li>
        ))}
      </ol>

      <div className="absolute" style={{ left: 150, right: 100, top: 520 }}>
        <div className="mb-4">
          <Label tone="light">Intereses</Label>
        </div>
        <ul className="flex flex-wrap gap-3">
          {person.interests.map((interest) => (
            <Chip key={interest} tone="light">
              {interest}
            </Chip>
          ))}
        </ul>
      </div>

      <div className="absolute" style={{ left: 150, right: 100, top: 660 }}>
        <p className="mb-6 font-serif text-[64px] italic leading-none text-paper-ink">Fuera del código</p>
        <ul className="grid grid-cols-4 gap-7">
          {extra.hobbies.map((hobby) => (
            <li key={hobby.title} style={{ borderTop: '3px solid #1b1813', paddingTop: 16 }}>
              <span className="block font-display text-[32px] font-bold leading-none tracking-[-0.02em] text-paper-ink">
                {hobby.title}
              </span>
              <span className="mt-3 block text-[26px] leading-[1.3] text-paper-muted">{hobby.line}</span>
            </li>
          ))}
        </ul>
      </div>

      <Folio face={16} side="R" tone="light" />
    </PageFrame>
  );
}
