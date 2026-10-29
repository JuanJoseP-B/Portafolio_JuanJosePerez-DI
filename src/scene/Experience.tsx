import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, ContactShadows, PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { useBook } from '../store/useBook';
import { BookCameraRig, CAMERA_FOV, CAMERA_POSES } from './CameraRig';
import { Book } from './Book';
import { Desk } from './Desk';
import { Props } from './Props';
import type { V3 } from './types';
import { ZoomInput } from './ZoomInput';

// --- Tuning -----------------------------------------------------------------
const BACKGROUND = '#05060a';

// Warm key light from the top-right; it makes the "pool" of light on the desk.
const KEY_LIGHT = {
  position: [2.4, 4.2, 1.2] as V3,
  color: '#ffd7a3',
  // Physical units (candela): raise if the desk is too dark, lower if the paper burns out.
  // Previous value: 240 (white paper reached ~2.3 in linear light, above the bloom threshold).
  intensity: 170,
  angle: 0.5, // cone half-angle (rad); smaller = tighter pool
  penumbra: 1, // 1 = fully soft edge
};

// Faint cool fill so shadows are not pure black.
const FILL = { sky: '#2a3045', ground: '#0d0805', intensity: 0.8 };

const POST = {
  bloomIntensity: 0.2,
  // Only the brightest highlights glow. Previous value: 1.4, which made the white pages bloom and
  // blur the text; it must stay above the paper's linear brightness (~1.3 after the light + tint change).
  bloomThreshold: 2.2,
  vignetteOffset: 0.25, // lower = darker corners reach further in
  vignetteDarkness: 0.9,
  noiseOpacity: 0.02, // previous value: 0.03; film grain over small text hurts legibility
};

const DPR_RANGE: [number, number] = [1, 1.75];
// Phones: fewer pixels, no MSAA, smaller shadow maps (the GPU and the battery are the limit there).
const DPR_RANGE_COMPACT: [number, number] = [1, 1.5];
const SHADOW_MAP = { desktop: 2048, compact: 1024 };
const CONTACT_SHADOW_RESOLUTION = { desktop: 1024, compact: 512 };
const MSAA_SAMPLES = { desktop: 4, compact: 0 };
// ------------------------------------------------------------------------------

/** Rendering stops while the tab is hidden (nothing to see, no battery to burn). */
function useTabVisible(): boolean {
  const [visible, setVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

interface ExperienceProps {
  /** The browser took the WebGL context away (low memory, GPU reset, too many contexts). */
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

/** Full-screen 3D scene: desk, props, the interactive book, light and post-processing. */
export function Experience({ onContextLost, onContextRestored }: ExperienceProps) {
  const compact = useBook((s) => s.compact);
  const visible = useTabVisible();
  const range = compact ? DPR_RANGE_COMPACT : DPR_RANGE;
  const [dpr, setDpr] = useState(range[1]);
  const quality = compact ? 'compact' : 'desktop';

  return (
    <Canvas
      aria-label="Libro interactivo del portafolio de Juan José Pérez Bravo"
      role="img"
      shadows
      dpr={Math.min(dpr, range[1])}
      frameloop={visible ? 'always' : 'never'}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ position: CAMERA_POSES.closed.position, fov: CAMERA_FOV, near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        canvas.addEventListener('webglcontextlost', (event) => {
          event.preventDefault(); // allows the browser to restore the context
          onContextLost?.();
        });
        canvas.addEventListener('webglcontextrestored', () => onContextRestored?.());
      }}
    >
      <color attach="background" args={[BACKGROUND]} />

      {/* Only changes dpr when the measured performance changes, never per frame. */}
      <PerformanceMonitor
        onChange={({ factor }) =>
          setDpr(Math.min(range[1], Math.max(range[0], range[0] + (range[1] - range[0]) * factor)))
        }
      />
      <AdaptiveDpr pixelated />

      <hemisphereLight args={[FILL.sky, FILL.ground, FILL.intensity]} />
      <spotLight
        position={KEY_LIGHT.position}
        color={KEY_LIGHT.color}
        intensity={KEY_LIGHT.intensity}
        angle={KEY_LIGHT.angle}
        penumbra={KEY_LIGHT.penumbra}
        decay={2}
        castShadow
        shadow-mapSize={[SHADOW_MAP[quality], SHADOW_MAP[quality]]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-near={2}
        shadow-camera-far={12}
      />

      <Desk />
      <Props />
      <Book />
      <ContactShadows position={[0, 0.002, 0]} opacity={0.65} scale={12} blur={2.6} far={1.2} resolution={CONTACT_SHADOW_RESOLUTION[quality]} frames={Infinity} />

      <BookCameraRig />
      <ZoomInput />

      <EffectComposer multisampling={MSAA_SAMPLES[quality]}>
        <Bloom intensity={POST.bloomIntensity} luminanceThreshold={POST.bloomThreshold} mipmapBlur />
        <ToneMapping />
        <Vignette offset={POST.vignetteOffset} darkness={POST.vignetteDarkness} />
        <Noise opacity={POST.noiseOpacity} />
      </EffectComposer>
    </Canvas>
  );
}
