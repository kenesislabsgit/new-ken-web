import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3001';
const DIR = 'screenshots-audit-v4';
mkdirSync(DIR, { recursive: true });

const pages = [
  { path: '/', name: 'home' },
  { path: '/solutions', name: 'solutions' },
  { path: '/platform', name: 'platform' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  for (const pg of pages) {
    const page = await ctx.newPage();
    console.log(`→ ${pg.name}: ${pg.path}`);
    await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // let animations settle

    // Top of page
    await page.screenshot({ path: `${DIR}/${pg.name}-01-top.png` });

    // Scroll through page taking screenshots
    const height = await page.evaluate(() => document.body.scrollHeight);
    const viewport = 900;
    let scrollY = 0;
    let idx = 2;

    while (scrollY < height - viewport) {
      scrollY += viewport * 0.8;
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${DIR}/${pg.name}-${String(idx).padStart(2, '0')}-${scrollY}px.png` });
      idx++;
      if (idx > 20) break; // safety limit
    }

    // Full page
    await page.screenshot({ path: `${DIR}/${pg.name}-full.png`, fullPage: true });
    await page.close();
  }

  await browser.close();
  console.log('✓ Audit complete');
})();
