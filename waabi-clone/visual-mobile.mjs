import { chromium } from "playwright";

const URL = "http://localhost:3001";
const OUT = "./screenshots-check";

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // Mobile viewport
  const ctx = await browser.newContext({ 
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: `${OUT}/mobile-01-hero.png`, fullPage: false });
  console.log("✓ Mobile hero");

  const scrollPositions = [
    { name: "mobile-02-parallax", y: 2500 },
    { name: "mobile-03-platform", y: 5000 },
    { name: "mobile-04-safety", y: 10000 },
    { name: "mobile-05-partners", y: 13000 },
    { name: "mobile-06-footer", y: 18000 },
  ];

  for (const s of scrollPositions) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: false });
    console.log(`✓ ${s.name}`);
  }

  // Check mobile-specific issues
  const mobileChecks = await page.evaluate(() => {
    const results = {};
    
    // Check for horizontal overflow
    results.hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
    results.pageWidth = document.documentElement.scrollWidth;
    results.viewportWidth = window.innerWidth;
    
    // Check hamburger menu exists
    const menuBtn = document.querySelector("button[aria-label='Menu']");
    results.hamburgerMenu = !!menuBtn;
    
    // Check parallax columns visible
    const mobileCols = document.querySelectorAll(".flex.md\\:hidden");
    results.mobileParallaxColumns = mobileCols.length;
    
    return results;
  });
  
  console.log("\n=== MOBILE AUDIT ===");
  console.log(JSON.stringify(mobileChecks, null, 2));

  await browser.close();
  console.log("\n✓ Mobile audit complete!");
}

run().catch((e) => { console.error(e); process.exit(1); });
