import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const ARTIFACTS_DIR =
  "C:/Users/rupak/.gemini/antigravity/brain/9b2ffdfe-4ea7-47ac-b63a-d8b4e9a5c029/cater-o-phobic";

test.beforeAll(() => {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }
});

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.addInitScript(() => {
    try {
      window.sessionStorage.setItem("bkr-opening-seen", "true");
    } catch {}
  });
});

test.describe("Cater-o-Phobic 3D Planner & Lusion Theme Suite", () => {
  test("Home Page renders Lusion dark theme, particles, and 3D Showcase", async ({
    page,
  }) => {
    await page.goto("/cater-o-phobic/#/");
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "debug-home.png") });
    
    // Dismiss intro if present
    const skipBtn = page.locator(".bkr-opening-skip");
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
    }
    await page.waitForTimeout(1000);

    // Verify Main Brand
    await expect(page.locator(".home-nav")).toBeVisible({ timeout: 10000 });

    // Verify Lusion Particle Canvas
    const particleCanvas = page.locator("canvas.pointer-events-none").first();
    await expect(particleCanvas).toBeVisible({ timeout: 10000 });

    // Verify 3D Showcase Section
    const showcase = page.locator("#3d-showcase");
    await expect(showcase).toBeVisible({ timeout: 10000 });
    await expect(showcase.getByText("Smart Counter Duplication")).toBeVisible();
    await expect(showcase.getByText("Google Maps Hall Projection")).toBeVisible();

    // Capture Dark Theme Home
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "01-cater-o-phobic-home-dark.png"),
      fullPage: false,
    });

    // Toggle to Light Theme
    const themeBtn = page.locator(".home-theme-toggle").first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, "02-cater-o-phobic-home-light.png"),
        fullPage: false,
      });
      // Toggle back to dark
      await themeBtn.click();
      await page.waitForTimeout(400);
    }
  });

  test("3D Planner Page renders WebGL Canvas, Counter Duplication & Mandapam Controls", async ({
    page,
  }) => {
    await page.goto("/cater-o-phobic/#/3d-planner");

    // Dismiss intro if present
    const skipBtn = page.locator(".bkr-opening-skip");
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
    }
    await page.waitForTimeout(1500);

    // Verify 3D Canvas
    const threeCanvas = page.locator("main canvas").first();
    await expect(threeCanvas).toBeVisible({ timeout: 10000 });

    // Verify Header HUD
    await expect(page.getByText("CATER-O-PHOBIC")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("3D LABS")).toBeVisible();

    // Verify Smart Counter Advisor drawer
    await expect(page.getByText("Guest Head Count")).toBeVisible();
    await expect(page.getByText("Queue & Flow Diagnostics")).toBeVisible();
    await expect(page.getByText("Live Dosa Stations")).toBeVisible();

    // Capture 3D Orbit View
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "03-cater-o-phobic-3d-orbit-view.png"),
    });

    // Switch to 2D Plan Top-down view
    await page.getByRole("button", { name: "2D Plan" }).click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "04-cater-o-phobic-3d-topdown-blueprint.png"),
    });

    // Switch back to 3D Orbit
    await page.getByRole("button", { name: "3D Orbit" }).click();
    await page.waitForTimeout(500);

    // Test Counter Bottleneck & Duplication:
    // Click 600 headcount preset
    await page.getByRole("button", { name: "600" }).click();
    await page.waitForTimeout(800);

    // Live Dosa bottleneck should be flagged
    await expect(
      page.getByText("Critical Bottleneck: Duplicate Live Dosa Counter")
    ).toBeVisible({ timeout: 10000 });

    // Click "Duplicate Dosa Counter Now" button
    const dupBtn = page.getByRole("button", {
      name: "Duplicate Dosa Counter Now",
    });
    if (await dupBtn.isVisible()) {
      await dupBtn.click();
      await page.waitForTimeout(800);
    }

    // Capture Counter Duplication Advisor state
    await page.screenshot({
      path: path.join(
        ARTIFACTS_DIR,
        "05-cater-o-phobic-counter-duplication-advisor.png"
      ),
    });

    // Test Mandapam Venue & Blueprint Projection Modal
    const venueBtn = page.locator(
      "button:has-text('Sri Krishna Kalyana Mandapam')"
    );
    await venueBtn.click();
    await page.waitForTimeout(800);

    await expect(
      page.getByText("Select Mandapam Venue & Blueprint Projection")
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText("Anaimalai Royal Palace & Banquet")
    ).toBeVisible();
    await expect(
      page.getByText("Coimbatore Grand Convention Center")
    ).toBeVisible();

    // Capture Mandapam modal
    await page.screenshot({
      path: path.join(
        ARTIFACTS_DIR,
        "06-cater-o-phobic-mandapam-selector-modal.png"
      ),
    });

    // Close modal
    await page.getByRole("button", { name: "Done Planning" }).click();
  });
});
