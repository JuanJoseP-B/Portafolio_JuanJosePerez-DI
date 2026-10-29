import { portfolio } from '../../content/portfolio';
import { ContactForm } from '../ContactForm';
import { H2, Serif } from './shared';

const { contact } = portfolio;

/** "Hagamos un commit juntos.": email, signature and the terminal-style contact form. */
export function TextContact() {
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="blueprint border-t border-[rgba(255,255,255,.08)]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-12 px-[clamp(16px,4vw,40px)] py-[120px]">
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
          <span className="font-mono text-xs text-accent">06 / 06 · CONTACTO</span>
          <h2 id="contacto-title" className={H2}>
            Hagamos <Serif>un commit</Serif> juntos.
          </h2>
          <a
            href={`mailto:${contact.email}`}
            data-anim="magnetic"
            className="break-all font-serif text-[clamp(26px,3.4vw,44px)] italic text-ink underline decoration-[rgba(255,181,71,.6)] underline-offset-8"
          >
            {contact.email}
          </a>
          <svg
            data-anim="sign"
            width="220"
            height="70"
            viewBox="0 0 220 70"
            fill="none"
            stroke="var(--accent-warm)"
            strokeWidth="2"
            strokeLinecap="round"
            role="img"
            aria-label="Firma de Juan José"
            className="mt-4 max-w-full"
          >
            <path d="M10 48c14-30 22-36 20-14s-8 30 2 18 18-34 26-26-6 24 6 16 14-18 22-12 2 14 12 8 20-22 30-14-4 16 8 12 30-16 40-8M40 60h150" />
          </svg>
        </div>

        <ContactForm variant="terminal" className="flex-[1_1_420px]" />
      </div>
    </section>
  );
}
