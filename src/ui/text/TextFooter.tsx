import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { getPortfolio, getTr, getUi } from '../../content/portfolio';
import { useLanguage } from '../../store/useLanguage';
import { CONTAINER } from './shared';

const ICON =
  'grid h-11 w-11 place-items-center rounded-pill text-muted transition-colors duration-150 hover:text-ink focus-visible:text-ink';

/**
 * Footer of the text version: the handoff's mono line (© and "EOF") plus social icons, the build credit
 * and "Volver arriba", which used to live in a strip over the 3D book.
 */
export function TextFooter({ onBackToTop }: { onBackToTop: () => void }) {
  const { lang } = useLanguage();
  const portfolioData = getPortfolio(lang);
  const { person, contact } = portfolioData;
  const tr = getTr(lang);
  const uiCopy = getUi(lang);
  const year = new Date().getFullYear();

  return (
    <footer id="fin" className={`${CONTAINER} pb-10 pt-6 font-mono text-xs text-muted`}>
      <div className="flex flex-wrap justify-between gap-3">
        <span>
          © {year} {person.name}
        </span>
        <span>{tr.textFooter.handmade}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[rgba(255,255,255,.08)] pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={ICON}
            >
              <Linkedin size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={ICON}
            >
              <Github size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.email}`} className={ICON}>
              <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
          <span>{uiCopy.credit}</span>
        </div>

        <button
          type="button"
          onClick={onBackToTop}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border border-glass-border bg-transparent px-[18px] font-mono text-xs text-ink transition-all duration-150 hover:border-white/30 hover:shadow-glow-accent"
        >
          <ArrowUp size={14} strokeWidth={1.75} aria-hidden="true" />
          {uiCopy.backToTop}
        </button>
      </div>
    </footer>
  );
}
