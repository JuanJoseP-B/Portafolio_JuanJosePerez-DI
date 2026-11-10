import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { TextBehind, TextHello } from './text/TextAbout';
import { TextContact } from './text/TextContact';
import { TextExperience } from './text/TextExperience';
import { TextFooter } from './text/TextFooter';
import { TextHero } from './text/TextHero';
import { TextNav } from './text/TextNav';
import { TextProjects } from './text/TextProjects';
import { TextStack } from './text/TextStack';
import { TextTestimonials } from './text/TextTestimonials';

/** Space kept above a section's content when an anchor link scrolls to it (sticky navbar plus a small margin). */
const HEADER_OFFSET = 104;
const THEME_KEY = 'portfolio-text-theme';

function readLightTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light';
  } catch {
    return false;
  }
}

/**
 * Full semantic version of the content ("Bitácora de ingeniero" design). Screen-reader only by default;
 * `visible` shows it as a scrollable full-screen text version. Sections live in `./text/*`.
 */
export function A11yContent({
  visible = false,
  onClose,
  notice,
}: {
  visible?: boolean;
  onClose?: () => void;
  /** Shown above the navbar (e.g. why the text version replaces the 3D book). */
  notice?: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [lightTheme, setLightTheme] = useState(readLightTheme);

  const toggleTheme = () => {
    const nextTheme = !lightTheme;
    setLightTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_KEY, nextTheme ? 'light' : 'dark');
    } catch {
      // The switch still works when browser storage is unavailable.
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!visible || !container) return;

    const cancel = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
    // Manual input interrupts anchor animation and keeps the browser's native momentum.
    container.addEventListener('wheel', cancel, { passive: true });
    container.addEventListener('pointerdown', cancel);
    container.addEventListener('keydown', cancel);
    return () => {
      cancel();
      container.removeEventListener('wheel', cancel);
      container.removeEventListener('pointerdown', cancel);
      container.removeEventListener('keydown', cancel);
    };
  }, [visible]);

  // Every time the text version is shown (also the no-WebGL fallback on mount) it starts at the very top,
  // before paint: no leftover scroll position and no section picked by an anchor in the URL.
  useLayoutEffect(() => {
    if (visible && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [visible]);

  const scrollContainerTo = (top: number) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = scrollRef.current;
    if (!container) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    if (reduced) {
      container.scrollTo({ top, behavior: 'auto' });
      return;
    }
    const start = container.scrollTop;
    const distance = top - start;
    const duration = Math.min(1200, Math.max(550, Math.abs(distance) * 0.45));
    const started = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      container.scrollTop = start + distance * eased;
      frameRef.current = progress < 1 ? requestAnimationFrame(animate) : 0;
    };
    frameRef.current = requestAnimationFrame(animate);
  };

  /** "Volver arriba" scrolls the text version itself to its top (it is the scroll container when visible). */
  const backToTop = () => scrollContainerTo(0);

  /**
   * Smooth in-page navigation: any `#section` link inside the visible text version scrolls this container
   * (below the sticky navbar) instead of changing `location.hash`, so the book behind does not flip.
   * While the text version is only screen-reader content the links keep their default behaviour.
   */
  const onAnchorClick = (event: MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!visible || !container || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    const id = link ? decodeURIComponent(link.getAttribute('href')?.slice(1) ?? '') : '';
    if (!link || !id) return;
    // Scoped lookup by attribute: ids such as "proyectos/argos" are not valid in a "#id" selector.
    const target = container.querySelector<HTMLElement>(`[id="${id.replace(/"/g, '\\"')}"]`);
    if (!target) return;
    event.preventDefault();
    // Sections carry a large top padding: skip it so the heading (not the empty padding) lands under the navbar.
    const padding = parseFloat(getComputedStyle(target).paddingTop) || 0;
    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop +
      padding -
      HEADER_OFFSET;
    scrollContainerTo(Math.max(0, top));
    // Keyboard and screen-reader users land on the section without a second scroll jump.
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.style.outline = 'none'; // a section is a focus target, not a control: no ring around the whole block
    }
    target.focus({ preventScroll: true });
  };

  return (
    <div
      ref={scrollRef}
      onClick={onAnchorClick}
      data-theme={visible ? (lightTheme ? 'light' : 'dark') : undefined}
      className={visible ? 'text-view-visible fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden bg-void text-ink' : 'sr-only'}
    >
      {notice}
      <TextNav lightTheme={lightTheme} onToggleTheme={visible ? toggleTheme : undefined} onClose={visible ? onClose : undefined} />

      <main>
        <div data-text-skeleton-source><TextHero /></div>
        <TextHello active={visible} />
        <TextBehind />
        <TextProjects active={visible} />
        <TextTestimonials />
        <TextExperience />
        <TextStack />
        <TextContact />
      </main>

      <TextFooter onBackToTop={backToTop} />
    </div>
  );
}
