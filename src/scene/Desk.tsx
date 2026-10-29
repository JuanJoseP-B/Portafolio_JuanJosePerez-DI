import { useEffect, useMemo } from 'react';
import { RepeatWrapping } from 'three';
import { drawWood, makeCanvasTexture } from './textures';

// --- Tuning -----------------------------------------------------------------
const DESK_SIZE: [number, number] = [18, 11]; // world units (covers the whole viewport)
const TEXTURE_REPEAT: [number, number] = [2.4, 2.4]; // grain density
const BUMP_SCALE = 1.6;
// To use a real PBR wood later, drop albedo/roughness/normal files in
// public/textures/desk/ and replace the three procedural maps below.
// ------------------------------------------------------------------------------

/** Wood desk plane at y = 0 with procedural grain. */
export function Desk() {
  const maps = useMemo(() => {
    const albedo = makeCanvasTexture(2048, 1024, drawWood('albedo'));
    const rough = makeCanvasTexture(2048, 1024, drawWood('rough'), false);
    const bump = makeCanvasTexture(2048, 1024, drawWood('bump'), false);
    for (const tex of [albedo, rough, bump]) {
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(TEXTURE_REPEAT[0], TEXTURE_REPEAT[1]);
    }
    return { albedo, rough, bump };
  }, []);

  useEffect(
    () => () => {
      maps.albedo.dispose();
      maps.rough.dispose();
      maps.bump.dispose();
    },
    [maps],
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={DESK_SIZE} />
      <meshStandardMaterial
        map={maps.albedo}
        roughnessMap={maps.rough}
        bumpMap={maps.bump}
        bumpScale={BUMP_SCALE}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
