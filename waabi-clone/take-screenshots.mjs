import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3099';
const OUT = 'screenshots-docs';

mkdirSync(OUT, { recursive: true });

const sections = [
  // Home page sections — scroll to each
  { name: '01-navbar', url: '/', scroll: 0, clip: { x: 0, y: 0, width: 1440, height: 120 } },
  { name: '02-hero', url: '/', scroll: 0 },
  { name: '03-pinned-feature-tabs', url: '/', scroll: 1800 },
  { name: '04-wave-performance', url: '/', scroll: 4500 },
  { name: '05-tech-cards-banner', url: '/', scroll: 5600 },
  { name: '06-tech-cards-grid', url: '/', scroll: 6600 },
  { name: '07-split-content', url: '/', scroll: 7400 },
  { name: '08-partner-logos', url: '/', scroll: 8200 },
  { name: '09-insights-grid', url: '/', scroll: 9000 },
  { name: '10-careers-cta', url: '/', scroll: 9800 },
  { name: '11-footer', url: '/', scroll: 11000 },
  // Sub pages
  { name: '12-technology', url: '/technology', scroll: 0 },
  { name: '13-expertises-ai', url: '/expertises/ai-workloads', scroll: 0 },
  { name: '14-expertises-grid', url: '/expertises/grid-volatility', scroll: 0 },
  { name: '15-expertises-power', url: '/expertises/power-quality', scroll: 0 },
  { name: '16-team', url: '/team', scroll: 0 },
  { name: '17-contact', url: '/contact', scroll: 0 },
  { name: '18-financing', url: '/financing', scroll: 0 },
  { name: '19-news', url: '/news', scroll: 0 },
  { name: '20-privacy-policy', url: '/privacy-policy', scroll: 0 },
  { name: '21-terms-of-use', url: '/terms-of-use', scroll: 0 },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  let lastUrl = '';
  for (const s of sections) {
    const fullUrl = BASE + s.url;
    if (fullUrl !== lastUrl) {
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(2000);
      lastUrl = fullUrl;
    }
    if (s.scroll > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), s.scroll);
      await page.waitForTimeout(800);
    }
    const opts = { path: `${OUT}/${s.name}.png` };
    if (s.clip) opts.clip = s.clip;
    await page.screenshot(opts);
    console.log(`✓ ${s.name}`);
  }

  await browser.close();
  console.log('Done!');
})();
