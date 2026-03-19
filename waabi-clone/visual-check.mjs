import { chromium } from "playwright";

const URL = "http://localhost:3001";
const OUT = "./screenshots-check";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);

  // Create output dir
  const fs = await import("fs");
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  // Screenshot top (hero)
  await page.screenshot({ path: `${OUT}/01-hero.png`, fullPage: false });
  console.log("✓ Hero screenshot");

  // Scroll through page and take screenshots at key sections
  const sections = [
    { name: "02-parallax", scroll: 2500 },
    { name: "03-platform", scroll: 5000 },
    { name: "04-scale", scroll: 7000 },
    { name: "05-technology", scroll: 9000 },
    { name: "06-safety", scroll: 12000 },
    { name: "07-partners", scroll: 15000 },
    { name: "08-insights", scroll: 18000 },
    { name: "09-cta", scroll: 20000 },
    { name: "10-footer", scroll: 22000 },
  ];

  for (const s of sections) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.scroll);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: false });
    console.log(`✓ ${s.name} screenshot`);
  }

  // Full page screenshot
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/11-fullpage.png`, fullPage: true });
  console.log("✓ Full page screenshot");

  // Check for animation elements
  const checks = await page.evaluate(() => {
    const results = {};
    
    // Check navbar exists and is visible
    const nav = document.querySelector("header");
    results.navbar = nav ? { visible: true, rect: nav.getBoundingClientRect() } : { visible: false };

    // Check scroll progress bar
    const progressBar = document.querySelector("header [class*='bg-pink']");
    results.progressBar = !!progressBar;

    // Check hero video
    const video = document.querySelector("video");
    results.heroVideo = video ? { playing: !video.paused, src: video.currentSrc?.substring(0, 50) } : null;

    // Check FadeIn elements (motion divs)
    const motionDivs = document.querySelectorAll("[style*='opacity']");
    results.animatedElements = motionDivs.length;

    // Check partner marquee
    const marquee = document.querySelector("[data-set]");
    results.marquee = !!marquee;

    // Check insights drag area
    const dragArea = document.querySelector("[style*='cursor']");
    results.insightsDrag = !!dragArea;

    // Check all sections exist
    const sectionIds = ["safety", "technology", "insights", "partners", "cta"];
    results.sections = {};
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      results.sections[id] = !!el;
    }

    // Check text contrast - find low opacity text
    const allText = document.querySelectorAll("p, span, h1, h2, h3, h4, a");
    const lowContrast = [];
    allText.forEach((el) => {
      const style = window.getComputedStyle(el);
      const opacity = parseFloat(style.opacity);
      if (opacity < 0.4 && opacity > 0) {
        lowContrast.push({
          tag: el.tagName,
          text: el.textContent?.substring(0, 30),
          opacity,
        });
      }
    });
    results.lowContrastElements = lowContrast.length;

    return results;
  });

  console.log("\n=== VISUAL AUDIT RESULTS ===");
  console.log(JSON.stringify(checks, null, 2));

  // Scroll animation test - scroll down and check elements animate
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  
  // Slowly scroll and check animations trigger
  for (let y = 0; y <= 5000; y += 500) {
    await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: "instant" }), y);
    await page.waitForTimeout(200);
  }
  
  const afterScroll = await page.evaluate(() => {
    const animated = document.querySelectorAll("[style*='transform']");
    return { animatedAfterScroll: animated.length };
  });
  console.log("\nAfter scroll animation check:", JSON.stringify(afterScroll));

  await browser.close();
  console.log("\n✓ Visual audit complete!");
}

run().catch((e) => { console.error(e); process.exit(1); });
