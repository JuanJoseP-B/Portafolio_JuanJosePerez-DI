import { portfolio } from '../../content/portfolio';
import { CONTAINER, H2, Serif, initials } from './shared';

const { testimonials } = portfolio;

/** Fixed tilt of each paper note, in degrees (design handoff). */
const TILTS = [-1.5, 1, -0.5, 1.5, -1, 0.75];

/** "Notas en el margen": the testimonials as slightly tilted paper notes on a full-width band. */
export function TextTestimonials() {
  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-title"
      className="overflow-x-clip border-y border-[rgba(255,255,255,.08)] bg-surface"
    >
      <div className={`${CONTAINER} flex flex-col gap-12 py-[120px]`}>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <span aria-hidden="true" className="font-serif text-[180px] italic leading-[.6] text-accent-warm">
            “
          </span>
          <h2 id="testimonios-title" className={H2}>
            Notas <Serif>en el margen</Serif>
          </h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7">
          {testimonials.map((item, i) => (
            <figure
              key={item.name}
              data-anim="stick"
              style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
              className="m-0 flex flex-col gap-5 rounded-[4px] bg-paper p-6 text-paper-ink shadow-note"
            >
              <blockquote className="m-0 font-serif text-[22px] italic leading-[1.3]">{item.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-[10px]">
                <span
                  aria-hidden="true"
                  className="grid h-[34px] w-[34px] place-items-center rounded-full bg-paper-ink font-mono text-[11px] text-paper"
                >
                  {initials(item.name)}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="text-xs text-paper-muted">{item.relation}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
