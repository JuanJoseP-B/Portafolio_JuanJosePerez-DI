import { portfolio, ui } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Folio, Label, LogoMark } from '../parts';

const { person } = portfolio;

const NAV = ['Inicio', 'Sobre mí', 'Proyectos', 'Testimonios', 'Experiencia', 'Contacto'];

const FACTS: [label: string, value: string][] = [
  ['Ubicación', person.location],
  ['Semestre', person.level],
  ['Intereses', person.interests.join(' · ')],
];

/** Face 2 — Bienvenida + CV (right page of spread 1, dark). */
export function Face02Welcome() {
  return (
    <PageFrame theme="dark" side="R">
      {/* Printed mini-nav, like a screenshot of a website. */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: 58, left: 150, right: 90 }}
      >
        <div className="flex items-center gap-4">
          <LogoMark size={46} />
          <span className="font-display text-[28px] font-semibold tracking-[-0.02em]">
            {person.shortName}
          </span>
        </div>
        <ul className="flex gap-7 font-mono text-[20px] uppercase tracking-[0.08em] text-muted">
          {NAV.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <span className="rounded-btn bg-white px-6 py-3 font-display text-[22px] font-medium text-black">
          {ui.contact}
        </span>
      </div>

      {/* Portrait card: arch window with a cyan side light. */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: 930,
          top: 190,
          width: 560,
          height: 800,
          borderRadius: '280px 280px 28px 28px',
          background: 'linear-gradient(115deg, #7fe3e8 0%, #d9f4f5 38%, #f7f5ef 100%)',
          boxShadow:
            '0 0 0 1.5px rgba(92,225,230,0.5), -50px 0 140px rgba(92,225,230,0.28), 0 40px 90px rgba(0,0,0,0.65)',
        }}
      >
        <img
          src={person.photo}
          alt={person.photoAlt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 4%',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* Mega headline, overlapping the portrait on purpose. */}
      <h1
        className="absolute font-display text-[176px] font-bold uppercase leading-[0.86] tracking-[-0.04em]"
        style={{ left: 142, top: 236 }}
      >
        Hola, soy
        <br />
        {person.shortName}
      </h1>

      <p className="absolute font-serif text-[88px] italic leading-none text-accent" style={{ left: 150, top: 590 }}>
        {person.role}
      </p>

      <dl className="absolute" style={{ left: 150, top: 735, width: 720 }}>
        {FACTS.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline gap-8 py-[14px]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
          >
            <dt className="w-[170px] shrink-0">
              <Label tone="dark">{label}</Label>
            </dt>
            <dd className="text-[26px] leading-tight text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div
        data-hotspot="cv"
        data-action="download"
        data-href={person.cv}
        className="absolute flex items-center rounded-pill bg-white px-12 font-display text-[28px] font-semibold text-black"
        style={{ left: 150, top: 968, height: 76 }}
      >
        {ui.downloadCv} ↓
      </div>

      <Folio face={2} side="R" tone="dark" />
    </PageFrame>
  );
}
