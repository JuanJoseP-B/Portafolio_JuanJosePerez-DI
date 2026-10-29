import type { CSSProperties, ReactNode } from 'react';
import { portfolio, type Project, type ProjectId } from '../content/portfolio';

const { person } = portfolio;

export type Tone = 'light' | 'dark';

/** Provisional monogram (ring + initials) until the author has a logo. */
export function LogoMark({
  size = 56,
  ring = '#5ce1e6',
  ink = '#f4f6fb',
}: {
  size?: number;
  ring?: string;
  ink?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke={ring} strokeWidth="4" />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontWeight="700"
        fontSize="44"
        letterSpacing="-2"
        fill={ink}
      >
        JJ
      </text>
    </svg>
  );
}

/** Small printed header: monogram + name on the left, section tag on the right. */
export function PageHeader({
  tone,
  tag,
  left,
  right,
}: {
  tone: Tone;
  tag: string;
  /** Distance from the left edge; keep larger on right-hand pages (spine on the left). */
  left: number;
  right: number;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className="absolute flex items-center justify-between"
      style={{ top: 58, left, right }}
    >
      <div className="flex items-center gap-4">
        <LogoMark
          size={46}
          ring={dark ? '#5ce1e6' : '#1b1813'}
          ink={dark ? '#f4f6fb' : '#1b1813'}
        />
        <span
          className="font-display text-[28px] font-semibold tracking-[-0.02em]"
          style={{ color: dark ? '#f4f6fb' : '#1b1813' }}
        >
          {person.shortName}
        </span>
      </div>
      <span
        className="font-mono text-[20px] uppercase tracking-[0.16em]"
        style={{ color: dark ? '#9aa3b5' : '#5e564a' }}
      >
        {tag}
      </span>
    </div>
  );
}

/** Face number in the outer bottom corner, like a printed folio. */
export function Folio({ face, side, tone }: { face: number; side: 'L' | 'R'; tone: Tone }) {
  return (
    <span
      className="absolute font-mono text-[20px] tracking-[0.12em]"
      style={{
        bottom: 46,
        [side === 'L' ? 'left' : 'right']: 110,
        color: tone === 'dark' ? 'rgba(154,163,181,.7)' : 'rgba(94,86,74,.8)',
      }}
    >
      {String(face).padStart(2, '0')}
    </span>
  );
}

/** Label above a value: mono, small, uppercase. */
export function Label({ children, tone }: { children: string; tone: Tone }) {
  return (
    <span
      className="block font-mono text-[20px] uppercase tracking-[0.16em]"
      style={{ color: tone === 'dark' ? '#9aa3b5' : '#5e564a' }}
    >
      {children}
    </span>
  );
}

// --- Shared pieces for the project / contact faces (Fase 4B) -----------------------------

export const getProject = (id: ProjectId): Project => {
  const project = portfolio.projects.find((p) => p.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project;
};

/** Two-letter initials for the avatar circles (no photos are used for testimonials). */
export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

/** Printed button; `data-*` attributes are read by the export script (hotspots.generated.json). */
export function Pill({
  id,
  href,
  tone,
  solid = true,
  children,
}: {
  id: string;
  href: string;
  tone: Tone;
  solid?: boolean;
  children: string;
}) {
  const dark = tone === 'dark';
  const base = dark ? '#f4f6fb' : '#1b1813';
  return (
    <span
      data-hotspot={id}
      data-action="link"
      data-href={href}
      className="inline-flex items-center rounded-pill px-9 py-4 font-display text-[26px] font-semibold leading-none tracking-[-0.01em]"
      style={{
        background: solid ? base : 'transparent',
        color: solid ? (dark ? '#05060a' : '#f7f5ef') : base,
        border: `2px solid ${base}`,
      }}
    >
      {children}
    </span>
  );
}

/** Technology chip (mono, outlined). */
export function Chip({ tone, children }: { tone: Tone; children: string }) {
  const dark = tone === 'dark';
  return (
    <li
      className="rounded-pill px-5 py-2 font-mono text-[22px] leading-none"
      style={{
        color: dark ? '#f4f6fb' : '#1b1813',
        border: `1.5px solid ${dark ? 'rgba(244,246,251,0.45)' : '#1b1813'}`,
      }}
    >
      {children}
    </li>
  );
}

/** Printed browser window: three dots and an address bar around a product capture. */
export function BrowserFrame({
  url,
  hotspot,
  action,
  style,
  children,
}: {
  url: string;
  hotspot?: string;
  action?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        borderRadius: 20,
        background: '#0d1018',
        border: '2px solid rgba(255,255,255,0.16)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        ...style,
      }}
    >
      <div className="flex items-center gap-3 px-6" style={{ height: 56, background: '#161a26' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="rounded-full" style={{ width: 14, height: 14, background: 'rgba(255,255,255,0.28)' }} />
        ))}
        <span className="ml-5 flex-1 truncate rounded-pill px-6 font-mono text-[20px] leading-[34px] text-muted" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {url}
        </span>
      </div>
      {/* The hotspot covers only the screen (not the title bar): that is where a video plays. */}
      <div data-hotspot={hotspot} data-action={action}>
        {children}
      </div>
    </div>
  );
}
