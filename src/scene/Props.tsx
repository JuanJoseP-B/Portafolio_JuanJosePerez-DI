import { useEffect, useMemo, useRef } from 'react';
import { ConeGeometry, DoubleSide, LatheGeometry, Vector2, type Group } from 'three';
import { portfolio } from '../content/portfolio';
import { enableShadows, makeCanvasTexture } from './textures';
import type { V3 } from './types';

// --- Tuning (desk is the XZ plane; +x right, +z towards the camera; yaw in radians) ---
const CUP: { position: V3; yaw: number } = { position: [2.3, 0, -0.1], yaw: 0.4 };
const PENCIL: { position: V3; yaw: number } = { position: [-1.9, 0, 0.95], yaw: 0.9 };
const PLANT: { position: V3 } = { position: [-1.75, 0, 0.2] };
const CARDS: { position: V3; yaw: number } = { position: [1.75, 0, 1.15], yaw: -0.35 };
// ------------------------------------------------------------------------------------

const pts = (pairs: [number, number][]) => pairs.map(([r, y]) => new Vector2(r, y));

function drawLatte(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w / 2, h / 2, 8, w / 2, h / 2, w / 2);
  g.addColorStop(0, '#74482a');
  g.addColorStop(1, '#3b2213');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Cream heart.
  ctx.save();
  ctx.translate(w / 2, h / 2 + 6);
  ctx.scale(w / 256, h / 256);
  ctx.fillStyle = '#f1e2c4';
  ctx.beginPath();
  ctx.moveTo(0, 56);
  ctx.bezierCurveTo(-88, -6, -50, -68, 0, -24);
  ctx.bezierCurveTo(50, -68, 88, -6, 0, 56);
  ctx.fill();
  ctx.restore();
}

function drawCard(dark: boolean) {
  const { name } = portfolio.person;
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = dark ? '#0d1018' : '#efe9dc';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = dark ? '#f4f6fb' : '#1b1813';
    ctx.font = '600 150px "Space Grotesk", system-ui, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('JJ', 48, h / 2 + 30);
    ctx.fillStyle = dark ? '#9aa3b5' : '#5e564a';
    ctx.font = '500 30px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText(name, 48, h - 56);
  };
}

function Cup({ position, yaw }: { position: V3; yaw: number }) {
  const group = useRef<Group>(null);
  const geometry = useMemo(
    () => ({
      saucer: new LatheGeometry(
        pts([
          [0, 0],
          [0.06, 0],
          [0.13, 0.01],
          [0.16, 0.022],
          [0.158, 0.024],
          [0.125, 0.014],
          [0.06, 0.007],
          [0, 0.007],
        ]),
        64,
      ),
      cup: new LatheGeometry(
        pts([
          [0, 0],
          [0.04, 0],
          [0.055, 0.008],
          [0.078, 0.05],
          [0.092, 0.088],
          [0.089, 0.09],
          [0.084, 0.088],
          [0.07, 0.05],
          [0.047, 0.016],
          [0, 0.014],
        ]),
        64,
      ),
    }),
    [],
  );
  const latte = useMemo(() => makeCanvasTexture(256, 256, drawLatte), []);

  useEffect(() => {
    enableShadows(group.current);
    return () => {
      geometry.saucer.dispose();
      geometry.cup.dispose();
      latte.dispose();
    };
  }, [geometry, latte]);

  return (
    <group ref={group} position={position} rotation={[0, yaw, 0]}>
      <mesh geometry={geometry.saucer}>
        <meshStandardMaterial color="#f2ede4" roughness={0.28} side={DoubleSide} />
      </mesh>
      <group position={[0, 0.007, 0]}>
        <mesh geometry={geometry.cup}>
          <meshStandardMaterial color="#f2ede4" roughness={0.28} side={DoubleSide} />
        </mesh>
        <mesh position={[0, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.077, 48]} />
          <meshStandardMaterial map={latte} roughness={0.45} />
        </mesh>
        <mesh position={[0.088, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.032, 0.007, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#f2ede4" roughness={0.28} />
        </mesh>
      </group>
      {/* Spoon resting on the saucer */}
      <group position={[-0.03, 0.022, 0.09]} rotation={[0, 0.5, 0]}>
        <mesh position={[0.09, 0, 0]}>
          <boxGeometry args={[0.17, 0.004, 0.01]} />
          <meshStandardMaterial color="#c9ccd2" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[-0.015, 0, 0]} scale={[0.03, 0.005, 0.018]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshStandardMaterial color="#c9ccd2" metalness={0.5} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

function Pencil({ position, yaw }: { position: V3; yaw: number }) {
  const group = useRef<Group>(null);
  useEffect(() => enableShadows(group.current), []);

  // Lies along +x on the desk (cylinders are modelled along y, so they are rotated).
  return (
    <group ref={group} position={position} rotation={[0, yaw, 0]}>
      <group position={[0, 0.011, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.011, 0.011, 0.78, 6]} />
          <meshStandardMaterial color="#1d1d22" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.41, 0]}>
          <cylinderGeometry args={[0.0118, 0.0118, 0.05, 16]} />
          <meshStandardMaterial color="#b9bcc4" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.0105, 0.0105, 0.03, 16]} />
          <meshStandardMaterial color="#8a4b4b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.425, 0]}>
          <coneGeometry args={[0.011, 0.07, 6]} />
          <meshStandardMaterial color="#c9a06a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.455, 0]}>
          <coneGeometry args={[0.0042, 0.016, 6]} />
          <meshStandardMaterial color="#202024" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

const LEAF_RINGS = [
  { count: 9, tilt: 1.0, radius: 0.045, scale: 1 },
  { count: 6, tilt: 0.62, radius: 0.028, scale: 0.9 },
  { count: 4, tilt: 0.28, radius: 0.012, scale: 0.72 },
];

function Plant({ position }: { position: V3 }) {
  const group = useRef<Group>(null);
  const leaf = useMemo(() => {
    const geo = new ConeGeometry(0.03, 0.13, 10);
    geo.translate(0, 0.065, 0);
    return geo;
  }, []);
  const leaves = useMemo(
    () =>
      LEAF_RINGS.flatMap((ring, ringIndex) =>
        Array.from({ length: ring.count }, (_, i) => ({
          key: `${ringIndex}-${i}`,
          angle: (i / ring.count) * Math.PI * 2 + ringIndex * 0.45,
          ...ring,
        })),
      ),
    [],
  );

  useEffect(() => {
    enableShadows(group.current);
    return () => leaf.dispose();
  }, [leaf]);

  return (
    <group ref={group} position={position}>
      <mesh position={[0, 0.085, 0]}>
        <cylinderGeometry args={[0.15, 0.115, 0.17, 40]} />
        <meshStandardMaterial color="#2b2e35" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.169, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.142, 32]} />
        <meshStandardMaterial color="#0c0a08" roughness={1} />
      </mesh>
      <group position={[0, 0.165, 0]}>
        {leaves.map((l) => (
          <group key={l.key} rotation={[0, l.angle, 0]}>
            <group position={[0, 0, l.radius]} rotation={[l.tilt, 0, 0]} scale={l.scale}>
              <mesh geometry={leaf} scale={[1, 1, 0.38]}>
                <meshStandardMaterial color="#7fa595" roughness={0.6} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

function Cards({ position, yaw }: { position: V3; yaw: number }) {
  const group = useRef<Group>(null);
  const textures = useMemo(
    () => ({
      dark: makeCanvasTexture(512, 300, drawCard(true)),
      light: makeCanvasTexture(512, 300, drawCard(false)),
    }),
    [],
  );

  useEffect(() => {
    enableShadows(group.current);
    return () => {
      textures.dark.dispose();
      textures.light.dispose();
    };
  }, [textures]);

  const card = (tex: typeof textures.dark, edge: string) => (
    <>
      {[0, 1, 3, 4, 5].map((i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} color={edge} roughness={0.8} />
      ))}
      <meshStandardMaterial attach="material-2" map={tex} roughness={0.65} />
    </>
  );

  return (
    <group ref={group} position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0.02, 0.003, 0.03]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.34, 0.006, 0.2]} />
        {card(textures.light, '#d9d2c2')}
      </mesh>
      <mesh position={[0, 0.0105, 0]}>
        <boxGeometry args={[0.34, 0.006, 0.2]} />
        {card(textures.dark, '#0d1018')}
      </mesh>
    </group>
  );
}

/** Desk props: coffee cup, pencil, plant and business cards (all primitives). */
export function Props() {
  return (
    <>
      <Cup {...CUP} />
      <Pencil {...PENCIL} />
      <Plant {...PLANT} />
      <Cards {...CARDS} />
    </>
  );
}
