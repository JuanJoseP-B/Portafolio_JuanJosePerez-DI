// Optimizes the portrait used by the "Sobre mí" face and the text version.
// Usage: node scripts/optimize-photo.mjs [maxKB=150] [width=900]
// Reads the untouched original from scripts/source-images/ (git-ignored) and writes public/imagenAvaarJJ.webp.
import { statSync } from 'node:fs';
import sharp from 'sharp';

const SOURCE = 'scripts/source-images/imagenAvaarJJ.jpg';
const OUTPUT = 'public/imagenAvaarJJ.webp';
const [maxKB = '150', width = '900'] = process.argv.slice(2);
const limit = Number(maxKB) * 1024;

const before = statSync(SOURCE).size;
let size = Infinity;
for (const quality of [82, 78, 74, 70, 66, 62, 58, 54, 50]) {
  await sharp(SOURCE)
    .rotate() // honour EXIF orientation
    .resize({ width: Number(width), withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(OUTPUT);
  size = statSync(OUTPUT).size;
  console.log(`quality ${quality}: ${(size / 1024).toFixed(0)} KB`);
  if (size <= limit) break;
}
console.log(`${(before / 1024).toFixed(0)} KB -> ${(size / 1024).toFixed(0)} KB ${size <= limit ? 'OK' : `(still above ${maxKB} KB)`}`);
