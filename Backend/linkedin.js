const puppeteer = require("puppeteer");
const sendMail = require("./mailer");
require("dotenv").config();

const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL;
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD;

async function linkedinLogin(keyword, gmail, appPassword, resumePath) {
  const browser = await puppeteer.launch({
    
    defaultViewport: null,
    slowMo: 20,
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  );

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  
  try {
    // ── Navigate to login ────────────────────────────────────────
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for LinkedIn's own React/JS to finish mounting
    await page.waitForFunction(() => document.readyState === "complete");
    await new Promise((r) => setTimeout(r, 2500));

    console.log("Title:", await page.title());
    console.log("URL  :", page.url());

    // ── Cookie banner ────────────────────────────────────────────
    const cookieBtn = await page
      .waitForSelector(
        'button[action-type="ACCEPT"], button[data-tracking-control-name="ga-cookie-banner-accept"]',
        { visible: true, timeout: 4000 }
      )
      .catch(() => null);

    if (cookieBtn) {
      await cookieBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Cookie banner dismissed.");
    }

    // ── Find email field ─────────────────────────────────────────
    // Target stable attributes from your inspect output, not dynamic IDs/classes
    const emailSelectors = [
      "input[autocomplete='username webauthn']", // exact match from your inspect
      "input[autocomplete='username']",
      "input[name='session_key']",
      "input[type='email']",
    ];

    let emailField = null;
    for (const sel of emailSelectors) {
      emailField = await page
        .waitForSelector(sel, { visible: true, timeout: 6000 })
        .catch(() => null);
      if (emailField) {
        console.log("Email field found:", sel);
        break;
      }
    }

    if (!emailField) {
      await page.screenshot({ path: "debug_email.png", fullPage: true });
      console.log("Email field not found — saved debug_email.png");
      return { success: false, message: "Email field not found." };
    }

    // scroll + focus + wait for LinkedIn's listeners to attach
    await emailField.scrollIntoView();
    await emailField.focus();
    await new Promise((r) => setTimeout(r, 800));

    // triple-click to clear any prefilled value, then type
    await emailField.click({ clickCount: 3 });
    await emailField.type(LINKEDIN_EMAIL, { delay: 80 });

    // ── Find password field ──────────────────────────────────────
await page.keyboard.press("Tab");
await new Promise((r) => setTimeout(r, 1000));

// now just type directly — no need to find the field, Tab already focused it
await page.keyboard.type(LINKEDIN_PASSWORD, { delay: 80 });

// submit
await page.keyboard.press("Enter");

    console.log("Post-login URL:", page.url());

    // ── Checkpoint / CAPTCHA ─────────────────────────────────────
    const postUrl = page.url();
    if (
      postUrl.includes("checkpoint") ||
      postUrl.includes("challenge") ||
      postUrl.includes("captcha")
    ) {
      console.log(
        "⚠ Security checkpoint detected — you have 40s to solve it manually."
      );
      await new Promise((r) => setTimeout(r, 40000));
      console.log("Resuming. Current URL:", page.url());
    }

    // ── Confirm login via search bar ─────────────────────────────
    const searchSelectors = [
      "input[placeholder='Search']",
      ".search-global-typeahead input",
      "#global-nav-search input",
      "input[aria-label='Search']",
    ];

    let searchBar = null;
    for (const sel of searchSelectors) {
      searchBar = await page
        .waitForSelector(sel, { visible: true, timeout: 5000 })
        .catch(() => null);
      if (searchBar) {
        console.log("Login confirmed. Search bar:", sel);
        break;
      }
    }

    if (!searchBar) {
      await page.screenshot({ path: "debug_after_login.png", fullPage: true });
      console.log("Search bar not found — saved debug_after_login.png");
      return {
        success: false,
        message: "Login failed. Credentials wrong or checkpoint not solved.",
      };
    }

    // ── Search keyword ───────────────────────────────────────────
    await searchBar.scrollIntoView();
    await searchBar.focus();
    await new Promise((r) => setTimeout(r, 500));
    await searchBar.click();
    await searchBar.type(keyword, { delay: 80 });
    await page.keyboard.press("Enter");

    await page
      .waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 })
      .catch(() => console.log("Search nav timeout — continuing."));

    await new Promise((r) => setTimeout(r, 3000));

    // ── Scrape emails ────────────────────────────────────────────
    const text = await page.evaluate(() => document.body.innerText);
    const emails = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
    const uniqueEmails = [...new Set(emails)];
    console.log("Emails scraped:", uniqueEmails);

    // ── Send mail ────────────────────────────────────────────────
     for (const email of uniqueEmails){
    await sendMail(email, gmail, appPassword, keyword, resumePath);
    console.log(`Mail sent to ${email}`);
    await new Promise((resolve) => {
      setTimeout(resolve,3000);
    })
   }
    

    return { success: true, message: "Automation completed successfully." };
  } catch (err) {
    console.error("Automation error:", err.message);
    await page
      .screenshot({ path: "debug_crash.png", fullPage: true })
      .catch(() => {});
    return { success: false, message: "Automation failed. Please retry." };
  } finally {
    await browser.close();
  }
}

module.exports = linkedinLogin;
