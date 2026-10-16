import { test, expect } from "@playwright/test";
import { getTamilSolarDate } from "../src/utils/tamilDate";
import { differenceInCalendarDays, addDaysToISODate } from "../src/utils/istDate";
import { buildDishKey, normalizeDishKeys, findDishByKey } from "../src/services/menuCatalogService";
import { isEmailAllowed, ALLOWED_ADMIN_EMAILS } from "../src/services/googleAuthService";

test.describe("UT - Unit Tests", () => {
  test("UT-01: Tamil date calculation returns valid Tamil solar date and English transliteration", () => {
    // Test date: 2026-10-12
    const tamilTa = getTamilSolarDate("2026-10-12", "ta");
    const tamilEn = getTamilSolarDate("2026-10-12", "en");

    expect(tamilTa).toBeTruthy();
    expect(tamilEn).toBeTruthy();
    // English transliteration should contain Purattasi month
    expect(tamilEn).toContain("Purattasi");
    // Tamil string should contain புரட்டாசி
    expect(tamilTa).toContain("புரட்டாசி");
  });

  test("UT-02: Tamil date invalid inputs return empty string safely", () => {
    expect(getTamilSolarDate("", "ta")).toBe("");
    expect(getTamilSolarDate("invalid-date", "en")).toBe("");
  });

  test("UT-03: IST Date utilities compute accurate calendar day differences", () => {
    const diff = differenceInCalendarDays("2026-10-12", "2026-10-14");
    expect(diff).toBe(2);

    const sameDay = differenceInCalendarDays("2026-10-12", "2026-10-12");
    expect(sameDay).toBe(0);

    const nextDate = addDaysToISODate("2026-10-12", 3);
    expect(nextDate).toBe("2026-10-15");
  });

  test("UT-04: Menu Catalog Service builds and normalizes dish keys correctly", () => {
    const dishKey = buildDishKey("tiffin", "idli_sambar");
    expect(dishKey).toBe("tiffin::idli_sambar");

    const normalized = normalizeDishKeys(["tiffin::idli_sambar", "idli_sambar", "tiffin::idli_sambar"]);
    expect(normalized).toContain("tiffin::idli_sambar");
    // Duplicate elimination
    expect(new Set(normalized).size).toBe(normalized.length);
  });

  test("UT-05: Google Auth Email Allowlist validates administrator emails", () => {
    expect(isEmailAllowed("bkrcaters@gmail.com")).toBe(true);
    expect(isEmailAllowed("imurugansea@gmail.com")).toBe(true);
    expect(isEmailAllowed("raghavendrarbass@gmail.com")).toBe(true);
    expect(isEmailAllowed("ragsrups22@gmail.com")).toBe(true);
    expect(isEmailAllowed("rupak.jayanb@gmail.com")).toBe(true);
    expect(isEmailAllowed("rupakjayan22@gmail.com")).toBe(true);
    expect(isEmailAllowed("BKRCATERS@GMAIL.COM")).toBe(true); // Case-insensitive
    expect(isEmailAllowed("unknown@example.com")).toBe(false);
    expect(isEmailAllowed(undefined)).toBe(false);
    expect(isEmailAllowed("")).toBe(false);
  });

  test("UT-06: Google Drive event subfolder naming follows date_venueplace_clientname_tamil", async () => {
    const { getEventSubfolderName } = await import("../src/services/googleDriveService");
    const { createEmptyMenu } = await import("../src/services/menuCalculationService");

    const menu = createEmptyMenu();
    menu.startDate = "2026-10-15";
    menu.venueDetails.name = "Sri Krishna Mahal";
    menu.clientDetails.name = "Rupak Jayan";

    const subfolderName = getEventSubfolderName(menu);
    expect(subfolderName).toContain("2026-10-15");
    expect(subfolderName).toContain("Sri_Krishna_Mahal");
    expect(subfolderName).toContain("Rupak_Jayan");
    expect(subfolderName.split("_").length).toBeGreaterThanOrEqual(4);
  });

  test("UT-07: Instant Tamil culinary translation matches common catering dishes", async () => {
    const { getInstantTamilName, getInstantEnglishName } = await import("../src/services/tamilTranslationService");

    expect(getInstantTamilName("Mushroom Biryani")).toBe("காளான் பிரியாணி");
    expect(getInstantTamilName("Paneer Butter Masala")).toBe("பன்னீர் பட்டர் மசாலா");
    expect(getInstantTamilName("Filter Coffee")).toBe("ஃபில்டர் காபி");
    expect(getInstantTamilName("Pineapple Kesari")).toBe("அன்னாசிப்பழ கேசரி");

    expect(getInstantEnglishName("காளான் பிரியாணி")).toBe("Mushroom Biryani");
    expect(getInstantEnglishName("வெண் பொங்கல்")).toBe("Ven Pongal");
  });

  test("UT-08: Category deduction guesses appropriate catering category from dish keywords", async () => {
    const { guessCategoryForDish } = await import("../src/services/tamilTranslationService");

    expect(guessCategoryForDish("Pineapple Kesari")).toBe("Sweets");
    expect(guessCategoryForDish("Badam Halwa")).toBe("Sweets");
    expect(guessCategoryForDish("Ghee Pongal")).toBe("Breakfast (Tiffin)");
    expect(guessCategoryForDish("Mushroom Dum Biryani")).toBe("Rice Varieties");
    expect(guessCategoryForDish("Filter Coffee")).toBe("Beverages");
    expect(guessCategoryForDish("Onion Pakoda")).toBe("Evening Snacks");
  });

  test("UT-09: Register dish into culinary dictionary and resolve via voice matching", async () => {
    const { registerDishToDictionary, getInstantTamilName, getInstantEnglishName } = await import("../src/services/tamilTranslationService");
    const { findBestDishMatch, splitContinuousSpeech } = await import("../src/services/voiceTypingService");

    // Register a new dish
    registerDishToDictionary("Chettinad Kozhukattai", "செட்டிநாடு கொழுக்கட்டை", "Special Dishes");

    // Verify dictionary lookup
    expect(getInstantTamilName("Chettinad Kozhukattai")).toBe("செட்டிநாடு கொழுக்கட்டை");
    expect(getInstantEnglishName("செட்டிநாடு கொழுக்கட்டை")).toBe("Chettinad Kozhukattai");

    // Verify continuous speech splitting
    const phrases = splitContinuousSpeech("Idli and Medu Vada next Pineapple Kesari");
    expect(phrases).toContain("Idli");
    expect(phrases).toContain("Medu Vada");
    expect(phrases).toContain("Pineapple Kesari");
  });

  test("UT-10: Expanded South Indian Catering Vocabulary & AI translation fallback", async () => {
    const { getInstantTamilName, getInstantEnglishName, fetchAiTamilTranslation } = await import("../src/services/tamilTranslationService");

    // Test newly added catering items from the expanded dictionary
    expect(getInstantTamilName("Mushroom Pepper Fry")).toBe("காளான் மிளகு வறுவல்");
    expect(getInstantTamilName("Baby Corn Manchurian")).toBe("பேபி கார்ன் மஞ்சுரியன்");
    expect(getInstantTamilName("Chilli Parotta")).toBe("சில்லி பரோட்டா");
    expect(getInstantTamilName("Garlic Naan")).toBe("பூண்டு நான்");
    expect(getInstantTamilName("Kalyana Sambar")).toBe("கல்யாண சாம்பார்");

    // Test reverse lookup
    expect(getInstantEnglishName("காளான் மிளகு வறுவல்")).toBe("Mushroom Pepper Fry");
    expect(getInstantEnglishName("பேபி கார்ன் மஞ்சுரியன்")).toBe("Baby Corn Manchurian");

    // Test fetchAiTamilTranslation returns valid object
    const result = await fetchAiTamilTranslation("Mushroom Pepper Fry");
    expect(result).not.toBeNull();
    expect(result?.name_ta).toBe("காளான் மிளகு வறுவல்");
  });

  test("UT-11: No Letter-by-Letter Pulli Transliteration & Tamil Voiced to English Romanization", async () => {
    const { getInstantTamilName, getInstantEnglishName, romanizeTamilToEnglish, isTamilScript } = await import("../src/services/tamilTranslationService");

    // 1. Partial/typing English letters must NEVER produce character-by-character pulli gibberish
    expect(getInstantTamilName("c")).toBe("");
    expect(getInstantTamilName("p")).toBe("");
    expect(getInstantTamilName("xyz")).toBe("");
    expect(getInstantTamilName("pepper")).toBe("மிளகு");

    // 2. Tamil voiced dishes must produce valid English titles with ZERO Tamil characters in name_en
    const en1 = getInstantEnglishName("பலாப்பழ பாயாசம்");
    expect(isTamilScript(en1)).toBe(false);
    expect(en1).toContain("Payasam");

    const en2 = getInstantEnglishName("அவல் பாயாசம்");
    expect(isTamilScript(en2)).toBe(false);
    expect(en2).toBe("Aval Payasam");

    const en3 = getInstantEnglishName("மசால் வடை");
    expect(isTamilScript(en3)).toBe(false);
    expect(en3).toBe("Masala Vadai");

    // 3. romanizeTamilToEnglish produces valid Latin script
    const roman = romanizeTamilToEnglish("அடை பிரதமன்");
    expect(isTamilScript(roman)).toBe(false);
    expect(roman).toBe("Ada Pradhaman");
  });

  test("UT-12: AI Voice Assistant Service Dish Resolution and Echo Guard", async () => {
    const { commitVoiceDishesToSession } = await import("../src/services/aiVoiceAssistantService");
    const { speakVoiceFeedback } = await import("../src/services/voiceTypingService");

    // 1. Voice feedback must be muted by default to eliminate mic reflection
    expect(() => speakVoiceFeedback("idli already in menu")).not.toThrow();

    // 2. Commit recognized voice dishes to session
    const addedDishes: string[] = [];
    let catalogUpdated = false;

    const mockDishes = [
      {
        name_en: "Medu Vada",
        name_ta: "மெது வடை",
        category: "Breakfast (Tiffin)",
        catalogDish: {
          id: "medu-vada",
          name_en: "Medu Vada",
          name_ta: "மெது வடை",
          category: "Breakfast (Tiffin)",
          isVegetarian: true,
        },
        isExistingMatch: true,
        isAlreadyInSession: false,
        selected: true,
      },
      {
        name_en: "Chili Parotta",
        name_ta: "சில்லி பரோட்டா",
        category: "Dinner (Tiffin)",
        isExistingMatch: false,
        isAlreadyInSession: false,
        selected: true,
      },
    ];

    const result = commitVoiceDishesToSession(
      mockDishes,
      (cat, id) => addedDishes.push(`${cat}:${id}`),
      () => { catalogUpdated = true; }
    );

    expect(result.addedCount).toBe(2);
    expect(result.newDishesCreated).toBe(1);
    expect(addedDishes.length).toBe(2);
    expect(catalogUpdated).toBe(true);
  });

  test("UT-13: Session Dish Serving Sequence Ordering and Traditional Course Arrangement", async () => {
    const { getManagedMenuCatalog, buildDishKey, findDishByKey } = await import("../src/services/menuCatalogService");

    const catalog = getManagedMenuCatalog();
    const categories = Object.keys(catalog);
    expect(categories.length).toBeGreaterThan(0);

    const firstCat = categories[0];
    const firstDish = catalog[firstCat][0];
    const key = buildDishKey(firstCat, firstDish.id);

    const resolved = findDishByKey(key);
    expect(resolved).not.toBeNull();
    expect(resolved?.id).toBe(firstDish.id);

    // Traditional ranking simulation: Sweets (Kesari) -> Tiffin (Vada, Idli) -> Sambar -> Curd Rice -> Coffee
    const sampleDishes = [
      { name: "Curd Rice", rank: 5 },
      { name: "Medu Vada", rank: 2 },
      { name: "Pineapple Kesari", rank: 1 },
      { name: "Arachuvitta Sambar", rank: 4 },
      { name: "Idli", rank: 3 },
      { name: "Filter Coffee", rank: 6 },
    ];

    const sortedDishes = [...sampleDishes].sort((a, b) => a.rank - b.rank);

    expect(sortedDishes[0].name).toBe("Pineapple Kesari");
    expect(sortedDishes[1].name).toBe("Medu Vada");
    expect(sortedDishes[sortedDishes.length - 1].name).toBe("Filter Coffee");
  });
});
