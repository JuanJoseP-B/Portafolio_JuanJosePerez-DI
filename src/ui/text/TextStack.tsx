import { portfolio } from '../../content/portfolio';
import type { Key } from '../../content/portfolio';
import { CONTAINER, Serif, SectionHead } from './shared';

const { keyboard, extra } = portfolio;

const KEY_BASE =
  'flex flex-col items-start gap-3 rounded-md border border-glass-border bg-surface-raised px-4 py-[14px] transition-[transform,box-shadow] duration-150';
const KEY_UP = 'translate-y-0 shadow-[0_6px_0_var(--keycap-shadow)] hover:translate-y-1 hover:shadow-[0_2px_0_var(--keycap-shadow)]';
const KEY_DOWN = 'translate-y-1 shadow-[0_2px_0_var(--keycap-shadow)]';

function Keycap({ item }: { item: Key }) {
  return (
    <div data-anim="keypress" className={`${KEY_BASE} ${item.pressed ? KEY_DOWN : KEY_UP}`}>
      {/* Decorative: the name below is the accessible label. */}
      <img src={item.icon} alt="" aria-hidden="true" width={32} height={32} loading="lazy" className="h-8 w-8 object-contain" />
      <span className={`break-words font-mono text-sm font-medium ${item.pressed ? 'text-accent' : 'text-ink'}`}>{item.name}</span>
    </div>
  );
}

const PANEL = 'flex flex-col gap-4 rounded-md border border-[rgba(255,255,255,.1)] bg-surface p-6';
const PANEL_LABEL = 'font-mono text-[11px] tracking-[.08em] text-muted';

/** "Mi teclado": the stack as rows of keycaps, plus the engineering approach and the hobbies. */
export function TextStack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className={`${CONTAINER} flex flex-col gap-12 pb-[120px]`}
    >
      <SectionHead id="stack-title" counter="05 / 06">
        Mi <Serif>teclado</Serif>
      </SectionHead>
      <p className="sr-only">{extra.title}</p>

      <div className="flex flex-col gap-5">
        {keyboard.map((row) => (
          <div
            key={row.layer}
            role="group"
            aria-label={row.layer}
            className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-center gap-3"
          >
            <span className="font-mono text-xs tracking-[.08em] text-muted">{row.layer}</span>
            {row.keys.map((item) => (
              <Keycap key={item.name} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* Not in the handoff: the engineering approach and hobbies already present in the book and the old text. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <div className={PANEL}>
          <h3 className={`${PANEL_LABEL} m-0 font-normal`}>ENFOQUE DE INGENIERÍA</h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[17px] leading-[1.5]">
            {extra.approach.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span aria-hidden="true" className="font-mono text-accent">
                  ▸
                </span>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className={PANEL}>
          <h3 className={`${PANEL_LABEL} m-0 font-normal`}>FUERA DEL CÓDIGO</h3>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 p-0">
            {extra.hobbies.map((hobby) => (
              <li key={hobby.title} className="rounded-md border border-glass-border bg-surface-raised p-4">
                <strong className="block font-display text-base font-semibold">{hobby.title}</strong>
                <span className="mt-1 block text-sm leading-[1.5] text-muted">{hobby.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
