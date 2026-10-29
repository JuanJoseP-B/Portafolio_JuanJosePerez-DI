import { useLayoutEffect, useRef, type MouseEvent, type ReactNode } from 'react';
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

  // Every time the text version is shown (also the no-WebGL fallback on mount) it starts at the very top,
  // before paint: no leftover scroll position and no section picked by an anchor in the URL.
  useLayoutEffect(() => {
    if (visible && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [visible]);

  const scrollContainerTo = (top: number) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollRef.current?.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
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
      className={visible ? 'fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden bg-void text-ink' : 'sr-only'}
    >
      {notice}
      <TextNav onClose={visible ? onClose : undefined} />

      <main>
        <TextHero />
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
