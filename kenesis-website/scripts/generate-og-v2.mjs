/**
 * Generates public/kenesis-og-v2.png — a 1200×630 social card
 * composed from a real Kenesis factory frame (warehouse-wide.png).
 *
 * Run: node scripts/generate-og-v2.mjs
 */
import { ImageResponse } from 'next/og.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'public', 'kenesis-og-v2.png');
const fontCache = join(root, 'scripts', '.font-cache');

const WIDTH = 1200;
const HEIGHT = 630;

function toDataUri(filePath, mime) {
  return `data:${mime};base64,${readFileSync(filePath).toString('base64')}`;
}

async function logoOnTransparent(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (luminance < 28) {
      data[i + 3] = 0;
    } else {
      data[i] = 244;
      data[i + 1] = 238;
      data[i + 2] = 227;
      data[i + 3] = Math.min(255, Math.round((luminance / 255) * 255));
    }
  }
  return `data:image/png;base64,${(
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
  ).toString('base64')}`;
}

async function ensureFont(filename, url) {
  mkdirSync(fontCache, { recursive: true });
  const dest = join(fontCache, filename);
  if (existsSync(dest) && readFileSync(dest).length > 1000) return dest;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${filename}: ${res.status}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

async function main() {
  const serifPath = await ensureFont(
    'InstrumentSerif-Regular.ttf',
    'https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf',
  );
  const serifItalicPath = await ensureFont(
    'InstrumentSerif-Italic.ttf',
    'https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Italic.ttf',
  );
  const geistPath = await ensureFont(
    'Geist-Regular.ttf',
    'https://cdn.jsdelivr.net/gh/vercel/geist-font@main/packages/next/dist/fonts/geist-sans/Geist-Regular.ttf',
  );

  const warehouseUri = toDataUri(join(root, 'public', 'hero', 'warehouse-wide.png'), 'image/png');
  const logoUri = await logoOnTransparent(join(root, 'public', 'kenesis-icon.png'));
  const wordmarkFont = readFileSync(join(root, 'public', 'fonts', 'MBFNeoWave-Regular.otf'));

  const response = new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: WIDTH,
          height: HEIGHT,
          display: 'flex',
          position: 'relative',
          background: '#0a0a0b',
          overflow: 'hidden',
        },
        children: [
          // Right: real warehouse camera frame, cover-cropped onto the right 58%
          {
            type: 'img',
            props: {
              src: warehouseUri,
              width: 1478,
              height: 630,
              style: {
                position: 'absolute',
                top: 0,
                left: 268,
                width: 1478,
                height: 630,
                objectFit: 'cover',
              },
            },
          },
          // Integrated dark wash from the typography side into the frame
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                display: 'flex',
                backgroundImage:
                  'linear-gradient(90deg, #0a0a0b 0%, #0a0a0b 38%, rgba(10,10,11,0.82) 46%, rgba(10,10,11,0.28) 58%, rgba(10,10,11,0.12) 100%)',
              },
            },
          },
          // Subtle top/bottom letterbox so the frame reads as a camera feed
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                display: 'flex',
                backgroundImage:
                  'linear-gradient(180deg, rgba(10,10,11,0.35) 0%, transparent 18%, transparent 78%, rgba(10,10,11,0.45) 100%)',
              },
            },
          },

          // One aisle zone + four corner marks on the forklift (not a second box)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 742,
                top: 292,
                width: 248,
                height: 168,
                display: 'flex',
                border: '1px solid rgba(245,158,11,0.42)',
                background: 'rgba(245,158,11,0.035)',
              },
            },
          },
          ...[
            { left: 818, top: 318, borderWidth: '2px 0 0 2px' },
            { left: 894, top: 318, borderWidth: '2px 2px 0 0' },
            { left: 818, top: 376, borderWidth: '0 0 2px 2px' },
            { left: 894, top: 376, borderWidth: '0 2px 2px 0' },
          ].map((corner) => ({
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: corner.left,
                top: corner.top,
                width: 18,
                height: 18,
                display: 'flex',
                borderColor: 'rgba(251,191,36,0.92)',
                borderStyle: 'solid',
                borderWidth: corner.borderWidth,
              },
            },
          })),
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 742,
                top: 262,
                display: 'flex',
                alignItems: 'center',
                padding: '5px 10px',
                background: 'rgba(10,10,11,0.82)',
                border: '1px solid rgba(245,158,11,0.45)',
                color: '#f3ead7',
                fontFamily: 'Geist',
                fontSize: 15,
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              },
              children: 'Restricted entry detected  ·  Bay 03',
            },
          },

          // Left typography
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 56,
                top: 48,
                bottom: 48,
                width: 500,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: 12 },
                    children: [
                      {
                        type: 'img',
                        props: {
                          src: logoUri,
                          width: 36,
                          height: 36,
                          style: { width: 36, height: 36 },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: '#f4eee3',
                            fontFamily: 'NeoWave',
                            fontSize: 22,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          },
                          children: 'Kenesis',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', gap: 22 },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#f4eee3',
                            fontFamily: 'Instrument Serif',
                            fontSize: 46,
                            lineHeight: 1.12,
                            letterSpacing: '-0.015em',
                          },
                          children: [
                            { type: 'div', props: { children: 'Your cameras see everything.' } },
                            {
                              type: 'div',
                              props: {
                                style: { fontFamily: 'Instrument Serif Italic', fontStyle: 'italic', color: '#f4eee3' },
                                children: 'Now they understand it.',
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: 'rgba(244,238,227,0.62)',
                            fontFamily: 'Geist',
                            fontSize: 20,
                            lineHeight: 1.35,
                          },
                          children: 'On-premise AI for industrial safety',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Instrument Serif', data: readFileSync(serifPath), weight: 400, style: 'normal' },
        { name: 'Instrument Serif Italic', data: readFileSync(serifItalicPath), weight: 400, style: 'italic' },
        { name: 'Geist', data: readFileSync(geistPath), weight: 400, style: 'normal' },
        { name: 'NeoWave', data: wordmarkFont, weight: 400, style: 'normal' },
      ],
    },
  );

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outPath, buffer);
  console.log(`Wrote ${outPath} (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
