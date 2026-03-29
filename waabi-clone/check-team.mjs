import { chromium } from 'playwright';

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3001/about', { waitUntil: 'networkidle', timeout: 15000 });
await p.waitForTimeout(3000);

// Scroll to team section
await p.evaluate(() => {
  const card = document.querySelector('.team-card');
  if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await p.waitForTimeout(1000);
await p.screenshot({ path: 'screenshots-audit-v4/team-default.png' });

// Hover first card
const card = await p.locator('.team-card').first();
await card.hover();
await p.waitForTimeout(800);
await p.screenshot({ path: 'screenshots-audit-v4/team-hover.png' });

console.log('Done — check screenshots-audit-v4/team-*.png');
await b.close();
