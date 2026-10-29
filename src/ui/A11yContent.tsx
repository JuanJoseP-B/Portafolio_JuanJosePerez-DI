import { useRef, type ReactNode } from 'react';
import { TextBehind, TextHello } from './text/TextAbout';
import { TextContact } from './text/TextContact';
import { TextExperience } from './text/TextExperience';
import { TextFooter } from './text/TextFooter';
import { TextHero } from './text/TextHero';
import { TextNav } from './text/TextNav';
import { TextProjects } from './text/TextProjects';
import { TextStack } from './text/TextStack';
import { TextTestimonials } from './text/TextTestimonials';

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

  /** "Volver arriba" scrolls the text version itself to its top (it is the scroll container when visible). */
  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollRef.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div
      ref={scrollRef}
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
