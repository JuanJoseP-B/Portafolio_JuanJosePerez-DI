import { portfolio, ui } from '../../content/portfolio';
import type { IndexEntry } from '../faceIds';
import { PageFrame } from '../PageFrame';
import { Folio, PageHeader } from '../parts';

const { person, projects, extra } = portfolio;

// Chapter list. `face` is where the chapter starts; the book page to open is its spread.
const ENTRIES: IndexEntry[] = [
  { label: 'Bienvenida', face: 2, page: 1 },
  { label: 'Sobre mí', face: 3, page: 2 },
  { label: 'Experiencia', face: 4, page: 2 },
  { label: 'Proyectos', face: 5, page: 3 },
  { label: projects[0].name, face: 6, page: 3 },
  { label: projects[1].name, face: 9, page: 5 },
  { label: projects[2].name, face: 11, page: 6 },
  { label: 'Testimonios', face: 13, page: 7 },
  { label: extra.title, face: 15, page: 8 },
  { label: 'Contacto', face: null, page: 10 },
];

const COLUMNS = [ENTRIES.slice(0, 5), ENTRIES.slice(5)];

function Row({ entry, number }: { entry: IndexEntry; number: number }) {
  return (
    <li
      data-hotspot={`goto-${entry.page}-${number}`}
      data-action="goto"
      data-page={entry.page}
      className="flex items-baseline gap-5 py-[22px]"
      style={{ borderBottom: '1.5px solid rgba(27,24,19,0.2)' }}
    >
      <span className="w-[56px] font-mono text-[24px] text-paper-muted">
        {String(number).padStart(2, '0')}
      </span>
      <span className="flex-1 font-display text-[38px] font-semibold leading-none tracking-[-0.02em] text-paper-ink">
        {entry.label}
      </span>
      <span className="font-mono text-[22px] text-paper-muted">
        {entry.face === null ? 'Final' : String(entry.face).padStart(2, '0')}
      </span>
    </li>
  );
}

/** Face 1 — Índice (left page of spread 1, light). */
export function Face01Index() {
  return (
    <PageFrame theme="light" side="L">
      <PageHeader tone="light" tag="Portafolio 2026" left={110} right={190} />

      <h1
        className="absolute font-serif text-[210px] italic leading-[0.9] text-paper-ink"
        style={{ left: 104, top: 170 }}
      >
        {ui.index}
      </h1>
      <p
        className="absolute font-mono text-[22px] uppercase tracking-[0.14em] text-paper-muted"
        style={{ left: 112, top: 410 }}
      >
        {person.name} — {person.role}
      </p>

      <div className="absolute flex gap-14" style={{ left: 110, right: 190, top: 500 }}>
        {COLUMNS.map((entries, col) => (
          <ol key={col} className="flex-1">
            {entries.map((entry, i) => (
              <Row key={entry.label} entry={entry} number={col * 5 + i + 1} />
            ))}
          </ol>
        ))}
      </div>

      <Folio face={1} side="L" tone="light" />
    </PageFrame>
  );
}
