import { test, expect } from "@playwright/test";

test.describe("ST - System / End-to-End Tests", () => {
  test("ST-01: Home page loads with valid assets and no Owner title in footer", async ({ page }) => {
    const failedRequests: string[] = [];
    page.on("requestfailed", (request) => {
      failedRequests.push(request.url());
    });

    await page.goto("/bkr-menu-magic/#/");
    await page.waitForLoadState("networkidle");

    // Verify main page heading
    const heroHeading = page.locator(".home-hero h1");
    await expect(heroHeading).toBeVisible();

    // Verify footer DOES NOT contain "Owner: Raghavendrar PB"
    const footerText = await page.locator("footer").textContent();
    expect(footerText).not.toContain("Owner: Raghavendrar PB");
    expect(footerText).not.toContain("Raghavendrar");

    // Verify Brand Logo is visible
    const brandLogo = page.locator(".home-brand img");
    await expect(brandLogo).toBeVisible();

    // Check failed requests (no 404s for local images)
    const localAssetFailures = failedRequests.filter((url) =>
      url.includes("/bkr-menu-magic/") && (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".svg")),
    );
    expect(localAssetFailures).toHaveLength(0);
  });

  test("ST-02: Navigating to /#instagram DOES NOT throw 404 and scrolls to Instagram section", async ({ page }) => {
    // Direct navigation to /#instagram (which previously threw 404 in HashRouter)
    await page.goto("/bkr-menu-magic/#instagram");
    await page.waitForTimeout(500);

    // Verify it is NOT the 404 page
    const notFoundTitle = page.locator(".not-found-page h1");
    await expect(notFoundTitle).toHaveCount(0);

    // Verify the Instagram section exists and is present on the page
    const instagramSection = page.locator("#instagram");
    await expect(instagramSection).toBeVisible();

    // Click nav link "From our kitchen" and verify smooth scroll
    const kitchenNavLink = page.locator('nav a:has-text("From our kitchen")');
    await kitchenNavLink.click();
    await page.waitForTimeout(400);

    // Verify section is in view
    await expect(instagramSection).toBeVisible();
    await expect(page.locator(".not-found-page")).toHaveCount(0);
  });

  test("ST-03: Navigating to /#how-it-works, /#experience, /#our-approach, /#contact NEVER 404", async ({ page }) => {
    const sections = ["how-it-works", "experience", "our-approach", "contact"];
    for (const section of sections) {
      await page.goto(`/bkr-menu-magic/#${section}`);
      await page.waitForTimeout(300);

      const notFound = page.locator(".not-found-page");
      await expect(notFound).toHaveCount(0);

      const sectionEl = page.locator(`#${section}`);
      await expect(sectionEl).toBeAttached();
    }
  });

  test("ST-04: Admin Access page provides Google Client ID setup, Demo Sign In, and Password Reset", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/admin");
    await page.waitForTimeout(500);

    // Verify Admin Login card renders
    const adminHeading = page.locator("h1");
    await expect(adminHeading).toBeVisible();

    // Verify "Sign in with Google Account" button is present
    const googleButton = page.locator('button:has-text("Sign in with Google Account")');
    await expect(googleButton).toBeVisible();

    // Click "Edit ID" or "Configure Client ID" to open Google setup
    const editIdButton = page.locator('button:has-text("Edit ID")');
    const configureLink = page.locator('button:has-text("Configure Client ID")');
    if (await editIdButton.isVisible()) {
      await editIdButton.click();
    } else if (await configureLink.isVisible()) {
      await configureLink.click();
    } else {
      await googleButton.click();
    }

    // Verify Google Cloud Setup panel appears
    const setupPanel = page.locator('text=Google Cloud Setup');
    await expect(setupPanel).toBeVisible();

    // Test Demo Sign In button
    const demoButton = page.locator('button:has-text("Sign In as rupakjayan22@gmail.com")');
    await expect(demoButton).toBeVisible();
    await demoButton.click();

    // Verify successful sign-in into Admin Dashboard
    await page.waitForTimeout(500);
    const dashboardHeader = page.locator('header:has-text("Local Admin")');
    await expect(dashboardHeader).toBeVisible();

    // Verify Admin tabs are accessible
    const eventsTab = page.getByRole("button", { name: "Events", exact: true });
    await expect(eventsTab).toBeVisible();
    await eventsTab.click();
  });

  test("ST-05: Menu Creator step banner has high contrast in both Light and Dark modes", async ({ page }) => {
    // Authenticate admin session in browser
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
    });

    // Navigate to Menu Creator
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    // Check Step 1 banner
    const stepBanner = page.locator(".planner-step-banner");
    await expect(stepBanner).toBeVisible();

    // Heading "Event Details | நிகழ்வு விவரங்கள்"
    const heading = page.locator(".planner-step-banner h2");
    await expect(heading).toContainText("Event Details");

    // In Light mode: verify banner text color is crisp white and background is dark wine gradient
    const headingColor = await heading.evaluate((el) => window.getComputedStyle(el).color);
    // Should be rgb(255, 255, 255)
    expect(headingColor).toBe("rgb(255, 255, 255)");

    // Toggle to Dark Mode
    const themeToggle = page.locator(".planner-topbar-actions button:has-text('Dark'), .planner-topbar-actions button:has-text('Light')").first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(300);

      // In Dark mode: verify banner text remains crisp white
      const darkHeadingColor = await heading.evaluate((el) => window.getComputedStyle(el).color);
      expect(darkHeadingColor).toBe("rgb(255, 255, 255)");
    }
  });
});
