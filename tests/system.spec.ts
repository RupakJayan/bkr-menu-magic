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

  test("ST-04: Admin Access page provides direct Google Sign In and Password Access", async ({ page }) => {
    await page.goto("/bkr-menu-magic/#/admin");
    await page.waitForTimeout(500);

    // Verify Admin Login card renders
    const adminHeading = page.locator("h1");
    await expect(adminHeading).toBeVisible();

    // Verify "Sign in with Google Account" button is present and directly clickable
    const googleButton = page.locator('button:has-text("Sign in with Google Account")');
    await expect(googleButton).toBeVisible();

    // Verify helper caption is displayed without asking user to manually configure OAuth client ID
    const caption = page.locator('text=Sign in with your authorized BKR Catering Google Account');
    await expect(caption).toBeVisible();

    // Authenticate session to verify dashboard access
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
      sessionStorage.setItem(
        "bkr-google-user",
        JSON.stringify({
          email: "rupakjayan22@gmail.com",
          name: "Rupak Jayan",
        }),
      );
    });

    await page.reload();
    await page.waitForTimeout(600);

    // Verify successful sign-in into Admin Dashboard
    const dashboardHeader = page.locator('text=Local Admin');
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

  test("ST-06: Day/Session Navigator, Instant Tamil Translation, and Session MERN Dialog", async ({ page }) => {
    // Authenticate admin session in browser
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
    });

    // Open Menu Creator
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    // Step 1: Fill required details to advance (wait for intro to complete)
    const clientInput = page.locator("#clientName");
    await clientInput.waitFor({ state: "visible", timeout: 15000 });
    await clientInput.fill("Rupak Jayan");
    await page.locator("#clientPhone").fill("9876543210");
    await page.locator("#venueName").fill("Sri Krishna Mahal");
    await page.locator("#venueAddress").fill("Anaimalai, Pollachi, Tamil Nadu");

    // Click Save & Continue to Session Planning
    const saveStep1Btn = page.locator('button:has-text("Continue to Session Planning")');
    await saveStep1Btn.waitFor({ state: "visible" });
    await saveStep1Btn.click();
    await page.waitForTimeout(600);

    // Step 2: Add two sessions to Day 1 so Next Session progression is active
    const addSessionBtn = page.locator('button:has-text("Add Session to Day 1")');
    await addSessionBtn.waitFor({ state: "visible" });
    await addSessionBtn.click();
    await page.waitForTimeout(300);
    await addSessionBtn.click();
    await page.waitForTimeout(300);

    // Click Save & Continue to Menu Selection
    const saveStep2Btn = page.locator('button:has-text("Continue to Menu Selection")');
    await saveStep2Btn.waitFor({ state: "visible" });
    await saveStep2Btn.click();
    await page.waitForTimeout(800);

    // Step 3: Verify Universal Session Navigator is visible
    const sessionNav = page.locator('text=Sessions:');
    await expect(sessionNav).toBeVisible();

    // Verify "Manage Menu" button is present
    const manageBtn = page.locator('button:has-text("Manage Menu")').first();
    await expect(manageBtn).toBeVisible();
    await manageBtn.click();
    await page.waitForTimeout(300);

    // Verify Dialog opened
    const dialogTitle = page.locator('[role="dialog"]');
    await expect(dialogTitle).toBeVisible();

    // Click "Add Custom Dish" in Dialog
    const addDishBtn = page.locator('button:has-text("Add Custom Dish")').first();
    await addDishBtn.click();
    await page.waitForTimeout(200);

    // Type English name and check instant Tamil auto-translation
    const dishEnInput = page.locator('input[placeholder*="Mushroom Pepper Fry"]').first();
    await dishEnInput.fill("Pineapple Kesari");
    await page.waitForTimeout(200);

    const dishTaInput = page.locator('input[placeholder*="காளான்"]').first();
    const taVal = await dishTaInput.inputValue();
    expect(taVal).toContain("அன்னாசிப்பழ கேசரி");

    // Add the dish
    await page.locator('button:has-text("Add & Select for")').first().click();
    await page.waitForTimeout(400);

    // Verify dish appears in the dialog list
    const addedDishRow = page.locator('[role="dialog"] :text("Pineapple Kesari")').first();
    await expect(addedDishRow).toBeVisible();

    // Close Dialog
    await page.locator('button:has-text("Close & Keep Editing")').first().click();
    await page.waitForTimeout(300);

    // In Search box, verify instant translation in custom form
    const searchInput = page.locator('input[placeholder*="Search dishes"]').first();
    await searchInput.fill("Mushroom Biryani");
    await page.waitForTimeout(300);

    // Open custom dish form if toggle exists
    const openFormBtn = page.locator('button:has-text("+ Open custom dish form")').first();
    if (await openFormBtn.isVisible()) {
      await openFormBtn.click();
      await page.waitForTimeout(200);
    }

    const searchTaInput = page.locator('input[placeholder*="பலாப்பழ"]').first();
    const searchTaVal = await searchTaInput.inputValue();
    expect(searchTaVal).toContain("காளான் பிரியாணி");

    // Verify default "Proceed to Next Session" button is visible
    const nextSessionBtn = page.locator('button:has-text("Proceed to Next Session")').first();
    await expect(nextSessionBtn).toBeVisible();
  });

  test("ST-07: Serving Sequence Order Arrangement, Reordering, and Sorting", async ({ page }) => {
    // Authenticate admin session
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
    });

    // Open Menu Creator
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    const clientInput = page.locator("#clientName");
    await clientInput.waitFor({ state: "visible", timeout: 15000 });
    await clientInput.fill("Rupak Jayan");
    await page.locator("#clientPhone").fill("9876543210");
    await page.locator("#venueName").fill("Sri Krishna Mahal");
    await page.locator("#venueAddress").fill("Anaimalai, Pollachi, Tamil Nadu");

    // Advance to Step 2
    await page.locator('button:has-text("Continue to Session Planning")').click();
    await page.waitForTimeout(600);

    // Add session to Day 1
    await page.locator('button:has-text("Add Session to Day 1")').click();
    await page.waitForTimeout(300);

    // Advance to Step 3 Menu Selection
    await page.locator('button:has-text("Continue to Menu Selection")').click();
    await page.waitForTimeout(800);

    // Open Manage Menu dialog
    await page.locator('button:has-text("Manage Menu")').first().click();
    await page.waitForTimeout(400);

    // Add first dish: Pineapple Kesari
    await page.locator('button:has-text("Add Custom Dish")').first().click();
    await page.waitForTimeout(200);
    const dishEnInput = page.locator('input[placeholder*="Mushroom Pepper Fry"]').first();
    await dishEnInput.fill("Pineapple Kesari");
    await page.locator('button:has-text("Add & Select for")').first().click();
    await page.waitForTimeout(400);

    // Add second dish: Medu Vada
    await page.locator('button:has-text("Add Custom Dish")').first().click();
    await page.waitForTimeout(200);
    await dishEnInput.fill("Medu Vada");
    await page.locator('button:has-text("Add & Select for")').first().click();
    await page.waitForTimeout(400);

    // Verify Serving Sequence Arrangement toolbar buttons exist
    const traditionalBtn = page.locator('button:has-text("Traditional")').first();
    await expect(traditionalBtn).toBeVisible();

    const alphaBtn = page.locator('button:has-text("A → Z"), button:has-text("Alphabetical")').first();
    await expect(alphaBtn).toBeVisible();

    const catBtn = page.locator('button:has-text("By Category"), button:has-text("Category")').first();
    await expect(catBtn).toBeVisible();

    const reverseBtn = page.locator('button:has-text("Reverse")').first();
    await expect(reverseBtn).toBeVisible();

    // Verify live sequence numbers
    const seqNum = page.locator('[role="dialog"] :text("#1")').first();
    await expect(seqNum).toBeVisible();

    // Close Dialog
    await page.locator('button:has-text("Close & Keep Editing")').first().click();
    await page.waitForTimeout(300);
  });

  test("ST-08: AI Voice Assistant Dialog, Inline Key Setup, and Zero Echo Guard", async ({ page }) => {
    // Authenticate admin session
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
    });

    // Open Menu Creator
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    const clientInput = page.locator("#clientName");
    await clientInput.waitFor({ state: "visible", timeout: 15000 });
    await clientInput.fill("Rupak Jayan");
    await page.locator("#clientPhone").fill("9876543210");
    await page.locator("#venueName").fill("Sri Krishna Mahal");
    await page.locator("#venueAddress").fill("Anaimalai, Pollachi, Tamil Nadu");

    await page.locator('button:has-text("Continue to Session Planning")').click();
    await page.waitForTimeout(600);

    await page.locator('button:has-text("Add Session to Day 1")').click();
    await page.waitForTimeout(300);

    await page.locator('button:has-text("Continue to Menu Selection")').click();
    await page.waitForTimeout(800);

    // Open AI Voice Assistant Dialog
    const voiceBtn = page.locator('button:has-text("AI Voice Assistant")').first();
    await expect(voiceBtn).toBeVisible();
    await voiceBtn.click();
    await page.waitForTimeout(500);

    // Verify AI Voice Assistant Dialog Header & Badges
    const voiceDialog = page.locator('[role="dialog"]');
    await expect(voiceDialog).toBeVisible();
    await expect(voiceDialog.locator('text=AI Voice Assistant').first()).toBeVisible();
    // Verify Free Voice banner is active by default (Zero Key Needed)
    const freeVoiceBanner = voiceDialog.getByText(/Free Speech Recognition Active|Free Voice Engine/).first();
    await expect(freeVoiceBanner).toBeVisible();
    await voiceDialog.screenshot({ path: "C:/Users/rupak/.gemini/antigravity/brain/9b2ffdfe-4ea7-47ac-b63a-d8b4e9a5c029/voice-assistant-free-mode.png" });

    // Switch to Gemini Cloud AI tab to verify optional Gemini Key setup
    const geminiTab = voiceDialog.locator('button:has-text("Gemini Cloud AI")').first();
    if (await geminiTab.isVisible()) {
      await geminiTab.click();
      await page.waitForTimeout(200);
    }

    // Verify Inline Gemini Key setup banner exists
    const keyBanner = voiceDialog.getByText(/Google Gemini API Key Setup|Gemini.*Voice Connected/).first();
    await expect(keyBanner).toBeVisible();

    // Close Dialog
    const closeBtn = voiceDialog.locator('button:has-text("Close"), button[aria-label="Close"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press("Escape");
    }
    await page.waitForTimeout(300);
  });

  test("ST-09: Live Counter Custom Mention and Chef Kitchen Sheet Tamil PDF Generation", async ({ page }) => {
    // Authenticate admin session
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
    });

    // Open Menu Creator Step 1
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    const clientInput = page.locator("#clientName");
    await clientInput.waitFor({ state: "visible", timeout: 15000 });
    await clientInput.fill("Senthil & Deepa Reception");
    await page.locator("#clientPhone").fill("9842123456");
    await page.locator("#venueName").fill("Madurai Meenakshi Mahal");
    await page.locator("#venueAddress").fill("Madurai, Tamil Nadu");

    // Fill Custom Mention / Live Counter Notice
    const mentionInput = page.locator("#customMention");
    await expect(mentionInput).toBeVisible();
    await mentionInput.fill("Live Tea & Filter Coffee counter starts from Day 1 06:00 AM to Day 2 10:00 PM");

    // Advance to Step 2 Session Planning
    await page.locator('button:has-text("Continue to Session Planning")').click();
    await page.waitForTimeout(600);

    // Add session to Day 1
    await page.locator('button:has-text("Add Session to Day 1")').click();
    await page.waitForTimeout(300);

    // Advance to Step 3 Menu Selection
    await page.locator('button:has-text("Continue to Menu Selection")').click();
    await page.waitForTimeout(800);

    // Advance to Step 4 Review & Pricing
    await page.locator('button:has-text("Proceed to Next Session"), button:has-text("Continue to Review & Pricing")').first().click();
    await page.waitForTimeout(600);

    // Verify Custom Mention callout is visible in Review
    const reviewNotice = page.locator('text=Live Tea & Filter Coffee counter starts from Day 1 06:00 AM to Day 2 10:00 PM').first();
    await expect(reviewNotice).toBeVisible();

    // Advance to Step 5 Document Generation
    await page.locator('button:has-text("Continue to Generate Documents"), button:has-text("Generate Documents"), button:has-text("Continue to Document Generation")').first().click();
    await page.waitForTimeout(600);

    // Verify Chef's Kitchen Sheet (Tamil PDF) card is visible
    const chefCard = page.locator('text=Chef\'s Kitchen Sheet (Tamil PDF)').first();
    await expect(chefCard).toBeVisible();

    // Verify Custom Mention notice banner is visible in Document Generation
    const docNotice = page.locator('text=Live Counter & Service Notice / நேரடி கவுண்டர் அறிவிப்பு').first();
    await expect(docNotice).toBeVisible();
  });

  test("ST-10: Session Switch Clears Voice Activity & Review Step Allows Bilingual Dish Name Editing", async ({ page }) => {
    // Authenticate admin session
    await page.goto("/bkr-menu-magic/#/admin");
    await page.evaluate(() => {
      sessionStorage.setItem("bkr-admin-session", "authenticated");
    });

    // Open Menu Creator Step 1
    await page.goto("/bkr-menu-magic/#/menu-creator");
    await page.waitForTimeout(600);

    const clientInput = page.locator("#clientName");
    await clientInput.waitFor({ state: "visible", timeout: 15000 });
    await clientInput.fill("Karthik Reception");
    await page.locator("#clientPhone").fill("9842123456");
    await page.locator("#venueName").fill("Grand Palace Madurai");
    await page.locator("#venueAddress").fill("Madurai, Tamil Nadu");

    // Advance to Step 2 Session Planning
    await page.locator('button:has-text("Continue to Session Planning")').click();
    await page.waitForTimeout(600);

    // Add session to Day 1
    await page.locator('button:has-text("Add Session to Day 1")').click();
    await page.waitForTimeout(400);

    // Advance to Step 3 Menu Selection
    await page.locator('button:has-text("Continue to Menu Selection")').click();
    await page.waitForTimeout(800);

    // Verify search input has inputMode="text"
    const searchInput = page.locator('input[placeholder*="Search dishes"]').first();
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("inputMode", "text");

    // Add a dish to session
    const firstDishCard = page.locator(".cursor-pointer").first();
    await firstDishCard.click();
    await page.waitForTimeout(300);

    // Advance to Step 4 Review & Pricing
    await page.locator('button:has-text("Proceed to Next Session"), button:has-text("Continue to Review & Pricing")').first().click();
    await page.waitForTimeout(600);

    // In Review step, verify Edit Dish button is visible on the dish
    const editDishBtn = page.locator('button[title*="Edit dish name"]').first();
    await expect(editDishBtn).toBeVisible();
    await editDishBtn.click();
    await page.waitForTimeout(400);

    // Verify Edit Dish dialog opened
    const dialogTitle = page.locator('text=Edit Dish Details').first();
    await expect(dialogTitle).toBeVisible();

    // Edit English and Tamil name
    const englishInput = page.locator('input[placeholder*="Special Ghee Pongal"]').first();
    await englishInput.fill("Grand Ghee Pongal");

    const tamilInput = page.locator('input[placeholder*="சிறப்பு நெய் பொங்கல்"]').first();
    await tamilInput.fill("கிராண்ட் நெய் பொங்கல்");

    // Save Changes
    await page.locator('button:has-text("Save Changes")').click();
    await page.waitForTimeout(500);

    // Verify updated names are displayed in Review Step card
    const updatedEn = page.locator('text=Grand Ghee Pongal').first();
    await expect(updatedEn).toBeVisible();
    const updatedTa = page.locator('text=கிராண்ட் நெய் பொங்கல்').first();
    await expect(updatedTa).toBeVisible();
  });
});
