import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { portfolio } from '../../content/portfolio';
import { CONTAINER, Serif, SectionHead } from './shared';

const { person, extra } = portfolio;

const ORDINALS = ['', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo'];
const NUMBER_WORDS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

const CARD =
  'flex flex-col gap-[14px] rounded-md border border-[rgba(255,255,255,.1)] bg-surface p-6';
const CARD_LABEL = 'font-mono text-[11px] tracking-[.08em] text-muted';
const CARD_TITLE = 'font-display text-2xl font-semibold';

function formatTime(zone: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date());
}

/** Wall clock of the author's city; it only ticks while the text version is on screen. */
function Clock({ active }: { active: boolean }) {
  const [time, setTime] = useState(() => formatTime(person.timeZone));

  useEffect(() => {
    if (!active) return;
    setTime(formatTime(person.timeZone));
    const id = window.setInterval(() => setTime(formatTime(person.timeZone)), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <span role="timer" aria-live="off" className="font-mono text-[28px] text-ink">
      {time} <span className="text-xs text-muted">COT</span>
    </span>
  );
}

/** Wraps every occurrence of the configured phrases in a highlighter marker. */
function withMarkers(text: string, phrases: string[]): ReactNode {
  const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`));
  return parts.map((part, i) =>
    phrases.includes(part) ? (
      <span key={i} data-anim="marker" className="marker">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** "Hola, soy …": location with a live clock, semester "build" bar and the interests card. */
export function TextHello({ active }: { active: boolean }) {
  const { current, total } = person.semester;
  const percent = Math.round((current / total) * 100);
  const [firstInterest = '', ...otherInterests] = person.interests.map((item) => item.toLowerCase());

  return (
    <section
      id="sobre-mi"
      aria-labelledby="hola-title"
      className={`${CONTAINER} flex flex-col gap-12 py-[120px]`}
    >
      {/* Anchor of the book's welcome spread (`#bienvenida`) */}
      <span id="bienvenida" aria-hidden="true" className="absolute" />
      <SectionHead id="hola-title" counter="01 / 06">
        Hola, soy <Serif>{person.shortName}</Serif>
      </SectionHead>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        <div className={CARD}>
          <span className={CARD_LABEL}>UBICACIÓN</span>
          <span className={CARD_TITLE}>{person.city}</span>
          <span className="font-mono text-[13px] text-accent">
            {person.coordinates.lat} · {person.coordinates.lon}
          </span>
          <Clock active={active} />
        </div>

        <div className={CARD}>
          <span className={CARD_LABEL}>SEMESTRE · BUILD</span>
          <span className={CARD_TITLE}>
            {ORDINALS[current]} <Serif>de {NUMBER_WORDS[total]}</Serif>
          </span>
          <div
            data-anim="build-fill"
            role="img"
            aria-label={`Semestre ${current} de ${total}`}
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={`h-[18px] rounded-[3px] ${i < current ? 'bg-accent' : 'bg-surface-raised'}`}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-muted">compilando… {percent}%</span>
        </div>

        <div className={CARD}>
          <span className={CARD_LABEL}>INTERESES</span>
          <span className={`${CARD_TITLE} leading-[1.2]`}>Me obsesiona la</span>
          <div className="flex h-11 flex-col overflow-hidden">
            <span
              data-anim="rotate-word"
              className="font-serif text-[38px] italic leading-[44px] text-accent-warm"
            >
              {firstInterest}
            </span>
          </div>
          <span className="font-mono text-xs text-muted">{otherInterests.map((item) => `→ ${item}`).join(' ')}</span>
        </div>
      </div>
    </section>
  );
}

/** "Detrás del código": paper block with the portrait, the bio and the skills terminal. */
export function TextBehind() {
  const [lead = '', ...restBio] = person.bio;
  const skills = Object.values(extra.stack).flat();

  return (
    <section
      id="detras-del-codigo"
      aria-labelledby="detras-title"
      className="px-[clamp(16px,4vw,40px)] pb-[120px]"
    >
      <div className="on-paper mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 rounded-xl bg-paper p-[clamp(24px,5vw,64px)] text-paper-ink">
        <div className="relative aspect-[4/5] max-w-[400px] flex-[1_1_300px] overflow-hidden rounded-2xl bg-[#f6f1e6]">
          <img
            src={person.photo}
            alt={person.photoAlt}
            width={900}
            height={1494}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-top"
          />
          <span className="absolute bottom-3 left-3 rounded-sm bg-paper-ink px-2 py-1 font-mono text-[11px] text-paper">
            FIG. 01 — el autor
          </span>
        </div>

        <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-6">
          <span className="font-mono text-xs tracking-[.08em] text-paper-muted">DETRÁS DEL CÓDIGO</span>
          <h2
            id="detras-title"
            className="m-0 font-display text-[clamp(36px,5vw,64px)] font-bold leading-[.98] tracking-[-.02em]"
          >
            Diseño sistemas <Serif className="text-paper-ink">que se explican solos.</Serif>
          </h2>
          <p className="m-0 text-[17px] leading-[1.65] text-paper-ink">{withMarkers(lead, person.bioMarkers)}</p>
          {restBio.map((paragraph) => (
            <p key={paragraph} className="m-0 text-[17px] leading-[1.65] text-paper-ink">
              {paragraph}
            </p>
          ))}

          <div className="flex flex-col gap-3 rounded-md bg-cover px-5 py-[18px] text-ink">
            <span className="font-mono text-[13px] text-muted">
              <span className="text-accent">jj@pasto</span>:~$ skills --list
            </span>
            <ul aria-label="Habilidades" className="m-0 flex list-none flex-wrap items-center gap-2 p-0 font-mono text-xs">
              {skills.map((skill) => (
                <li key={skill} data-anim="type" className="rounded-sm border border-glass-border px-2 py-1">
                  {skill}
                </li>
              ))}
              <li aria-hidden="true" className="text-accent">
                ▍
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
