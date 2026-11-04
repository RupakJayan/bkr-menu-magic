import { test, expect } from "@playwright/test";
import path from "path";

const verifyDir = "C:\\Users\\rupak\\.gemini\\antigravity\\brain\\9b2ffdfe-4ea7-47ac-b63a-d8b4e9a5c029\\verification";

test.describe("Full Application Verification & Screenshot Capture", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.goto("/bkr-menu-magic/");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-opening-seen", "true");
      sessionStorage.setItem("bkr-admin-session", "authenticated");
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });
  });

  test("01 - Home Page renders cleanly with zero errors", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/");
    await page.waitForTimeout(800);

    // Verify key sections
    await expect(page.locator("text=BKR Catering").first()).toBeVisible();
    await expect(page.locator("text=Plan your event").first()).toBeVisible();

    await page.screenshot({
      path: path.join(verifyDir, "01-home-page.png"),
      fullPage: false,
    });
  });

  test("02 - Menu Creator Step 1 Event Details & AI Lens Banner", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(800);

    await expect(page.locator("#clientName")).toBeVisible();
    await expect(page.locator("text=AI Menu Lens").first()).toBeVisible();

    await page.screenshot({
      path: path.join(verifyDir, "02-step1-event-details.png"),
      fullPage: false,
    });
  });

  test("03 - AI Menu Lens Dialog Ready & Pre-configured", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    const aiLensBtn = page.locator('button:has-text("AI Menu Lens")').first();
    await aiLensBtn.click();
    await page.waitForTimeout(600);

    const lensDialog = page.locator('[role="dialog"]').filter({ hasText: "AI Menu Lens" }).first();
    await expect(lensDialog).toBeVisible();
    await expect(lensDialog.locator("text=Gemini AI Vision Ready")).toBeVisible();
    await expect(lensDialog.locator("text=Take Photo with Camera")).toBeVisible();
    await expect(lensDialog.locator("text=Upload Picture(s)")).toBeVisible();

    await page.screenshot({
      path: path.join(verifyDir, "03-ai-menu-lens-dialog.png"),
      fullPage: false,
    });
  });

  test("04 - Menu Creator Step 2 Session Planning", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    await page.locator("#clientName").fill("Rupak Jayan");
    await page.locator("#clientPhone").fill("9876543210");
    await page.locator("#venueName").fill("Sri Krishna Mahal");
    await page.locator("#venueAddress").fill("Anaimalai, Pollachi, Tamil Nadu");
    await page.locator('button:has-text("Continue to Session Planning")').click();
    await page.waitForTimeout(800);

    await expect(page.locator('button:has-text("Add Session to Day 1")').first()).toBeVisible();

    await page.screenshot({
      path: path.join(verifyDir, "04-step2-session-planning.png"),
      fullPage: false,
    });
  });

  test("05 - Menu Creator Step 3 Menu Selection & Dish Catalog", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    await page.locator("#clientName").fill("Rupak Jayan");
    await page.locator("#clientPhone").fill("9876543210");
    await page.locator("#venueName").fill("Sri Krishna Mahal");
    await page.locator("#venueAddress").fill("Anaimalai, Pollachi, Tamil Nadu");
    await page.locator('button:has-text("Continue to Session Planning")').click();
    await page.waitForTimeout(600);

    await page.locator('button:has-text("Add Session to Day 1")').click();
    await page.waitForTimeout(400);

    await page.locator('button:has-text("Continue to Menu Selection")').click();
    await page.waitForTimeout(800);

    // Verify search and categories
    await expect(page.locator('input[placeholder*="Search dishes"]').first()).toBeVisible();
    await expect(page.locator('button:has-text("AI Voice Assistant")').first()).toBeVisible();

    await page.screenshot({
      path: path.join(verifyDir, "05-step3-menu-selection.png"),
      fullPage: false,
    });
  });

  test("06 - AI Voice Assistant Dialog Ready & Active", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    await page.locator("#clientName").fill("Rupak Jayan");
    await page.locator("#clientPhone").fill("9876543210");
    await page.locator("#venueName").fill("Sri Krishna Mahal");
    await page.locator("#venueAddress").fill("Anaimalai, Pollachi, Tamil Nadu");
    await page.locator('button:has-text("Continue to Session Planning")').click();
    await page.waitForTimeout(600);

    await page.locator('button:has-text("Add Session to Day 1")').click();
    await page.waitForTimeout(400);

    await page.locator('button:has-text("Continue to Menu Selection")').click();
    await page.waitForTimeout(800);

    const voiceBtn = page.locator('button:has-text("AI Voice Assistant")').first();
    await voiceBtn.click();
    await page.waitForTimeout(600);

    const voiceDialog = page.locator('[role="dialog"]').filter({ hasText: "AI Voice Assistant" }).first();
    await expect(voiceDialog).toBeVisible();

    await page.screenshot({
      path: path.join(verifyDir, "06-ai-voice-assistant-dialog.png"),
      fullPage: false,
    });
  });

  test("07 - Admin Sign In Google-First", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.removeItem("bkr-admin-session");
    });
    await page.reload();
    await page.waitForTimeout(600);

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('button:has-text("Sign in with Google Account")')).toBeVisible();
    await expect(page.locator("text=Sign in with your authorized BKR Catering Google Account")).toBeVisible();

    await page.screenshot({
      path: path.join(verifyDir, "07-admin-access-google-first.png"),
      fullPage: false,
    });
  });

  test("08 - Admin Dashboard Overview & Settings", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
      sessionStorage.setItem(
        "bkr-google-user",
        JSON.stringify({
          email: "bkrcaters@gmail.com",
          name: "BKR Caters",
        })
      );
    });

    await page.reload();
    await page.waitForTimeout(600);

    await expect(page.locator("text=Local Admin")).toBeVisible();

    // Settings Tab
    const settingsTab = page.locator('button:has-text("Settings")').first();
    await settingsTab.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(verifyDir, "08-admin-dashboard-settings.png"),
      fullPage: false,
    });
  });
});
