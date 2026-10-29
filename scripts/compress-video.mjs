// Compress a demo video for the web: trimmed, 720p, muted, H.264, faststart.
// Usage: node scripts/compress-video.mjs <input> <output.mp4> [startSec=0] [durationSec=10] [maxMB=2] [videoFilter=scale=-2:720]
// Also writes <output>-poster.jpg (first frame of the trimmed clip).
// videoFilter runs before fps=24 and is reused for the poster (e.g. "crop=1030:1030:0:433,scale=720:720").
import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';
import ffmpegPath from 'ffmpeg-static';

const [input, output, start = '0', duration = '10', maxMB = '2', filter = 'scale=-2:720'] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: node scripts/compress-video.mjs <input> <output.mp4> [start] [duration] [maxMB]');
  process.exit(1);
}

mkdirSync(dirname(output), { recursive: true });
const limit = Number(maxMB) * 1024 * 1024;

const run = (args) => {
  const r = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(r.stderr || r.error?.message);
    process.exit(1);
  }
};

let size = Infinity;
for (const crf of [22, 24, 26, 28, 30, 32, 34, 36, 38]) {
  run([
    '-ss', start, '-t', duration, '-i', input,
    '-an',
    '-vf', `${filter},fps=24`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    output,
  ]);
  size = statSync(output).size;
  console.log(`crf ${crf}: ${(size / 1024 / 1024).toFixed(2)} MB`);
  if (size <= limit) break;
}

run(['-ss', start, '-i', input, '-frames:v', '1', '-vf', filter, '-q:v', '4', output.replace(/\.mp4$/, '-poster.jpg')]);
console.log(size <= limit ? 'OK' : `Warning: still above ${maxMB} MB`);
