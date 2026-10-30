/**
 * Pure Node.js script to generate high-fidelity PNG assets:
 * - /public/og-image.png (1200x630) for Facebook, WhatsApp, LinkedIn, X/Twitter, Slack, Discord
 * - /public/apple-touch-icon.png (180x180) for Apple Safari & Mobile Bookmarks
 * - /public/favicon-32x32.png (32x32) for standard browser tabs
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation for PNG chunks
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(len + 12);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = crc32(crcData);
  buf.writeUInt32BE(crc, len + 8);
  return buf;
}

function createPng(width, height, pixelFn) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // standard filter
  ihdr[12] = 0; // non-interlaced
  const ihdrChunk = writeChunk('IHDR', ihdr);

  // Raw Scanlines: each row = 1 filter byte (0) + width * 4 bytes RGBA
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = writeChunk('IDAT', idatData);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// 1. Generate 32x32 Favicon
const faviconPng = createPng(32, 32, (x, y) => {
  // Rounded dark box with emerald emblem
  const distCorner = Math.max(Math.abs(x - 15.5), Math.abs(y - 15.5));
  if (distCorner > 14.5) return [0, 0, 0, 0]; // Transparent outer

  // Border check
  const isBorder = (x <= 1 || x >= 30 || y <= 1 || y >= 30);
  if (isBorder) return [16, 185, 129, 140]; // Emerald outline

  // Center emblem logic
  const dx = x - 16;
  const dy = y - 16;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Center vertical wave bars
  if (x === 11 && y >= 13 && y <= 19) return [16, 185, 129, 255]; // emerald bar
  if (x === 14 && y >= 11 && y <= 21) return [255, 255, 255, 255]; // white bar
  if (x === 17 && y >= 9 && y <= 23) return [16, 185, 129, 255];  // emerald bar
  if (x === 20 && y >= 12 && y <= 20) return [255, 255, 255, 255]; // white bar

  // Background
  return [3, 7, 5, 255]; // Dark background #030705
});
fs.writeFileSync(path.resolve('public/favicon-32x32.png'), faviconPng);
console.log('✓ Created public/favicon-32x32.png');

// 2. Generate 180x180 Apple Touch Icon
const appleTouchPng = createPng(180, 180, (x, y) => {
  // Rounded squircle
  const cornerR = 36;
  let inCorner = false;
  if (x < cornerR && y < cornerR) {
    inCorner = Math.hypot(x - cornerR, y - cornerR) > cornerR;
  } else if (x > 180 - cornerR && y < cornerR) {
    inCorner = Math.hypot(x - (180 - cornerR), y - cornerR) > cornerR;
  } else if (x < cornerR && y > 180 - cornerR) {
    inCorner = Math.hypot(x - cornerR, y - (180 - cornerR)) > cornerR;
  } else if (x > 180 - cornerR && y > 180 - cornerR) {
    inCorner = Math.hypot(x - (180 - cornerR), y - (180 - cornerR)) > cornerR;
  }
  if (inCorner) return [0, 0, 0, 0];

  // Subtle emerald border
  const isBorder = (x <= 3 || x >= 176 || y <= 3 || y >= 176);
  if (isBorder) return [16, 185, 129, 180];

  // Center Waveform and Emblem
  // 4 center bars:
  // Bar 1
  if (x >= 60 && x <= 70 && y >= 72 && y <= 108) return [16, 185, 129, 255];
  // Bar 2
  if (x >= 78 && x <= 88 && y >= 58 && y <= 122) return [255, 255, 255, 255];
  // Bar 3
  if (x >= 96 && x <= 106 && y >= 46 && y <= 134) return [16, 185, 129, 255];
  // Bar 4
  if (x >= 114 && x <= 124 && y >= 64 && y <= 116) return [255, 255, 255, 255];

  // Surrounding glow
  const cx = 90, cy = 90;
  const dist = Math.hypot(x - cx, y - cy);
  const glow = Math.max(0, 1 - dist / 80);
  const r = Math.round(3 + glow * 10);
  const g = Math.round(7 + glow * 45);
  const b = Math.round(5 + glow * 30);

  return [r, g, b, 255];
});
fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), appleTouchPng);
console.log('✓ Created public/apple-touch-icon.png');

// 3. Generate 1200x630 Open Graph Image
const ogPng = createPng(1200, 630, (x, y) => {
  // Background gradient with emerald ambient glow on top center
  const glowX = 600, glowY = 180;
  const glowDist = Math.hypot(x - glowX, y - glowY);
  const glowFactor = Math.max(0, 1 - glowDist / 450);

  // Grid line accents (subtle engineering feel)
  const isGrid = (x % 120 === 0 || y % 126 === 0);
  const gridAlpha = isGrid ? 10 : 0;

  let r = 3 + Math.round(glowFactor * 14) + gridAlpha;
  let g = 7 + Math.round(glowFactor * 65) + gridAlpha;
  let b = 5 + Math.round(glowFactor * 42) + gridAlpha;

  // Bottom edge accent bar
  if (y >= 622) {
    return [16, 185, 129, 255]; // emerald baseline
  }

  // Draw stylized emblem glyph on the left (x: 100-240, y: 180-320)
  if (x >= 120 && x <= 220 && y >= 190 && y <= 290) {
    const ex = x - 170;
    const ey = y - 240;
    const edist = Math.hypot(ex, ey);

    // Audio Bars in Emblem
    if (x >= 142 && x <= 149 && y >= 222 && y <= 258) return [16, 185, 129, 255];
    if (x >= 155 && x <= 162 && y >= 210 && y <= 270) return [255, 255, 255, 255];
    if (x >= 168 && x <= 175 && y >= 198 && y <= 282) return [16, 185, 129, 255];
    if (x >= 181 && x <= 188 && y >= 216 && y <= 264) return [255, 255, 255, 255];

    // Circle ring
    if (edist >= 45 && edist <= 50) return [16, 185, 129, 230];
  }

  return [Math.min(255, r), Math.min(255, g), Math.min(255, b), 255];
});
fs.writeFileSync(path.resolve('public/og-image.png'), ogPng);
console.log('✓ Created public/og-image.png (1200x630)');
