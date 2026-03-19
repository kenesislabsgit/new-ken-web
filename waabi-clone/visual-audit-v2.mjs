import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Get sections
  const sections = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('section, nav, footer').forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      results.push({
        tag: el.tagName,
        id: el.id,
        className: el.className?.toString().substring(0, 80),
        top: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
        width: Math.round(rect.width),
      });
    });
    return results;
  });
  console.log('=== SECTIONS ===');
  console.log(JSON.stringify(sections, null, 2));

  // Get visual issues
  const issues = await page.evaluate(() => {
    const problems = [];
    // Overflow
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth + 5) {
        const cls = el.className?.toString().split(' ')[0] || '';
        problems.push({ type: 'overflow', el: el.tagName + '.' + cls, by: Math.round(rect.right - window.innerWidth) });
      }
    });
    // Tiny text
    document.querySelectorAll('p, span, a, li, h1, h2, h3, h4, h5, h6, button').forEach(el => {
      const fs = parseFloat(window.getComputedStyle(el).fontSize);
      if (fs < 12 && el.textContent.trim().length > 0 && el.offsetHeight > 0) {
        problems.push({ type: 'tiny-text', el: el.tagName, fs: fs + 'px', text: el.textContent.trim().substring(0, 40) });
      }
    });
    // Broken images
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete || img.naturalWidth === 0) problems.push({ type: 'broken-img', src: img.src });
      if (!img.alt) problems.push({ type: 'no-alt', src: img.src?.substring(0, 60) });
    });
    // Buttons with cursor:default
    document.querySelectorAll('button, a[role="button"]').forEach(el => {
      const cursor = window.getComputedStyle(el).cursor;
      if (cursor === 'default') problems.push({ type: 'no-pointer', el: el.tagName, text: el.textContent.trim().substring(0, 30) });
    });
    return problems;
  });
  console.log('=== VISUAL ISSUES ===');
  console.log(JSON.stringify(issues, null, 2));

  // Check font sizes used
  const fontSizes = await page.evaluate(() => {
    const sizes = new Map();
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, li').forEach(el => {
      if (el.offsetHeight === 0) return;
      const fs = window.getComputedStyle(el).fontSize;
      const tag = el.tagName;
      const key = tag + ':' + fs;
      if (!sizes.has(key)) sizes.set(key, { tag, fontSize: fs, count: 0, sample: el.textContent.trim().substring(0, 40) });
      sizes.get(key).count++;
    });
    return [...sizes.values()].sort((a, b) => parseFloat(a.fontSize) - parseFloat(b.fontSize));
  });
  console.log('=== FONT SIZES ===');
  console.log(JSON.stringify(fontSizes, null, 2));

  // Check colors used
  const colors = await page.evaluate(() => {
    const colorMap = new Map();
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a').forEach(el => {
      if (el.offsetHeight === 0) return;
      const c = window.getComputedStyle(el).color;
      if (!colorMap.has(c)) colorMap.set(c, { color: c, count: 0, sample: el.tagName + ': ' + el.textContent.trim().substring(0, 30) });
      colorMap.get(c).count++;
    });
    return [...colorMap.values()].sort((a, b) => b.count - a.count);
  });
  console.log('=== TEXT COLORS ===');
  console.log(JSON.stringify(colors, null, 2));

  // Check background colors
  const bgColors = await page.evaluate(() => {
    const bgMap = new Map();
    document.querySelectorAll('section, nav, footer, div').forEach(el => {
      const bg = window.getComputedStyle(el).backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)' && !bgMap.has(bg)) {
        bgMap.set(bg, { bg, el: el.tagName + (el.id ? '#' + el.id : ''), cls: el.className?.toString().substring(0, 50) });
      }
    });
    return [...bgMap.values()];
  });
  console.log('=== BG COLORS ===');
  console.log(JSON.stringify(bgColors, null, 2));

  await browser.close();
})();
