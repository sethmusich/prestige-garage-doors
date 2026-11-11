// One-off: build web logo assets from assets-source/.
// Run: node scripts/process-logo.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'assets-source/Asset 4@4x transparent.png'; // 2228x1808, transparent, navy wordmark
const NAVY = { r: 10, g: 17, b: 40 };
mkdirSync('src/assets/logo', { recursive: true });
mkdirSync('public', { recursive: true });

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

// Find where the crest ends: first fully transparent row band below the crest (crest ≈ top 2/3).
function rowEmpty(y) {
  for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3] > 8) return false;
  return true;
}
let crestBottom = Math.floor(height * 0.55);
while (crestBottom < height && !rowEmpty(crestBottom)) crestBottom++;

// 1) Crest only (gold, transparent).
// (sharp's trim() doesn't crop this file's transparent edges, so measure the opaque bounds.)
let minX = width, maxX = 0;
for (let y = 0; y < crestBottom; y++) for (let x = 0; x < width; x++) {
  if (data[(y * width + x) * 4 + 3] > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
}
await sharp(SRC).extract({ left: minX, top: 0, width: maxX - minX + 1, height: crestBottom }).png().toFile('src/assets/logo/crest.png');

// 2) Full logo for dark backgrounds: recolor dark (navy) pixels to white, keep gold.
const light = Buffer.from(data);
for (let i = 0; i < light.length; i += 4) {
  const [r, g, b, a] = [light[i], light[i + 1], light[i + 2], light[i + 3]];
  if (a > 0 && r + g + b < 200) { light[i] = 255; light[i + 1] = 255; light[i + 2] = 255; }
}
await sharp(light, { raw: { width, height, channels: 4 } }).trim().png().toFile('src/assets/logo/logo-full-light.png');

// 3) Favicon: crest on navy rounded square.
const crest64 = await sharp('src/assets/logo/crest.png').resize(52, 52, { fit: 'contain', background: { ...NAVY, alpha: 0 } }).toBuffer();
await sharp({ create: { width: 64, height: 64, channels: 4, background: { ...NAVY, alpha: 1 } } })
  .composite([{ input: crest64, gravity: 'center' }]).png().toFile('public/favicon.png');
const crest180 = await sharp('src/assets/logo/crest.png').resize(140, 140, { fit: 'contain', background: { ...NAVY, alpha: 0 } }).toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: { ...NAVY, alpha: 1 } } })
  .composite([{ input: crest180, gravity: 'center' }]).png().toFile('public/apple-touch-icon.png');

// 4) Open Graph image 1200x630.
const ogLogo = await sharp('src/assets/logo/logo-full-light.png').resize(560, 480, { fit: 'inside' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: { ...NAVY, alpha: 1 } } })
  .composite([{ input: ogLogo, gravity: 'center' }]).png().toFile('public/og.png');

console.log('crest rows 0..', crestBottom, 'done');
