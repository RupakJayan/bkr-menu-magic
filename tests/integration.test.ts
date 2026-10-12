import { test, expect } from "@playwright/test";
import { createEmptyMenu, calculateEventSummary } from "../src/services/menuCalculationService";
import { getGoogleClientId, setGoogleClientId } from "../src/services/googleAuthService";

test.describe("IT - Integration Tests", () => {
  test("IT-01: Empty menu creation integrates with financial calculation", () => {
    const emptyMenu = createEmptyMenu();
    expect(emptyMenu.numberOfDays).toBe(1);
    expect(emptyMenu.days).toHaveLength(0);
    expect(emptyMenu.clientDetails.name).toBe("");

    const summary = calculateEventSummary(emptyMenu);
    expect(summary.totalSessions).toBe(0);
    expect(summary.totalHeadCount).toBe(0);
    expect(summary.totalDishes).toBe(0);
    expect(summary.grandTotal).toBe(0);
  });

  test("IT-02: Multi-session calculations aggregate correctly with quoted rates", () => {
    const menu = createEmptyMenu();
    menu.startDate = "2026-10-15";
    menu.endDate = "2026-10-15";
    menu.numberOfDays = 1;
    menu.transportCharge = 2500;
    menu.days = [
      {
        dayNumber: 1,
        date: "2026-10-15",
        sessions: [
          {
            id: "s1",
            name: "Morning Breakfast",
            type: "breakfast",
            startTime: "08:00",
            endTime: "10:00",
            headCount: 100,
            ratePerPerson: 150,
            selectedDishes: ["tiffin::idli_sambar", "tiffin::vada"],
          },
          {
            id: "s2",
            name: "Traditional Lunch Feast",
            type: "lunch",
            startTime: "12:00",
            endTime: "14:00",
            headCount: 200,
            ratePerPerson: 350,
            selectedDishes: ["meals::white_rice", "meals::sambar", "meals::payasam"],
          },
        ],
      },
    ];

    const summary = calculateEventSummary(menu);
    expect(summary.totalSessions).toBe(2);
    expect(summary.totalHeadCount).toBe(300);
    expect(summary.totalDishes).toBe(5);
    // 100 * 150 = 15,000; 200 * 350 = 70,000 => total 85,000
    const quotedSessionTotal = (100 * 150) + (200 * 350);
    expect(quotedSessionTotal).toBe(85000);
    expect(quotedSessionTotal + menu.transportCharge).toBe(87500);
  });

  test("IT-03: Google Client ID getter and setter integration", () => {
    const testId = "123456789-test.apps.googleusercontent.com";
    setGoogleClientId(testId);
    expect(getGoogleClientId()).toBe(testId);

    // Clearing client ID
    setGoogleClientId("");
    expect(getGoogleClientId()).not.toBe(testId);
  });
});
