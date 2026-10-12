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
    expect(isEmailAllowed("rupakjayan22@gmail.com")).toBe(true);
    expect(isEmailAllowed("rupak.jayanb@gmail.com")).toBe(true);
    expect(isEmailAllowed("RUPAKJAYAN22@GMAIL.COM")).toBe(true); // Case-insensitive
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
});
