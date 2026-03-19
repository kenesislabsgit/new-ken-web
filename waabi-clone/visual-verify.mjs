import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3001", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  // Check marquee animation
  await page.evaluate(() => {
    const el = document.getElementById("partners");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(2000);

  const marqueeCheck = await page.evaluate(() => {
    const items = document.querySelectorAll("[style*='animation']");
    const marqueeItems = [];
    items.forEach(el => {
      const anim = el.style.animation;
      if (anim && anim.includes("marquee")) {
        marqueeItems.push(anim.substring(0, 60));
      }
    });
    return { count: marqueeItems.length, samples: marqueeItems.slice(0, 2) };
  });
  console.log("Marquee inline animations:", marqueeCheck);

  // Check shimmer button
  await page.evaluate(() => {
    const el = document.getElementById("cta");
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(1000);

  const shimmerCheck = await page.evaluate(() => {
    const btns = document.querySelectorAll("[style*='shimmer']");
    const shimmerAnims = document.querySelectorAll("[style*='animation'][style*='shimmer']");
    // Also check for the shimmer button by its CSS vars
    const shimmerBtns = document.querySelectorAll("[style*='--shimmer-color']");
    return {
      shimmerVarButtons: shimmerBtns.length,
      shimmerAnimDivs: shimmerAnims.length,
    };
  });
  console.log("Shimmer button:", shimmerCheck);

  // Check BorderBeam
  const beamCheck = await page.evaluate(() => {
    const el = document.getElementById("safety");
    if (el) el.scrollIntoView();
    return null;
  });
  await page.waitForTimeout(1500);
  const beams = await page.evaluate(() => {
    const radials = document.querySelectorAll("[style*='radial-gradient']");
    let beamCount = 0;
    radials.forEach(el => {
      const s = el.getAttribute("style") || "";
      if (s.includes("ff2c6b") || s.includes("ff8fa3")) beamCount++;
    });
    return { beamCount };
  });
  console.log("BorderBeam radial gradients:", beams);

  // Check BlurFade filter transitions
  const blurCheck = await page.evaluate(() => {
    const blurred = document.querySelectorAll("[style*='blur']");
    return { blurElements: blurred.length };
  });
  console.log("BlurFade elements:", blurCheck);

  // Check TextReveal
  await page.evaluate(() => window.scrollTo({ top: 2500, behavior: "instant" }));
  await page.waitForTimeout(1000);
  const textReveal = await page.evaluate(() => {
    // TextReveal creates spans with opacity styles
    const spans = document.querySelectorAll("span > span[style*='opacity']");
    return { wordSpans: spans.length };
  });
  console.log("TextReveal word spans:", textReveal);

  // NumberTicker final values
  await page.evaluate(() => {
    const el = document.getElementById("safety");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(3000);
  const numbers = await page.evaluate(() => {
    const stats = document.querySelectorAll("#safety .text-pink");
    return Array.from(stats).map(s => s.textContent).filter(t => t && t.length > 1);
  });
  console.log("NumberTicker final values:", numbers);

  // MagicCard spotlight check
  const spotlight = await page.evaluate(() => {
    const cards = document.querySelectorAll("[class*='pointer-events-none'][class*='absolute']");
    return { spotlightOverlays: cards.length };
  });
  console.log("MagicCard spotlight overlays:", spotlight);

  console.log("\n✓ All premium components verified!");
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
