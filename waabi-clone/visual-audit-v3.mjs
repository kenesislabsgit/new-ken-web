import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Check if horizontal scrollbar exists
  const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log('Has horizontal scrollbar:', hasHScroll);

  // Check navbar progress bar animation
  const navProgress = await page.evaluate(() => {
    const bar = document.querySelector('.scale-x-0');
    return bar ? { found: true, transform: window.getComputedStyle(bar).transform } : { found: false };
  });
  console.log('Navbar progress bar:', JSON.stringify(navProgress));

  // Check scroll-down button size
  const scrollBtn = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Scroll Down"]');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return { width: rect.width, height: rect.height, visible: rect.width > 0 };
  });
  console.log('Scroll down button:', JSON.stringify(scrollBtn));

  // Check hamburger button visibility on desktop
  const hamburger = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Menu"]');
    if (!btn) return null;
    const styles = window.getComputedStyle(btn);
    return { display: styles.display, visible: btn.offsetHeight > 0 };
  });
  console.log('Hamburger on desktop:', JSON.stringify(hamburger));

  // Check Insights cards overflow
  const insightsOverflow = await page.evaluate(() => {
    const section = document.getElementById('insights');
    if (!section) return null;
    const rect = section.getBoundingClientRect();
    const cards = section.querySelector('.w-max');
    if (!cards) return { sectionWidth: rect.width, noCards: true };
    const cardsRect = cards.getBoundingClientRect();
    return {
      sectionWidth: Math.round(rect.width),
      cardsWidth: Math.round(cardsRect.width),
      cardsRight: Math.round(cardsRect.right),
      viewportWidth: window.innerWidth,
      overflows: cardsRect.right > window.innerWidth,
    };
  });
  console.log('Insights overflow:', JSON.stringify(insightsOverflow));

  // Check Partners marquee
  const marquee = await page.evaluate(() => {
    const section = document.getElementById('partners');
    if (!section) return null;
    const marqueeDiv = section.querySelector('.w-max');
    if (!marqueeDiv) return { noMarquee: true };
    const rect = marqueeDiv.getBoundingClientRect();
    return { width: Math.round(rect.width), overflows: rect.right > window.innerWidth };
  });
  console.log('Partners marquee:', JSON.stringify(marquee));

  // Check all images loading status
  const imgStatus = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src.substring(0, 80),
      loaded: img.complete && img.naturalWidth > 0,
      width: img.naturalWidth,
      height: img.naturalHeight,
      displayed: img.offsetHeight > 0,
    }));
  });
  console.log('Image status:', JSON.stringify(imgStatus, null, 2));

  // Check video loading
  const videoStatus = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('video')).map(v => ({
      readyState: v.readyState,
      paused: v.paused,
      poster: v.poster?.substring(0, 60),
      hasSource: v.querySelectorAll('source').length,
    }));
  });
  console.log('Video status:', JSON.stringify(videoStatus));

  // Check rem-based sizes that might be too small
  const remIssues = await page.evaluate(() => {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return { rootFontSize, note: rootFontSize < 16 ? 'ROOT FONT SIZE IS SMALLER THAN DEFAULT 16px' : 'OK' };
  });
  console.log('Root font size:', JSON.stringify(remIssues));

  await browser.close();
})();
