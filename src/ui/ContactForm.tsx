import { useId, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

type Variant = 'page' | 'book' | 'terminal';

// "page" is the plain DOM form; "book" is sized for the 1600x1100 face space of the back cover, where
// 24 px of text ends up around 12 px on screen (same scale as the printed text); "terminal" is the
// git-flavoured card of the redesigned text version.
const STYLES: Record<
  Variant,
  { form: string; label: string; field: string; textarea: string; button: string; status: string }
> = {
  page: {
    form: 'space-y-4',
    label: 'mb-1 block font-mono text-xs text-muted',
    field:
      'w-full rounded-sm border border-glass-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none',
    textarea: 'resize-y',
    button:
      'rounded-btn bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-[#e8eaf0]',
    status: 'min-h-5 text-sm text-accent',
  },
  book: {
    form: 'flex h-full flex-col gap-[12px] p-[26px]',
    label: 'mb-[4px] block font-mono text-[20px] uppercase leading-none tracking-[0.14em] text-muted',
    field:
      'w-full rounded-[14px] border border-white/25 bg-white/10 px-[16px] text-[24px] text-ink placeholder:text-muted focus:border-accent focus:outline-none',
    textarea: 'min-h-0 flex-1 resize-none py-[10px] leading-snug',
    button:
      'h-[54px] self-start rounded-pill bg-white px-[34px] font-display text-[24px] font-semibold text-black transition-colors hover:bg-[#e8eaf0]',
    status: 'min-h-[28px] text-[22px] leading-tight text-accent',
  },
  terminal: {
    form: 'min-w-0 overflow-hidden rounded-md border border-glass-border bg-surface',
    label: 'flex flex-col gap-[6px] text-muted',
    field:
      'w-full rounded-sm border border-glass-border bg-surface-raised p-3 font-mono text-[13px] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none',
    textarea: 'resize-y',
    button:
      'inline-flex min-h-[44px] cursor-pointer items-center self-start rounded-md border-0 bg-accent px-[18px] font-mono text-sm font-medium text-void transition-all duration-150 hover:bg-accent-hover hover:shadow-glow-accent',
    status: 'min-h-5 text-xs text-accent',
  },
};

const PLACEHOLDERS: Record<Variant, { name: string; email: string; message: string }> = {
  page: { name: 'Tu nombre', email: 'tucorreo@ejemplo.com', message: 'Cuéntame en qué puedo ayudarte' },
  book: { name: 'Tu nombre', email: 'tucorreo@ejemplo.com', message: 'Cuéntame en qué puedo ayudarte' },
  terminal: { name: 'Tu nombre', email: 'tu@correo.com', message: '"Hola Juan José, tengo un proyecto…"' },
};

// Terminal labels are git commands; the other variants use plain words.
const LABELS: Record<Variant, { name: string; email: string; message: string; submit: string }> = {
  page: { name: 'Nombre', email: 'Correo', message: 'Mensaje', submit: 'Enviar mensaje' },
  book: { name: 'Nombre', email: 'Correo', message: 'Mensaje', submit: 'Enviar mensaje' },
  terminal: {
    name: '$ git config user.name',
    email: '$ git config user.email',
    message: '$ git commit -m',
    submit: '$ git push origin juanjose',
  },
};

/**
 * Self-contained contact form: embedded in the back cover (`book`, inside a drei <Html>), in the mobile
 * sheet and the text version (`page` / `terminal`). Submission is simulated: nothing is sent anywhere.
 */
export function ContactForm({ className = '', variant = 'page' }: { className?: string; variant?: Variant }) {
  const uid = useId();
  const [sentName, setSentName] = useState<string | null>(null);
  const s = STYLES[variant];
  const book = variant === 'book';
  const terminal = variant === 'terminal';
  const labels = LABELS[variant];
  const placeholders = PLACEHOLDERS[variant];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get('name') ?? '').trim();
    form.reset();
    setSentName(name);
  };

  /** Plain variants pair a sibling label and control; the terminal wraps the control in its label. */
  const field = (id: string, text: string, control: ReactNode, wrapperClass = '') =>
    terminal ? (
      <label htmlFor={id} className={s.label}>
        {text}
        {control}
      </label>
    ) : (
      <div className={wrapperClass}>
        <label htmlFor={id} className={s.label}>
          {text}
        </label>
        {control}
      </div>
    );

  const fields = (
    <>
      {field(
        `${uid}-name`,
        labels.name,
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={placeholders.name}
          className={`${s.field} ${book ? 'h-[52px]' : ''}`}
        />,
      )}
      {field(
        `${uid}-email`,
        labels.email,
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={placeholders.email}
          className={`${s.field} ${book ? 'h-[52px]' : ''}`}
        />,
      )}
      {field(
        `${uid}-message`,
        labels.message,
        <textarea
          id={`${uid}-message`}
          name="message"
          required
          rows={book ? 3 : terminal ? 4 : 5}
          placeholder={placeholders.message}
          className={`${s.field} ${s.textarea}`}
        />,
        book ? 'flex min-h-0 flex-1 flex-col' : '',
      )}
      <button type="submit" className={s.button}>
        {labels.submit}
      </button>
      <p role="status" aria-live="polite" className={s.status}>
        {sentName !== null && `¡Gracias${sentName ? `, ${sentName}` : ''}! Tu mensaje fue enviado.`}
      </p>
    </>
  );

  return (
    <form
      onSubmit={onSubmit}
      onChange={() => sentName !== null && setSentName(null)}
      className={`${s.form} ${className}`}
      aria-label="Formulario de contacto"
    >
      {terminal ? (
        <>
          <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,.08)] px-4 py-3">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                aria-hidden="true"
                className="h-[10px] w-[10px] rounded-full border border-white/20 bg-surface-raised"
              />
            ))}
            <span className="ml-2 font-mono text-xs text-muted">~/contacto — zsh</span>
          </div>
          <div className="flex flex-col gap-4 p-5 font-mono text-[13px]">{fields}</div>
        </>
      ) : (
        fields
      )}
    </form>
  );
}
