import { Fragment } from 'react';
import { isPlaceholder } from '../lib/placeholder';

const SPLIT = /(\[[^\]]+\])/g;

/** Renders text and marks every "[PLACEHOLDER]" segment with a dashed outline. */
export function Placeholder({ children }: { children: string }) {
  return (
    <>
      {children.split(SPLIT).map((part, i) =>
        isPlaceholder(part) ? (
          <span key={i} className="placeholder">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
