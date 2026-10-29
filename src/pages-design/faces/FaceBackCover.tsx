import { portfolio, ui } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { LogoMark } from '../parts';

const { contact, person } = portfolio;

// Where the real contact form (a drei <Html>, Fase 5) is mounted; matches data-hotspot="contact-form".
export const FORM_RECT = { left: 880, top: 440, width: 610, height: 520 } as const;

const LINKS: { id: string; label: string; href: string }[] = [
  { id: 'linkedin', label: 'LinkedIn ↗', href: contact.linkedin },
  { id: 'github', label: 'GitHub ↗', href: contact.github },
];

/** Back cover (exterior) — Contactos. Black matte cloth, giant "HABLEMOS.", links and the form area. */
export function FaceBackCover() {
  return (
    <PageFrame theme="cover">
      <div className="absolute rounded-[10px]" style={{ inset: 60, border: '2px solid rgba(255,255,255,0.05)' }} />

      <div className="absolute" style={{ left: 120, top: 100 }}>
        <LogoMark size={64} ring="#5ce1e6" ink="#f4f6fb" />
      </div>

      <h1
        className="absolute font-display text-[205px] font-bold uppercase leading-[0.85] tracking-[-0.005em] text-ink"
        style={{ left: 112, top: 200 }}
      >
        {ui.letsTalk}
      </h1>

      <div className="absolute" style={{ left: 120, top: 470, width: 700 }}>
        <p className="font-mono text-[20px] uppercase tracking-[0.18em] text-muted">Correo</p>
        <p
          data-hotspot="email"
          data-action="link"
          data-href={`mailto:${contact.email}`}
          className="mt-3 font-display text-[44px] font-semibold leading-tight tracking-[-0.015em] text-accent"
        >
          {contact.email}
        </p>

        <ul className="mt-14 space-y-6">
          {LINKS.map((link) => (
            <li
              key={link.id}
              data-hotspot={link.id}
              data-action="link"
              data-href={link.href}
              className="flex items-center justify-between pb-5 font-display text-[40px] font-semibold tracking-[-0.02em] text-ink"
              style={{ borderBottom: '1.5px solid rgba(255,255,255,0.18)' }}
            >
              <span>{link.label.replace(' ↗', '')}</span>
              <span className="text-accent">↗</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        data-hotspot="contact-form"
        data-action="form"
        className="absolute"
        style={{
          ...FORM_RECT,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.18)',
        }}
      />

      <p
        className="absolute font-mono text-[20px] uppercase tracking-[0.16em]"
        style={{ left: 120, right: 120, bottom: 86, color: 'rgba(143,240,243,0.7)' }}
      >
        Hecho con React Three Fiber + Tailwind · © 2026 {person.name}
      </p>
    </PageFrame>
  );
}
