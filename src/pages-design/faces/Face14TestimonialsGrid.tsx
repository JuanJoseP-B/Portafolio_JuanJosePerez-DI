import { portfolio } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { Folio, PageHeader, initials } from '../parts';

const { testimonials } = portfolio;
const REST = testimonials.filter((t) => t.name !== 'Luis Díaz' && t.name !== 'Juan Gallego');

/** Face 14 — Testimonios, the other four as printed cards (right page of spread 7, dark). */
export function Face14TestimonialsGrid() {
  return (
    <PageFrame theme="dark" side="R">
      <PageHeader tone="dark" tag="Testimonios" left={150} right={100} />

      <h1 className="absolute font-serif text-[112px] italic leading-none text-ink" style={{ left: 144, top: 140 }}>
        Más voces
      </h1>

      <div className="absolute grid grid-cols-2 gap-7" style={{ left: 150, right: 100, top: 305 }}>
        {REST.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between rounded-[24px] p-9"
            style={{
              height: 328,
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.16)',
            }}
          >
            <blockquote className="text-[28px] leading-[1.38] text-ink">{t.quote}</blockquote>
            <figcaption className="flex items-center gap-4">
              <span
                className="grid place-items-center rounded-full font-display text-[24px] font-semibold text-void"
                style={{ width: 60, height: 60, background: '#5ce1e6' }}
              >
                {initials(t.name)}
              </span>
              <span>
                <span className="block font-display text-[28px] font-semibold leading-none text-ink">{t.name}</span>
                <span className="mt-2 block font-mono text-[20px] leading-none text-muted">{t.relation}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Folio face={14} side="R" tone="dark" />
    </PageFrame>
  );
}
