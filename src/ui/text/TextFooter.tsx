import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { portfolio, ui } from '../../content/portfolio';
import { CONTAINER } from './shared';

const { person, contact } = portfolio;

const ICON =
  'grid h-11 w-11 place-items-center rounded-pill text-muted transition-colors duration-150 hover:text-ink focus-visible:text-ink';

/**
 * Footer of the text version: the handoff's mono line (© and "EOF") plus social icons, the build credit
 * and "Volver arriba", which used to live in a strip over the 3D book.
 */
export function TextFooter({ onBackToTop }: { onBackToTop: () => void }) {
  const year = new Date().getFullYear();

  return (
    <footer id="fin" className={`${CONTAINER} pb-10 pt-6 font-mono text-xs text-muted`}>
      <div className="flex flex-wrap justify-between gap-3">
        <span>
          © {year} {person.name}
        </span>
        <span>EOF · hecho a mano en Pasto</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[rgba(255,255,255,.08)] pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (se abre en una pestaña nueva)"
              className={ICON}
            >
              <Linkedin size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (se abre en una pestaña nueva)"
              className={ICON}
            >
              <Github size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href={`mailto:${contact.email}`} aria-label={`Escribir un correo a ${contact.email}`} className={ICON}>
              <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
          <span>{ui.credit}</span>
        </div>

        <button
          type="button"
          onClick={onBackToTop}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border border-glass-border bg-transparent px-[18px] font-mono text-xs text-ink transition-all duration-150 hover:border-white/30 hover:shadow-glow-accent"
        >
          <ArrowUp size={14} strokeWidth={1.75} aria-hidden="true" />
          {ui.backToTop}
        </button>
      </div>
    </footer>
  );
}
