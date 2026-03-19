import { chromium } from "playwright";
import { mkdirSync } from "fs";

const SCREENSHOTS_DIR = "./screenshots-audit";
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log("=== WAABI CLONE VISUAL AUDIT ===\n");

  // Navigate
  console.log("1. Navigating to http://localhost:3001...");
  await page.goto("http://localhost:3001", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000); // Let animations settle

  // Screenshot 1: Hero section (top of page)
  console.log("\n--- SCREENSHOT 1: Hero Section (top of page) ---");
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-hero-top.png`, fullPage: false });
  
  // Check navbar
  const navbar = await page.$("header");
  if (navbar) {
    const navBox = await navbar.boundingBox();
    console.log(`  Navbar found: width=${navBox?.width}px, height=${navBox?.height}px, x=${navBox?.x}px`);
    
    // Check max-width class
    const navMaxWidth = await page.evaluate(() => {
      const header = document.querySelector("header");
      if (!header) return "not found";
      const computed = getComputedStyle(header);
      return { maxWidth: computed.maxWidth, width: computed.width };
    });
    console.log(`  Navbar max-width: ${JSON.stringify(navMaxWidth)}`);
  }

  // Check scroll progress bar
  const progressBar = await page.evaluate(() => {
    const bars = document.querySelectorAll("[class*='bg-pink']");
    let found = false;
    bars.forEach(b => {
      if (b.closest("header")) found = true;
    });
    return found;
  });
  console.log(`  Scroll progress bar in navbar: ${progressBar}`);

  // Check hero text
  const heroText = await page.evaluate(() => {
    const texts = [];
    document.querySelectorAll("h1, [class*='text-[2.4rem]'], [class*='text-[4rem]']").forEach(el => {
      texts.push({ tag: el.tagName, text: el.textContent?.trim().substring(0, 60), visible: el.offsetHeight > 0 });
    });
    return texts;
  });
  console.log(`  Hero text elements: ${JSON.stringify(heroText)}`);

  // Screenshot 2: Scroll to 2000px (ParallaxGrid)
  console.log("\n--- SCREENSHOT 2: ParallaxGrid Section (~2000px) ---");
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-parallax-2000.png`, fullPage: false });

  const at2000 = await page.evaluate(() => {
    const sections = document.querySelectorAll("section");
    const visible = [];
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visible.push({ id: s.id || "(no id)", top: Math.round(rect.top), className: s.className.substring(0, 80) });
      }
    });
    return visible;
  });
  console.log(`  Visible sections: ${JSON.stringify(at2000)}`);

  // Screenshot 3: Scroll to 4000px (Platform/Scale)
  console.log("\n--- SCREENSHOT 3: Platform/Scale Sections (~4000px) ---");
  await page.evaluate(() => window.scrollTo({ top: 4000, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-platform-4000.png`, fullPage: false });

  const at4000 = await page.evaluate(() => {
    const sections = document.querySelectorAll("section");
    const visible = [];
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visible.push({ id: s.id || "(no id)", top: Math.round(rect.top), className: s.className.substring(0, 80) });
      }
    });
    return visible;
  });
  console.log(`  Visible sections: ${JSON.stringify(at4000)}`);

  // Screenshot 4: Scroll to 6000px (Technology)
  console.log("\n--- SCREENSHOT 4: Technology Section (~6000px) ---");
  await page.evaluate(() => window.scrollTo({ top: 6000, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-technology-6000.png`, fullPage: false });

  const at6000 = await page.evaluate(() => {
    const sections = document.querySelectorAll("section");
    const visible = [];
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visible.push({ id: s.id || "(no id)", top: Math.round(rect.top), className: s.className.substring(0, 80) });
      }
    });
    return visible;
  });
  console.log(`  Visible sections: ${JSON.stringify(at6000)}`);

  // Screenshot 5: Scroll to 8000px (Safety)
  console.log("\n--- SCREENSHOT 5: Safety Section (~8000px) ---");
  await page.evaluate(() => window.scrollTo({ top: 8000, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-safety-8000.png`, fullPage: false });

  const at8000 = await page.evaluate(() => {
    const sections = document.querySelectorAll("section");
    const visible = [];
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visible.push({ id: s.id || "(no id)", top: Math.round(rect.top), className: s.className.substring(0, 80) });
      }
    });
    return visible;
  });
  console.log(`  Visible sections: ${JSON.stringify(at8000)}`);

  // Screenshot 6: Scroll to 10000px (Partners/Insights)
  console.log("\n--- SCREENSHOT 6: Partners/Insights (~10000px) ---");
  await page.evaluate(() => window.scrollTo({ top: 10000, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-partners-10000.png`, fullPage: false });

  const at10000 = await page.evaluate(() => {
    const sections = document.querySelectorAll("section");
    const visible = [];
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visible.push({ id: s.id || "(no id)", top: Math.round(rect.top), className: s.className.substring(0, 80) });
      }
    });
    return visible;
  });
  console.log(`  Visible sections: ${JSON.stringify(at10000)}`);

  // Screenshot 7: Scroll to bottom (CTA/Footer)
  console.log("\n--- SCREENSHOT 7: CTA/Footer (bottom) ---");
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-footer-bottom.png`, fullPage: false });

  // Check footer text sizes
  const footerInfo = await page.evaluate(() => {
    const footer = document.querySelector("footer");
    if (!footer) return "no footer found";
    const texts = [];
    footer.querySelectorAll("p, a, h4, span").forEach(el => {
      const style = getComputedStyle(el);
      texts.push({
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 40),
        fontSize: style.fontSize,
        color: style.color,
      });
    });
    return texts.slice(0, 15);
  });
  console.log(`  Footer text info: ${JSON.stringify(footerInfo, null, 2)}`);

  // Check CTA section
  const ctaInfo = await page.evaluate(() => {
    const cta = document.getElementById("cta");
    if (!cta) return "no CTA found";
    const h2 = cta.querySelector("h2");
    const buttons = cta.querySelectorAll("a");
    return {
      heading: h2?.textContent?.trim(),
      headingFontSize: h2 ? getComputedStyle(h2).fontSize : "n/a",
      buttonCount: buttons.length,
    };
  });
  console.log(`  CTA info: ${JSON.stringify(ctaInfo)}`);

  // Check Insights cards
  console.log("\n--- INSIGHTS CARDS CHECK ---");
  const insightsInfo = await page.evaluate(() => {
    const insightsSection = document.getElementById("insights");
    if (!insightsSection) return "no insights section found";
    const cards = insightsSection.querySelectorAll("[class*='rounded-[1.6rem]']");
    const cardInfo = [];
    cards.forEach((card, i) => {
      if (i >= 3) return;
      const gradientDiv = card.querySelector("[class*='bg-gradient']");
      const title = card.querySelector("h3");
      cardInfo.push({
        hasGradient: !!gradientDiv,
        gradientClasses: gradientDiv?.className.substring(0, 100) || "none",
        title: title?.textContent?.trim().substring(0, 50),
        bgColor: getComputedStyle(card).backgroundColor,
      });
    });
    return { cardCount: cards.length, cards: cardInfo };
  });
  console.log(`  Insights: ${JSON.stringify(insightsInfo, null, 2)}`);

  // Overall page metrics
  console.log("\n--- OVERALL PAGE METRICS ---");
  const pageMetrics = await page.evaluate(() => {
    return {
      totalHeight: document.body.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      sectionCount: document.querySelectorAll("section").length,
      allSectionIds: Array.from(document.querySelectorAll("section")).map(s => s.id || "(unnamed)"),
    };
  });
  console.log(`  ${JSON.stringify(pageMetrics, null, 2)}`);

  // Check for any broken images
  console.log("\n--- BROKEN IMAGES CHECK ---");
  const brokenImages = await page.evaluate(() => {
    const imgs = document.querySelectorAll("img");
    const broken = [];
    imgs.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        broken.push({ src: img.src?.substring(0, 80), alt: img.alt });
      }
    });
    return { total: imgs.length, broken };
  });
  console.log(`  Total images: ${brokenImages.total}, Broken: ${brokenImages.broken.length}`);
  if (brokenImages.broken.length > 0) {
    console.log(`  Broken: ${JSON.stringify(brokenImages.broken)}`);
  }

  // Check for any console errors
  const consoleErrors = [];
  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  // Take a full-page screenshot for reference
  console.log("\n--- FULL PAGE SCREENSHOT ---");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/08-fullpage.png`, fullPage: true });
  console.log("  Full page screenshot saved.");

  // Check specific CSS properties
  console.log("\n--- SPECIFIC CSS CHECKS ---");
  
  // Navbar width check
  const navbarWidth = await page.evaluate(() => {
    const header = document.querySelector("header");
    if (!header) return null;
    const style = getComputedStyle(header);
    return {
      maxWidth: style.maxWidth,
      width: header.offsetWidth,
      classes: header.className.substring(0, 200),
    };
  });
  console.log(`  Navbar: ${JSON.stringify(navbarWidth)}`);

  // Color palette check
  const colorCheck = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    return {
      bodyBg: body.backgroundColor,
      bodyColor: body.color,
    };
  });
  console.log(`  Body colors: ${JSON.stringify(colorCheck)}`);

  console.log("\n=== AUDIT COMPLETE ===");
  console.log(`Screenshots saved to ${SCREENSHOTS_DIR}/`);

  await browser.close();
}

run().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
