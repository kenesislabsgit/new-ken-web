import { chromium } from 'playwright';

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
await p.waitForTimeout(3000);

// Get page height and scroll through taking screenshots at key points
const height = await p.evaluate(() => document.body.scrollHeight);
console.log('Page height:', height);

// Take screenshots at specific scroll positions around the problem areas
const positions = [
  { y: Math.floor(height * 0.7), name: 'partners-area' },
  { y: Math.floor(height * 0.75), name: 'before-edge-text' },
  { y: Math.floor(height * 0.8), name: 'edge-text' },
  { y: Math.floor(height * 0.85), name: 'after-edge-text' },
  { y: Math.floor(height * 0.9), name: 'careers-area' },
];

for (const pos of positions) {
  await p.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), pos.y);
  await p.waitForTimeout(300);
  await p.screenshot({ path: `screenshots-audit-v4/gap-${pos.name}.png` });
  console.log(`${pos.name} at ${pos.y}px`);
}

await b.close();
console.log('Done');
