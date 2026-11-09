import { useLayoutEffect, useRef } from 'react';
import { renderBones, snapshotBones } from 'boneyard-js';
import './LoadingSkeleton.css';

/** The canvas has no DOM to snapshot; the text view can be measured directly. */
export function LoadingSkeleton({ mode }: { mode: 'book' | 'text' }) {
  const bonesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (mode !== 'text' || !bonesRef.current) return;
    const hero = document.querySelector('[data-text-skeleton-source]');
    if (!hero) return;
    const bounds = hero.getBoundingClientRect();
    const bones = snapshotBones(hero, 'text-hero');
    if (!bones.bones.length) return;
    bonesRef.current.style.top = `${bounds.top}px`;
    bonesRef.current.style.left = `${bounds.left}px`;
    bonesRef.current.style.width = `${bounds.width}px`;
    bonesRef.current.innerHTML = renderBones(bones, 'rgba(255,255,255,0.09)', false);
  }, [mode]);

  return (
    <div className={`loading-skeleton loading-skeleton--${mode}`} aria-hidden="true">
      <div className="loading-skeleton__nav"><i /><i /><i /></div>
      {mode === 'text' ? (
        <div ref={bonesRef} className="loading-skeleton__captured" />
      ) : (
        <>
          <div className="loading-skeleton__title"><i /><i /><i /></div>
          <div className="loading-skeleton__book"><div /></div>
          <div className="loading-skeleton__controls"><i /><i /><i /></div>
        </>
      )}
    </div>
  );
}
