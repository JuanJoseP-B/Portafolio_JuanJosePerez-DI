import type { ReactNode } from 'react';
import { isPlaceholder } from '../../lib/placeholder';
import { Placeholder as T } from '../Placeholder';

/** Page container of the text version: 1200 px wide with a fluid gutter (design tokens `--container` / `--gutter`). */
export const CONTAINER = 'mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,40px)]';

/** Shared look of a button / link-button (44 px touch target). */
export const BTN =
  'inline-flex min-h-[44px] items-center gap-2 rounded-md px-[18px] text-sm font-medium no-underline transition-all duration-150';
export const BTN_OUTLINE = `${BTN} border border-glass-border text-ink hover:border-white/30 hover:shadow-glow-accent`;
export const BTN_PRIMARY = `${BTN} bg-accent text-void hover:bg-accent-hover hover:shadow-glow-accent`;

/** The single "handwritten" word of a heading: italic serif, amber unless a class says otherwise. */
export function Serif({ children, className = 'text-accent-warm' }: { children: ReactNode; className?: string }) {
  return <span className={`font-serif font-normal italic ${className}`}>{children}</span>;
}

const H2 = 'm-0 font-display font-bold leading-[.95] tracking-[-.02em] text-[clamp(40px,6vw,80px)]';

/** Section header: H2 on the left, mono cyan counter on the right. */
export function SectionHead({
  id,
  counter,
  children,
}: {
  id: string;
  counter: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 id={id} className={H2}>
        {children}
      </h2>
      <span className="font-mono text-xs text-accent">{counter}</span>
    </div>
  );
}

export { H2 };

/** External link (new tab). A placeholder URL is shown as a marked placeholder, never as an anchor. */
export function Ext({
  href,
  label,
  className = BTN_OUTLINE,
  ariaLabel,
}: {
  href: string;
  label: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  if (!href) return null;
  if (isPlaceholder(href)) {
    return (
      <span>
        {label} <T>{href}</T>
      </span>
    );
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
      {label}
    </a>
  );
}

/** Up to two initials of a name ("Luis Díaz" → "LD"). */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
