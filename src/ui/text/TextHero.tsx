import { FileText } from 'lucide-react';
import { portfolio, ui } from '../../content/portfolio';
import { Placeholder as T } from '../Placeholder';
import { CONTAINER, Serif } from './shared';

const { person } = portfolio;

// "Juan José" / "Pérez Bravo" and "Ingeniero de" + "Software", split from the content.
const nameWords = person.name.split(' ');
const FIRST_NAME = nameWords.slice(0, 2).join(' ');
const LAST_NAME = nameWords.slice(2).join(' ');
const roleWords = person.role.split(' ');
const ROLE_HIGHLIGHT = roleWords[roleWords.length - 1];
const ROLE_LEAD = roleWords.slice(0, -1).join(' ');

const CV_CARD =
  'on-paper flex min-h-[44px] items-center gap-4 rounded-md bg-paper px-5 py-[14px] text-paper-ink no-underline';

function CvCardBody() {
  return (
    <>
      <FileText size={20} strokeWidth={1.5} aria-hidden="true" />
      <span className="flex flex-col">
        <span className="font-display text-[15px] font-semibold">Ficha técnica — CV</span>
        <span className="font-mono text-[11px] text-paper-muted">
          <T>PDF · [FECHA DE REVISIÓN]</T>
        </span>
      </span>
    </>
  );
}

/** Hero of the text version: blueprint header, name, role and the CV "technical sheet" button. */
export function TextHero() {
  return (
    <section
      id="inicio"
      aria-labelledby="inicio-title"
      data-anim="grid-draw"
      className="blueprint border-b border-[rgba(255,255,255,.08)]"
    >
      <div className={`${CONTAINER} flex flex-col gap-8 pb-28 pt-24`}>
        <p className="m-0 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs tracking-[.08em] text-muted">
          <span className="text-accent">EXP. JJ-2026</span>
          <span>REV. {String(person.semester.current).padStart(2, '0')}</span>
          <span>
            {person.coordinates.lat} · {person.coordinates.lon}
          </span>
          <span>{person.city.toUpperCase()}</span>
        </p>

        <h1
          id="inicio-title"
          data-anim="decode"
          className="m-0 font-display text-[clamp(48px,8vw,112px)] font-bold leading-[.92] tracking-[-.03em]"
        >
          {FIRST_NAME}
          <br />
          {LAST_NAME}
        </h1>

        <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
          <p className="m-0 font-display text-[clamp(28px,4vw,52px)] font-medium leading-none tracking-[-.02em]">
            {ROLE_LEAD} <Serif className="text-[1.15em] text-accent-warm">{ROLE_HIGHLIGHT}</Serif>
          </p>
          <p
            data-anim="dimension"
            className="m-0 flex items-center gap-[10px] pb-2 font-mono text-xs text-muted"
          >
            <span aria-hidden="true" className="inline-block h-px w-16 bg-muted" />
            {person.semester.current}.º semestre · {person.institutionShort}
            <span aria-hidden="true" className="inline-block h-px w-16 bg-muted" />
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-stretch gap-4">
          {person.cvAvailable ? (
            <a href={person.cv} download className={CV_CARD} aria-label={`${ui.downloadCv} en PDF`}>
              <CvCardBody />
            </a>
          ) : (
            <div aria-disabled="true" title="El PDF del CV aún no está disponible" className={`${CV_CARD} opacity-80`}>
              <CvCardBody />
              <T>[CV PRÓXIMAMENTE]</T>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
