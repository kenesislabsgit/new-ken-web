import { chromium } from "playwright";

const URL = "http://localhost:3001";
const OUT = "./screenshots-check";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2500);

  console.log("=== SCROLL ANIMATION VERIFICATION ===\n");

  // 1. Hero parallax zoom
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
  await page.waitForTimeout(500);
  const heroCheck = await page.evaluate(() => {
    const video = document.querySelector("video")?.parentElement;
    const style = video ? window.getComputedStyle(video) : null;
    return { transform: style?.transform, opacity: style?.opacity };
  });
  console.log("Hero video parallax at scroll 600:", heroCheck);

  // 2. Navbar progress bar width
  await page.evaluate(() => window.scrollTo({ top: 5000, behavior: "instant" }));
  await page.waitForTimeout(500);
  const navCheck = await page.evaluate(() => {
    const bar = document.querySelector("header .bg-pink");
    if (!bar) return { found: false };
    const style = window.getComputedStyle(bar);
    return { width: style.width, found: true };
  });
  console.log("Navbar progress bar at scroll 5000:", navCheck);

  // 3. Scale section animated line
  await page.evaluate(() => {
    const el = document.querySelector("#safety");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/anim-safety-visible.png`, fullPage: false });
  
  // 4. CTA scale-up animation
  await page.evaluate(() => {
    const el = document.getElementById("cta");
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(800);
  const ctaCheck = await page.evaluate(() => {
    const cta = document.querySelector("#cta > div");
    if (!cta) return { found: false };
    const style = window.getComputedStyle(cta);
    return { transform: style.transform, borderRadius: style.borderRadius, opacity: style.opacity };
  });
  console.log("CTA section animation:", ctaCheck);
  await page.screenshot({ path: `${OUT}/anim-cta-visible.png`, fullPage: false });

  // 5. FadeIn elements - check they've animated in after scrolling
  await page.evaluate(() => window.scrollTo({ top: 5000, behavior: "instant" }));
  await page.waitForTimeout(1000);
  const fadeInCheck = await page.evaluate(() => {
    const allMotion = document.querySelectorAll("[style]");
    let visible = 0;
    let hidden = 0;
    allMotion.forEach((el) => {
      const s = el.getAttribute("style") || "";
      if (s.includes("opacity: 1")) visible++;
      if (s.includes("opacity: 0")) hidden++;
    });
    return { visibleElements: visible, hiddenElements: hidden };
  });
  console.log("FadeIn state at scroll 5000:", fadeInCheck);

  // 6. Partners marquee animation
  await page.evaluate(() => {
    const el = document.getElementById("partners");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/anim-partners-marquee.png`, fullPage: false });
  
  const marqueeCheck = await page.evaluate(() => {
    const marqueeContainer = document.querySelector("[data-set]")?.parentElement;
    if (!marqueeContainer) return { found: false };
    const style = window.getComputedStyle(marqueeContainer);
    return { transform: style.transform, found: true };
  });
  console.log("Marquee animation:", marqueeCheck);

  // 7. Technology cards parallax
  await page.evaluate(() => {
    const el = document.getElementById("technology");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/anim-technology.png`, fullPage: false });

  // 8. Word reveal check
  const wordRevealCheck = await page.evaluate(() => {
    const words = document.querySelectorAll("span[style*='transform']");
    return { wordRevealElements: words.length };
  });
  console.log("Word reveal animated spans:", wordRevealCheck);

  console.log("\n=== ALL ANIMATION CHECKS COMPLETE ===");
  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
