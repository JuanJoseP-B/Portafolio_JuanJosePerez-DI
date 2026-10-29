import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { portfolio, ui } from '../content/portfolio';
import { NAV_LINKS, currentHash, type NavLink } from '../lib/spreads';
import { useBook } from '../store/useBook';

const { person } = portfolio;

/** Flips the book to the section and keeps the section's own hash (two links share the spread of "Sobre mí"). */
function goTo(link: NavLink): void {
  useBook.getState().setTarget(link.page);
  if (currentHash() !== link.hash) window.history.replaceState(null, '', `#${link.hash}`);
}

const LINK =
  'pointer-events-auto rounded-pill px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-ink focus-visible:text-ink aria-[current=page]:bg-glass aria-[current=page]:text-ink';

/** Top bar: logo, section links (hamburger below lg) and the contact button. */
export function Navbar() {
  const page = useBook((s) => s.page);
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState(currentHash);

  useEffect(() => {
    const onHash = () => setHash(currentHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Two links can open the same spread: the one whose hash is in the address bar is the current one.
  const isCurrent = (link: NavLink): boolean => {
    if (link.page !== page) return false;
    const siblings = NAV_LINKS.filter((l) => l.page === link.page);
    if (siblings.length === 1) return true;
    return siblings.some((l) => l.hash === hash) ? link.hash === hash : link === siblings[0];
  };

  const onLink = (link: NavLink) => (event: MouseEvent) => {
    event.preventDefault();
    setOpen(false);
    setHash(link.hash);
    goTo(link);
  };

  const inline = NAV_LINKS.filter((l) => l.hash !== 'contacto');

  return (
    <header className="relative flex items-start justify-between px-4 pt-4 sm:px-10 sm:pt-10">
      <a
        href="#inicio"
        onClick={onLink(NAV_LINKS[0])}
        aria-label={`${person.shortName} — inicio`}
        className="pointer-events-auto flex items-center gap-3 font-display text-xl font-semibold text-ink"
      >
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-bold text-void"
        >
          JJ
        </span>
        {person.shortName}
      </a>

      <div className="flex items-center gap-1">
        <nav aria-label="Secciones" className="hidden items-center gap-1 lg:flex">
          {inline.map((link) => (
            <a
              key={link.hash}
              href={`#${link.hash}`}
              onClick={onLink(link)}
              aria-current={isCurrent(link) ? 'page' : undefined}
              className={LINK}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          onClick={onLink(NAV_LINKS[NAV_LINKS.length - 1])}
          className="pointer-events-auto ml-2 rounded-btn bg-white px-5 py-3 text-sm font-medium text-black max-[479px]:hidden transition-all duration-150 hover:-translate-y-px hover:bg-[#e8eaf0] hover:shadow-glow-accent"
        >
          {ui.contact}
        </a>

        <button
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu-secciones"
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto ml-1 grid h-11 w-11 place-items-center rounded-pill border border-glass-border bg-glass text-ink backdrop-blur-md transition-colors hover:border-white/30 lg:hidden"
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="pointer-events-auto fixed inset-0 -z-10 cursor-default"
          />
          <nav
            id="menu-secciones"
            aria-label="Secciones"
            className="pointer-events-auto absolute right-4 top-[4.75rem] w-56 rounded-md border border-glass-border bg-surface/95 p-2 backdrop-blur-xl sm:right-10 sm:top-[6.5rem]"
          >
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.hash}>
                  <a
                    href={`#${link.hash}`}
                    onClick={onLink(link)}
                    aria-current={isCurrent(link) ? 'page' : undefined}
                    className="block rounded-sm px-3 py-2.5 text-sm text-muted transition-colors hover:bg-glass hover:text-ink aria-[current=page]:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
