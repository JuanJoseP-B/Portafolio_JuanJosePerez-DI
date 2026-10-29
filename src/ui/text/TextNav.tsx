import { useEffect, useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { portfolio, ui } from '../../content/portfolio';
import { BTN_OUTLINE, BTN_PRIMARY } from './shared';

const { person } = portfolio;

const LINKS: [num: string, label: string, hash: string][] = [
  ['01', 'Sobre mí', '#sobre-mi'],
  ['02', 'Proyectos', '#proyectos'],
  ['03', 'Testimonios', '#testimonios'],
  ['04', 'Experiencia', '#experiencia'],
  ['05', 'Stack', '#stack'],
  ['06', 'Contacto', '#contacto'],
];

// "JJ" + the surname in serif ("Pérez"), both derived from the content.
const nameParts = person.name.split(' ');
const MONOGRAM = nameParts
  .slice(0, 2)
  .map((part) => part[0])
  .join('');
const SURNAME = nameParts[2] ?? '';

const LINK = 'font-mono text-xs text-muted no-underline transition-colors hover:text-accent-hover';

/**
 * Sticky pill navbar of the text version. From `md` up it is the handoff layout (logo, numbered links,
 * buttons); below that the links and buttons collapse behind a hamburger (course rubric).
 */
export function TextNav({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  const links = LINKS.map(([num, label, hash]) => (
    <a key={hash} href={hash} onClick={close} className={`${LINK} flex min-h-[44px] items-center md:min-h-0`}>
      {num} {label}
    </a>
  ));

  const buttons = (
    <>
      {onClose && (
        <button type="button" onClick={onClose} className={`${BTN_OUTLINE} cursor-pointer bg-transparent`}>
          Volver al libro
        </button>
      )}
      <a href="#contacto" onClick={close} className={BTN_PRIMARY}>
        {ui.contact}
      </a>
    </>
  );

  return (
    <div className="sticky top-0 z-40 px-[clamp(16px,4vw,40px)] py-4">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 rounded-xl border border-glass-border bg-[rgba(13,16,24,.72)] py-[10px] pl-5 pr-3 shadow-glass backdrop-blur-xl"
      >
        <a href="#inicio" onClick={close} className="font-display text-[17px] font-bold text-ink no-underline">
          {MONOGRAM}
          <span className="ml-1 font-serif text-[20px] font-normal italic text-accent-warm">{SURNAME}</span>
        </a>

        <div className="hidden flex-wrap gap-x-[18px] gap-y-1 md:flex">{links}</div>
        <div className="hidden gap-2 md:flex">{buttons}</div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-md border border-glass-border bg-transparent text-ink md:hidden"
        >
          {open ? <X size={20} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={20} strokeWidth={1.5} aria-hidden="true" />}
        </button>

        <div
          id={panelId}
          className={`basis-full flex-col gap-1 border-t border-[rgba(255,255,255,.08)] pb-2 pt-2 md:hidden ${
            open ? 'flex' : 'hidden'
          }`}
        >
          {links}
          <div className="mt-2 flex flex-wrap gap-2">{buttons}</div>
        </div>
      </nav>
    </div>
  );
}
