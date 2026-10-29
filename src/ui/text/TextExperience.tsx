import { portfolio } from '../../content/portfolio';
import type { LogEntry } from '../../content/portfolio';
import { Placeholder as T } from '../Placeholder';
import { CONTAINER, Serif, SectionHead } from './shared';

const { log } = portfolio;

const KIND_LABEL: Record<LogEntry['kind'], string> = {
  academic: 'Experiencia académica',
  work: 'Experiencia laboral / práctica competitiva',
};

/** "git log --mi-camino": academic and work history as a vertical commit graph. */
export function TextExperience() {
  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-title"
      className={`${CONTAINER} flex flex-col gap-12 py-[120px]`}
    >
      <SectionHead id="experiencia-title" counter="04 / 06">
        git log <Serif>--mi-camino</Serif>
      </SectionHead>
      <p className="sr-only">Experiencia académica y laboral, de lo más reciente a lo más antiguo.</p>

      <ol data-anim="graph-draw" className="m-0 flex list-none flex-col p-0">
        {log.map((entry) => (
          <li key={entry.hash} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
            <div aria-hidden="true" className="flex flex-col items-center">
              <span
                className={`mt-[6px] h-4 w-4 flex-none rounded-full border-2 bg-void ${
                  entry.tone === 'accent' ? 'border-accent' : 'border-accent-warm'
                }`}
              />
              <span className="w-[2px] flex-1 bg-[rgba(92,225,230,.3)]" />
            </div>
            <div className="flex flex-col gap-[6px] pb-9">
              <div className="flex flex-wrap gap-3 font-mono text-xs">
                <span data-anim="type" className="text-accent-warm">
                  {entry.hash}
                </span>
                <span className="text-muted">
                  <T>{entry.date}</T>
                </span>
                <span className="text-accent">{entry.branch}</span>
              </div>
              <span className="font-display text-[22px] font-semibold">
                <span className="sr-only">{KIND_LABEL[entry.kind]}: </span>
                {entry.message}
              </span>
              <span className="text-sm leading-[1.55] text-muted">
                <T>{entry.detail}</T>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
