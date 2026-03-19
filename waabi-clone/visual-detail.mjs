import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3001", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log("=== PREMIUM COMPONENT VERIFICATION ===\n");

  // 1. BlurFade - check filter blur transitions
  await page.evaluate(() => window.scrollTo({ top: 5000, behavior: "instant" }));
  await page.waitForTimeout(1500);
  const blurFade = await page.evaluate(() => {
    const els = document.querySelectorAll("[style*='filter']");
    return { count: els.length, sample: els[0]?.getAttribute("style")?.substring(0, 80) };
  });
  console.log("BlurFade elements:", blurFade);

  // 2. NumberTicker - check animated numbers
  await page.evaluate(() => {
    const el = document.querySelector("#safety");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(2000);
  const numberTicker = await page.evaluate(() => {
    const stats = document.querySelectorAll("#safety span[class*='text-pink']");
    const values = [];
    stats.forEach(s => { if (s.textContent && s.textContent.length > 0) values.push(s.textContent); });
    return values;
  });
  console.log("NumberTicker values:", numberTicker);

  // 3. Marquee - check CSS animation
  await page.evaluate(() => {
    const el = document.getElementById("partners");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1500);
  const marquee = await page.evaluate(() => {
    const items = document.querySelectorAll(".animate-marquee");
    if (items.length === 0) return { found: false };
    const style = window.getComputedStyle(items[0]);
    return {
      found: true,
      count: items.length,
      animationName: style.animationName,
      animationDuration: style.animationDuration,
    };
  });
  console.log("Marquee:", marquee);

  // 4. MagicCard spotlight
  const magicCard = await page.evaluate(() => {
    const cards = document.querySelectorAll("[class*='overflow-hidden'][class*='rounded-']");
    return { count: cards.length };
  });
  console.log("MagicCard containers:", magicCard);

  // 5. ShimmerButton
  const shimmer = await page.evaluate(() => {
    const btns = document.querySelectorAll("[class*='shimmer']");
    return { count: btns.length };
  });
  console.log("ShimmerButton:", shimmer);

  // 6. BorderBeam
  const borderBeam = await page.evaluate(() => {
    const beams = document.querySelectorAll("[class*='border-beam']");
    return { count: beams.length };
  });
  console.log("BorderBeam:", borderBeam);

  // 7. TextReveal scroll-linked
  await page.evaluate(() => window.scrollTo({ top: 2500, behavior: "instant" }));
  await page.waitForTimeout(1000);
  const textReveal = await page.evaluate(() => {
    const words = document.querySelectorAll("span[style*='opacity']");
    let revealed = 0, hidden = 0;
    words.forEach(w => {
      const op = parseFloat(w.style.opacity);
      if (op > 0.5) revealed++;
      else hidden++;
    });
    return { revealed, hidden, total: revealed + hidden };
  });
  console.log("TextReveal words:", textReveal);

  // 8. Overall animation count
  const overall = await page.evaluate(() => {
    return {
      motionElements: document.querySelectorAll("[style*='transform']").length,
      opacityElements: document.querySelectorAll("[style*='opacity']").length,
      filterElements: document.querySelectorAll("[style*='filter']").length,
    };
  });
  console.log("\nOverall animation elements:", overall);

  console.log("\n=== VERIFICATION COMPLETE ===");
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
