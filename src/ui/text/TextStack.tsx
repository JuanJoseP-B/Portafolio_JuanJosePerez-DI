import { getPortfolio, getTr } from '../../content/portfolio';
import type { Key } from '../../content/portfolio';
import { useLanguage } from '../../store/useLanguage';
import { CONTAINER, Serif, SectionHead } from './shared';

const KEY_BASE =
  'flex flex-col items-start gap-3 rounded-md border border-glass-border bg-surface-raised px-4 py-[14px] transition-[transform,box-shadow] duration-150';
const KEY_UP = 'translate-y-0 shadow-[0_6px_0_var(--keycap-shadow)] hover:translate-y-1 hover:shadow-[0_2px_0_var(--keycap-shadow)]';
const KEY_DOWN = 'translate-y-1 shadow-[0_2px_0_var(--keycap-shadow)]';

function Keycap({ item }: { item: Key }) {
  return (
    <div data-anim="keypress" className={`${KEY_BASE} ${item.pressed ? KEY_DOWN : KEY_UP}`}>
      <img src={item.icon} alt="" aria-hidden="true" width={32} height={32} loading="lazy" className="h-8 w-8 object-contain" />
      <span className={`break-words font-mono text-sm font-medium ${item.pressed ? 'text-accent' : 'text-ink'}`}>{item.name}</span>
    </div>
  );
}

const PANEL = 'flex flex-col gap-4 rounded-md border border-[color:var(--border-soft)] bg-surface p-6';
const PANEL_LABEL = 'font-mono text-[11px] tracking-[.08em] text-muted';

/** "Mi teclado": the stack as rows of keycaps, plus the engineering approach and the hobbies. */
export function TextStack() {
  const { lang } = useLanguage();
  const portfolioData = getPortfolio(lang);
  const { keyboard, extra } = portfolioData;
  const tr = getTr(lang);

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className={`${CONTAINER} flex flex-col gap-12 pb-[120px]`}
    >
      <SectionHead id="stack-title" counter={tr.textStack.counter}>
        {lang === 'en' ? 'My' : 'Mi'} <Serif>{lang === 'en' ? 'keyboard' : 'teclado'}</Serif>
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

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <div className={PANEL}>
          <h3 className={`${PANEL_LABEL} m-0 font-normal`}>{lang === 'en' ? 'ENGINEERING APPROACH' : 'ENFOQUE DE INGENIERÍA'}</h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[17px] leading-[1.5]">
            {extra.approach.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span aria-hidden="true" className="font-mono text-accent">
                  ·
                </span>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className={PANEL}>
          <h3 className={`${PANEL_LABEL} m-0 font-normal`}>{lang === 'en' ? 'OUTSIDE THE CODE' : 'FUERA DEL CÓDIGO'}</h3>
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
