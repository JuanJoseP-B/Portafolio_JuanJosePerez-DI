import { portfolio } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Folio, PageHeader, initials } from '../parts';

const { testimonials } = portfolio;
const LEAD = testimonials.filter((t) => t.name === 'Luis Díaz' || t.name === 'Juan Gallego');

/** Face 13 — Testimonios, two lead quotes (left page of spread 7, light). */
export function Face13TestimonialsLead() {
  return (
    <PageFrame theme="light" side="L">
      <PageHeader tone="light" tag="Testimonios" left={110} right={190} />

      <h1
        className="absolute font-display text-[124px] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-paper-ink"
        style={{ left: 104, top: 135 }}
      >
        Testimonios
      </h1>
      <p className="absolute font-mono text-[22px] uppercase tracking-[0.16em] text-paper-muted" style={{ left: 112, top: 268 }}>
        {String(testimonials.length).padStart(2, '0')} opiniones
      </p>

      <div className="absolute" style={{ left: 110, right: 190, top: 350 }}>
        {LEAD.map((t) => (
          <figure key={t.name} className="relative py-[48px]" style={{ borderTop: '1.5px solid rgba(27,24,19,0.25)' }}>
            <span
              className="absolute font-serif text-[200px] italic leading-none text-paper-ink"
              style={{ left: -6, top: 4, opacity: 0.14 }}
            >
              “
            </span>
            <blockquote className="relative font-serif text-[48px] italic leading-[1.18] text-paper-ink" style={{ paddingLeft: 60 }}>
              {t.quote}
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-5" style={{ paddingLeft: 60 }}>
              <span
                className="grid place-items-center rounded-full bg-paper-ink font-display text-[28px] font-semibold text-paper-white"
                style={{ width: 72, height: 72 }}
              >
                {initials(t.name)}
              </span>
              <span>
                <span className="block font-display text-[32px] font-semibold leading-none text-paper-ink">{t.name}</span>
                <span className="mt-2 block font-mono text-[22px] leading-none text-paper-muted">{t.relation}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Folio face={13} side="L" tone="light" />
    </PageFrame>
  );
}
