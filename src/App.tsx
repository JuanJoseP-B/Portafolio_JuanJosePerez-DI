import { Suspense, lazy, useEffect, useState } from 'react';
import { useCompactMode } from './lib/useCompactMode';
import { hasWebGL } from './lib/webgl';
import { SceneBoundary } from './scene/SceneBoundary';
import { initHashSync } from './store/useBook';
import { A11yContent } from './ui/A11yContent';
import { ContactSheet } from './ui/ContactSheet';
import { DebugHud } from './ui/DebugHud';
import { Loader } from './ui/Loader';
import { Overlay } from './ui/Overlay';
import { ContextLostNotice, FallbackNotice } from './ui/SceneNotices';

// The 3D scene (three.js and friends) is its own chunk: the loader and the overlay paint before it arrives.
const Experience = lazy(() => import('./scene/Experience').then((m) => ({ default: m.Experience })));

export default function App() {
  const [textMode, setTextMode] = useState(false);
  // 'ok' = try the 3D book; otherwise the text version is the page (no WebGL, or the scene crashed).
  const [status, setStatus] = useState<'ok' | 'unsupported' | 'error'>(() => (hasWebGL() ? 'ok' : 'unsupported'));
  const [attempt, setAttempt] = useState(0); // bumping it remounts the scene (retry)
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => initHashSync(), []);
  useCompactMode();

  if (status !== 'ok') {
    return (
      <A11yContent
        visible
        notice={
          <FallbackNotice
            reason={status}
            onRetry={
              status === 'error'
                ? () => {
                    setAttempt((n) => n + 1);
                    setStatus('ok');
                  }
                : undefined
            }
          />
        }
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0">
        <SceneBoundary key={attempt} onError={() => setStatus('error')}>
          <Suspense fallback={null}>
            <Experience onContextLost={() => setContextLost(true)} onContextRestored={() => setContextLost(false)} />
          </Suspense>
        </SceneBoundary>
      </div>
      <Overlay onToggleText={() => setTextMode(true)} />
      <ContactSheet />
      <A11yContent visible={textMode} onClose={() => setTextMode(false)} />
      <Loader hidden={textMode} onSkipToText={() => setTextMode(true)} />
      {contextLost && (
        <ContextLostNotice
          onRetry={() => {
            setContextLost(false);
            setAttempt((n) => n + 1);
          }}
          onText={() => {
            setContextLost(false);
            setTextMode(true);
          }}
        />
      )}
      <DebugHud />
    </>
  );
}
