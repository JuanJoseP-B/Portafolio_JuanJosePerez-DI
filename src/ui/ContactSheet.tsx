import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useBook } from '../store/useBook';
import { ContactForm } from './ContactForm';

/**
 * One-page (phone) mode: the printed form area on the back cover is too small to type in, so the
 * "Escribir un mensaje" button over it opens this sheet with the same form.
 */
export function ContactSheet() {
  const open = useBook((s) => s.contactOpen);
  const setOpen = useBook((s) => s.setContactOpen);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) dialog.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[55] flex items-end justify-center bg-void/75 backdrop-blur-sm sm:items-center"
      onClick={() => setOpen(false)}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-sheet-title"
        tabIndex={-1}
        className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-xl border border-glass-border bg-surface p-5 shadow-glass outline-none sm:rounded-xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          // Stop it here so the book's own Escape handler (close the book) does not also run.
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="contact-sheet-title" className="font-display text-2xl font-semibold text-ink">
            Escríbeme
          </h2>
          <button
            type="button"
            aria-label="Cerrar formulario"
            onClick={() => setOpen(false)}
            className="grid h-11 w-11 place-items-center rounded-pill border border-glass-border bg-glass text-ink transition-colors hover:border-white/30"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
