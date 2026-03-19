import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = './screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Full page screenshot
  console.log('Taking full-page screenshot...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-full-page.png'), fullPage: true });

  // 2. Top of page (viewport)
  console.log('Taking top viewport screenshot...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-top.png') });

  // 3. Scroll positions
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 900;
  const positions = [
    { name: '25pct', pct: 0.25 },
    { name: '50pct', pct: 0.50 },
    { name: '75pct', pct: 0.75 },
    { name: 'bottom', pct: 1.0 },
  ];

  for (const pos of positions) {
    const scrollY = Math.min((totalHeight - viewportHeight) * pos.pct, totalHeight - viewportHeight);
    console.log(`Scrolling to ${pos.name} (${Math.round(scrollY)}px)...`);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), scrollY);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `03-${pos.name}.png`) });
  }

  // 4. Get all sections info
  console.log('Analyzing page structure...');
  const sections = await page.evaluate(() => {
    const results = [];
    // Check all major sections
    const allElements = document.querySelectorAll('section, nav, footer, header, [class*="section"]');
    allElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      results.push({
        tag: el.tagName,
        id: el.id,
        className: el.className?.toString().substring(0, 100),
        top: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
        width: Math.round(rect.width),
        overflow: styles.overflow,
        position: styles.position,
      });
    });
    return results;
  });
  console.log('Sections found:', JSON.stringify(sections, null, 2));

  // 5. Check for visual issues
  console.log('Checking for visual issues...');
  const issues = await page.evaluate(() => {
    const problems = [];

    // Check for overflow issues
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth + 5) {
        problems.push({
          type: 'horizontal-overflow',
          element: el.tagName + (el.className ? '.' + el.className.toString().split(' ')[0] : ''),
          overflowBy: Math.round(rect.right - window.innerWidth) + 'px',
        });
      }
    });

    // Check for tiny text
    document.querySelectorAll('p, span, a, li, h1, h2, h3, h4, h5, h6, button').forEach(el => {
      const styles = window.getComputedStyle(el);
      const fontSize = parseFloat(styles.fontSize);
      if (fontSize < 12 && el.textContent.trim().length > 0 && el.offsetHeight > 0) {
        problems.push({
          type: 'tiny-text',
          element: el.tagName + (el.className ? '.' + el.className.toString().split(' ')[0] : ''),
          fontSize: fontSize + 'px',
          text: el.textContent.trim().substring(0, 50),
        });
      }
    });

    // Check for images
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete || img.naturalWidth === 0) {
        problems.push({
          type: 'broken-image',
          src: img.src,
          alt: img.alt,
        });
      }
      if (!img.alt) {
        problems.push({
          type: 'missing-alt',
          src: img.src,
        });
      }
    });

    // Check contrast on text elements
    document.querySelectorAll('p, span, a, h1, h2, h3, h4, h5, h6').forEach(el => {
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const bg = styles.backgroundColor;
      if (color === bg && el.textContent.trim().length > 0 && el.offsetHeight > 0) {
        problems.push({
          type: 'invisible-text',
          element: el.tagName,
          color: color,
          text: el.textContent.trim().substring(0, 50),
        });
      }
    });

    return problems;
  });
  console.log('Visual issues found:', JSON.stringify(issues, null, 2));

  // 6. Screenshot each major section individually
  console.log('Taking individual section screenshots...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Try to find and screenshot named sections
  const sectionSelectors = [
    { name: 'navbar', selector: 'nav' },
    { name: 'hero', selector: 'section:first-of-type, [class*="hero"], [class*="Hero"]' },
    { name: 'partners', selector: '[class*="partner"], [class*="Partner"]' },
    { name: 'technology', selector: '[class*="technology"], [class*="Technology"]' },
    { name: 'platform', selector: '[class*="platform"], [class*="Platform"]' },
    { name: 'safety', selector: '[class*="safety"], [class*="Safety"]' },
    { name: 'scale', selector: '[class*="scale"], [class*="Scale"]' },
    { name: 'insights', selector: '[class*="insight"], [class*="Insight"]' },
    { name: 'cta', selector: '[class*="cta"], [class*="CTA"]' },
    { name: 'footer', selector: 'footer' },
  ];

  for (const sec of sectionSelectors) {
    try {
      const el = await page.$(sec.selector);
      if (el) {
        const box = await el.boundingBox();
        if (box) {
          await page.evaluate((y) => window.scrollTo(0, y - 50), box.y);
          await page.waitForTimeout(800);
          await el.screenshot({ path: path.join(SCREENSHOTS_DIR, `section-${sec.name}.png`) });
          console.log(`Captured section: ${sec.name} (${Math.round(box.height)}px tall)`);
        }
      } else {
        console.log(`Section not found: ${sec.name}`);
      }
    } catch (e) {
      console.log(`Error capturing ${sec.name}: ${e.message}`);
    }
  }

  // 7. Check animations/transitions
  console.log('Checking for CSS animations and transitions...');
  const animationInfo = await page.evaluate(() => {
    const animated = [];
    document.querySelectorAll('*').forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.animation && styles.animation !== 'none') {
        animated.push({
          element: el.tagName + (el.className ? '.' + el.className.toString().split(' ')[0] : ''),
          animation: styles.animation.substring(0, 100),
        });
      }
      if (styles.transition && styles.transition !== 'all 0s ease 0s') {
        animated.push({
          element: el.tagName + (el.className ? '.' + el.className.toString().split(' ')[0] : ''),
          transition: styles.transition.substring(0, 100),
        });
      }
    });
    return animated;
  });
  console.log('Animations/transitions:', JSON.stringify(animationInfo, null, 2));

  // 8. Check hover states on buttons/links
  console.log('Checking interactive elements...');
  const interactiveElements = await page.evaluate(() => {
    const elements = [];
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      const styles = window.getComputedStyle(el);
      elements.push({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 40),
        cursor: styles.cursor,
        hasHref: el.hasAttribute('href'),
        href: el.getAttribute('href'),
      });
    });
    return elements;
  });
  console.log('Interactive elements:', JSON.stringify(interactiveElements, null, 2));

  // 9. Check spacing and layout consistency
  console.log('Checking spacing consistency...');
  const spacingInfo = await page.evaluate(() => {
    const sectionGaps = [];
    const sections = document.querySelectorAll('section');
    let prevBottom = 0;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if (i > 0) {
        sectionGaps.push({
          between: `section ${i} and ${i+1}`,
          gap: Math.round(top - prevBottom),
        });
      }
      prevBottom = rect.bottom + window.scrollY;
      sectionGaps.push({
        section: i + 1,
        paddingTop: window.getComputedStyle(sec).paddingTop,
        paddingBottom: window.getComputedStyle(sec).paddingBottom,
        height: Math.round(rect.height),
      });
    });
    return sectionGaps;
  });
  console.log('Spacing info:', JSON.stringify(spacingInfo, null, 2));

  await browser.close();
  console.log('\nAudit complete! Screenshots saved to ./screenshots/');
})();
