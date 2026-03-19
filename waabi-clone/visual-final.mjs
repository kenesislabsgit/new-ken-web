import { chromium } from "playwright";

const URL = "http://localhost:3001";
const OUT = "./screenshots-final";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const fs = await import("fs");
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  // Screenshot hero
  await page.screenshot({ path: `${OUT}/01-hero.png` });
  console.log("✓ Hero");

  const sections = [
    { name: "02-parallax", scroll: 2500 },
    { name: "03-platform", scroll: 5000 },
    { name: "04-scale", scroll: 7500 },
    { name: "05-technology", scroll: 10000 },
    { name: "06-safety", scroll: 13000 },
    { name: "07-partners", scroll: 16000 },
    { name: "08-insights", scroll: 19000 },
    { name: "09-cta", scroll: 21000 },
    { name: "10-footer", scroll: 23000 },
  ];

  for (const s of sections) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.scroll);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/${s.name}.png` });
    console.log(`✓ ${s.name}`);
  }

  // Comprehensive checks
  const checks = await page.evaluate(() => {
    const r = {};
    // Navbar
    const nav = document.querySelector("header");
    r.navbar = nav ? { visible: true } : { visible: false };
    const progressBar = document.querySelector("header .bg-pink");
    r.progressBar = !!progressBar;
    // Video
    const video = document.querySelector("video");
    r.heroVideo = video ? { playing: !video.paused } : null;
    // Sections
    const ids = ["safety", "technology", "insights", "partners", "cta"];
    r.sections = {};
    ids.forEach(id => { r.sections[id] = !!document.getElementById(id); });
    // Animated elements
    r.animatedElements = document.querySelectorAll("[style*='opacity']").length;
    r.transformElements = document.querySelectorAll("[style*='transform']").length;
    // Marquee (Magic UI style)
    const marqueeItems = document.querySelectorAll(".animate-marquee");
    r.marqueeItems = marqueeItems.length;
    // MagicCard spotlight divs
    r.magicCards = document.querySelectorAll("[class*='overflow-hidden'][class*='rounded']").length;
    // Shimmer button
    r.shimmerButtons = document.querySelectorAll("[class*='shimmer']").length;
    // Low contrast check
    const allText = document.querySelectorAll("p, span, h1, h2, h3, h4, a");
    let lowContrast = 0;
    allText.forEach(el => {
      const opacity = parseFloat(window.getComputedStyle(el).opacity);
      if (opacity < 0.4 && opacity > 0) lowContrast++;
    });
    r.lowContrastElements = lowContrast;
    return r;
  });

  console.log("\n=== FINAL VISUAL AUDIT ===");
  console.log(JSON.stringify(checks, null, 2));

  // Full page
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/11-fullpage.png`, fullPage: true });
  console.log("✓ Full page");

  await browser.close();
  console.log("\n✓ Final audit complete!");
}

run().catch(e => { console.error(e); process.exit(1); });
