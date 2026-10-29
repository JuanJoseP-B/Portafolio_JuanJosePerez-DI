import { portfolio } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Folio, Label, PageHeader } from '../parts';

const { person, extra } = portfolio;

const FACTS: [label: string, value: string][] = [
  ['Ubicación', person.location],
  ['Semestre', person.level],
  ['Intereses', person.interests.join(' · ')],
];

// Skills = every group of the stack section, flattened.
const SKILLS = Object.values(extra.stack).flat();

/** Face 3 — Acerca de mí (left page of spread 2, light). */
export function Face03About() {
  return (
    <PageFrame theme="light" side="L">
      <PageHeader tone="light" tag="Sobre mí" left={110} right={190} />

      <h1
        className="absolute font-serif text-[180px] italic leading-[0.88] text-paper-ink"
        style={{ left: 104, top: 150 }}
      >
        Detrás
        <br />
        del código
      </h1>

      <img
        src={person.photo}
        alt={person.photoAlt}
        className="absolute rounded-full"
        style={{
          right: 200,
          top: 175,
          width: 200,
          height: 200,
          objectFit: 'cover',
          objectPosition: '50% 4%',
          background: 'linear-gradient(135deg, #d9f4f5, #f7f5ef)',
          border: '2px solid #1b1813',
          mixBlendMode: 'multiply',
        }}
      />

      <div className="absolute" style={{ left: 110, top: 520, width: 600 }}>
        {person.bio.map((paragraph) => (
          <p key={paragraph} className="text-[28px] leading-[1.5] text-paper-ink">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="absolute" style={{ left: 790, top: 520, width: 600 }}>
        <dl>
          {FACTS.map(([label, value]) => (
            <div
              key={label}
              className="py-[16px]"
              style={{ borderTop: '1.5px solid rgba(27,24,19,0.2)' }}
            >
              <dt className="mb-2">
                <Label tone="light">{label}</Label>
              </dt>
              <dd className="font-display text-[32px] font-semibold leading-tight tracking-[-0.01em] text-paper-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-6 flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <li
              key={skill}
              className="rounded-pill px-5 py-2 font-mono text-[22px] text-paper-ink"
              style={{ border: '1.5px solid #1b1813' }}
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* The three principles as outlined type along the bottom edge. */}
      <p
        className="absolute font-display text-[32px] font-bold uppercase leading-none tracking-[-0.02em]"
        style={{
          left: 110,
          width: 640,
          whiteSpace: 'nowrap',
          bottom: 100,
          color: 'transparent',
          WebkitTextStroke: '1.5px #1b1813',
        }}
      >
        {person.principles.join('  ·  ')}
      </p>

      <Folio face={3} side="L" tone="light" />
    </PageFrame>
  );
}
