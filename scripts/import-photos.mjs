// One-off: convert assets-source/old-site photos into src/assets/photos (jpg, max 2000px).
// Run: node scripts/import-photos.mjs
import sharp from 'sharp';
const D = 'assets-source/old-site/';
const MAP = [
  ['0cb4-IMG_0883.jpg', 'new-door-single-white'],
  ['1f56-IMG_2588.jpg', 'tech-spring-repair'],
  ['2768-IMG_2638.jpg', 'estimate-consult'],
  ['3add-IMG_2641.PNG', 'tech-handshake', true],
  ['4c6c-new-doors.jpg', 'new-doors-double-gray'],
  ['4dff-Repair-pic.PNG', 'opener-install', true],
  ['5d3e-IMG_0890.jpg', 'wood-door-house'],
  ['646f-IMG_2586.jpg', 'tech-repair-closeup'],
  ['6686-IMG_0169.png', 'modern-wood-door', true],
  ['6aef-IMG_9533.png', 'carriage-doors'],
  ['7173-header-service-pic.jpg', 'truck-rail'],
  ['7c5b-IMG_2570.jpg', 'crew-truck-loading'],
  ['8ec3-IMG_2629.jpg', 'estimate-consult-2'],
  ['9e2e-IMG_2610.jpg', 'tech-overhead'],
  ['a76a-IMG_2589.jpg', 'tech-spring-repair-2'],
  ['b116-IMG_0170.PNG', 'modern-black-doors', true],
  ['e1d6-tune-up-pic.jpg', 'tune-up-door'],
];
for (const [src, name, letterbox] of MAP) {
  let img = sharp(D + src).rotate();
  if (letterbox) img = sharp(await img.trim({ background: '#000000', threshold: 40 }).toBuffer());
  const out = await img.resize(2000, 2000, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(`src/assets/photos/${name}.jpg`);
  console.log(name, out.width + 'x' + out.height);
}
