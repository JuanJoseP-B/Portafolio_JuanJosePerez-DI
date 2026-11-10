import { FileText } from 'lucide-react';
import { getPortfolio, getTr, getUi } from '../../content/portfolio';
import { useLanguage } from '../../store/useLanguage';
import { Placeholder as T } from '../Placeholder';
import { CONTAINER, Serif } from './shared';

const CV_CARD =
  'on-paper flex min-h-[44px] items-center gap-4 rounded-md bg-paper px-5 py-[14px] text-paper-ink no-underline';

function CvCardBody({ title, note }: { title: string; note: string }) {
  return (
    <>
      <FileText size={20} strokeWidth={1.5} aria-hidden="true" />
      <span className="flex flex-col">
        <span className="font-display text-[15px] font-semibold">{title}</span>
        <span className="font-mono text-[11px] text-paper-muted">
          <T>{note}</T>
        </span>
      </span>
    </>
  );
}

/** Hero of the text version: blueprint header, name, role and the CV "technical sheet" button. */
export function TextHero() {
  const { lang } = useLanguage();
  const person = getPortfolio(lang).person;
  const tr = getTr(lang);
  const uiCopy = getUi(lang);

  const nameWords = person.name.split(' ');
  const FIRST_NAME = nameWords.slice(0, 2).join(' ');
  const LAST_NAME = nameWords.slice(2).join(' ');
  const roleWords = person.role.split(' ');
  const ROLE_HIGHLIGHT = roleWords[roleWords.length - 1];
  const ROLE_LEAD = roleWords.slice(0, -1).join(' ');

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-title"
      data-anim="grid-draw"
      className="blueprint border-b border-[color:var(--divider)]"
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
            {person.semester.current}.º {lang === 'en' ? 'semester' : 'semestre'} · {person.institutionShort}
            <span aria-hidden="true" className="inline-block h-px w-16 bg-muted" />
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-stretch gap-4">
          {person.cvAvailable ? (
            <a href={person.cv} download className={CV_CARD} aria-label={`${uiCopy.downloadCv} (PDF)`}>
              <CvCardBody title={tr.textHero.cvCardTitle} note={tr.textHero.cvDateLabel} />
            </a>
          ) : (
            <div aria-disabled="true" title="CV PDF" className={`${CV_CARD} opacity-80`}>
              <CvCardBody title={tr.textHero.cvCardTitle} note={tr.textHero.cvDateLabel} />
              <T>{lang === 'en' ? '[CV COMING SOON]' : '[CV PRÓXIMAMENTE]'}</T>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
