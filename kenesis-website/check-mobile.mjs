import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const DIR = 'screenshots-mobile';
mkdirSync(DIR, { recursive: true });

const viewports = [
  { name: 'iphone-se', w: 375, h: 667 },
  { name: 'iphone-14', w: 390, h: 844 },
  { name: 'ipad', w: 768, h: 1024 },
  { name: 'ipad-pro', w: 1024, h: 1366 },
];

const pages = ['/', '/solutions', '/platform', '/about', '/contact'];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    for (const route of pages) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      await page.goto(`http://localhost:3001${route}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(2000);

      // Check for horizontal overflow
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

      const name = route === '/' ? 'home' : route.slice(1);
      await page.screenshot({ path: `${DIR}/${vp.name}-${name}.png` });

      if (overflow) console.log(`⚠ OVERFLOW: ${vp.name} ${route}`);
      else console.log(`✓ ${vp.name} ${route}`);

      await page.close();
    }
  }

  await browser.close();
  console.log('Done');
})();
