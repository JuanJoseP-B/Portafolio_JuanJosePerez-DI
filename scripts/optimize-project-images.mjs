// Optimizes the project captures into `public/img/projects/*.webp`.
// Usage: node scripts/optimize-project-images.mjs
// SegundoAire has no still capture: its poster frame (made by compress-video.mjs) is used instead.
import { mkdirSync, statSync } from 'node:fs';
import sharp from 'sharp';

// source file -> output name (in public/img/projects/)
const IMAGES = {
  'imagenes_proyectos/Login-Argos_MesaCrisis.png': 'argos',
  'imagenes_proyectos/Bienvenida-ArcoFisio.png': 'arcofisio',
  'public/video/segundoaire-poster.jpg': 'segundoaire',
};
const MAX_WIDTH = 1600; // never upscaled
const QUALITY = 86;

mkdirSync('public/img/projects', { recursive: true });
for (const [source, name] of Object.entries(IMAGES)) {
  const out = `public/img/projects/${name}.webp`;
  await sharp(source)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`${out}  ${meta.width}x${meta.height}  ${Math.round(statSync(out).size / 1024)} KB`);
}
