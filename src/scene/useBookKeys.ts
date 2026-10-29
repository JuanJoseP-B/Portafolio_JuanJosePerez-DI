import { useEffect } from 'react';
import { useBook } from '../store/useBook';
import { isZoomed, resetZoom } from './zoomCamera';

const INTERACTIVE = /^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/;

/** Keyboard: arrows turn pages (faces in one-page mode), Enter opens the book, Escape closes it. */
export function useBookKeys(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if (typing) return;

      const book = useBook.getState();
      if (book.contactOpen) return; // the contact sheet owns the keyboard
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          if (book.compact) book.nextFace();
          else book.next();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (book.compact) book.prevFace();
          else book.prev();
          break;
        case 'Enter':
          // Let focused links and buttons keep their own Enter behaviour.
          if (target && INTERACTIVE.test(target.tagName)) return;
          if (book.target === 0) book.setTarget(1);
          break;
        case 'Escape':
          // Two steps: first leave the zoom, then close the book.
          if (isZoomed()) resetZoom();
          else if (book.target !== 0) book.setTarget(0);
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
