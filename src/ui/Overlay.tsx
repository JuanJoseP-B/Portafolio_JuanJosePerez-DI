import { getPortfolio, getUi } from '../content/portfolio';
import { useEntered } from '../lib/loadProgress';
import { useBook } from '../store/useBook';
import { useLanguage } from '../store/useLanguage';
import { Placeholder as T } from './Placeholder';
import { FaceNav } from './FaceNav';
import { LanguageButton } from './LanguageButton';
import { TextVersionButton } from './TextVersionButton';
import { Navbar } from './Navbar';
import { ZoomControls } from './ZoomControls';


/** 2D layer over the canvas: navbar, hero title (closed book), zoom controls, one-page face buttons and the text-version button. */
export function Overlay({ onToggleText }: { onToggleText: () => void }) {
  const closed = useBook((s) => s.page === 0);
  const compact = useBook((s) => s.compact);
  // The title appears after the book has dollied in (the loader's fade-out starts that).
  const entered = useEntered();
  const showHero = closed && entered;
  const { lang } = useLanguage();
  const { person } = getPortfolio(lang);
  const t = getUi(lang);

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <Navbar />

      <div
        className={`absolute left-4 top-28 max-w-[min(90vw,42rem)] transition-opacity duration-700 sm:left-10 sm:top-36 ${
          showHero ? 'opacity-100 delay-[900ms]' : 'opacity-0'
        }`}
        aria-hidden={!closed}
      >
        {/* Not an <h1>: the text version already carries the page's only h1 (same words). */}
        <p className="font-display text-4xl font-semibold leading-[1.07] tracking-[-0.03em] text-ink sm:text-[56px]">
          <T>{person.heroTitle[0]}</T>
          <br />
          <T>{person.heroTitle[1]}</T>
        </p>
        <p className="mt-4 text-[13px] text-muted">{t.hint}</p>
        {person.cvAvailable ? (
          <a
            href={person.cv}
            download
            tabIndex={closed ? 0 : -1}
            className={`mt-5 inline-block rounded-pill border border-glass-border bg-glass px-4 py-2 text-xs text-ink backdrop-blur-md transition-all duration-150 hover:border-white/30 hover:backdrop-blur-xl ${
              closed ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            {t.downloadCv} (PDF)
          </a>
        ) : (
          <span
            aria-disabled="true"
            title={lang === 'en' ? 'The CV PDF is not available yet' : 'El PDF del CV aún no está disponible'}
            className="mt-5 inline-block rounded-pill border border-dashed border-accent-warm px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-accent-warm"
          >
            {t.downloadCv} · {lang === 'en' ? '[CV COMING SOON]' : '[CV PRÓXIMAMENTE]'}
          </span>
        )}
      </div>

      <ZoomControls />

      <FaceNav />

      {/* Language + Text-version buttons, grouped at the same corner */}
      <div
        className={`pointer-events-none absolute flex items-center gap-2 ${
          compact
            ? 'bottom-[4.5rem] left-4'
            : 'bottom-4 right-4 sm:bottom-6 sm:right-10'
        }`}
      >
        <LanguageButton />
        <TextVersionButton onToggleText={onToggleText} />
      </div>
    </div>
  );
}
