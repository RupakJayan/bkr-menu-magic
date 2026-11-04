import { strict as assert } from "node:assert";
import test from "node:test";
import { calculateCateringCapacity } from "../dist/index.js";

test("Detects Dosa bottleneck at 450 guests and recommends 2x counters", () => {
  const analysis = calculateCateringCapacity(450, ["dosa", "buffet_spread"]);
  assert.equal(analysis.dosaCounterCount, 1);
  assert.equal(analysis.recommendedDosaCounters, 2);
  assert.equal(analysis.queueStatus, "congested");
  assert.match(analysis.adviceList[0].title, /Duplicate Live Dosa Counter/);
});

test("Returns fluid queue status when full balanced stalls deployed with duplicated Dosa", () => {
  const analysis = calculateCateringCapacity(300, [
    "dosa",
    "dosa",
    "buffet_spread",
    "sweet_halwa",
    "chaat",
    "idli",
    "beverage_bar",
    "dessert_icecream"
  ]);
  assert.equal(analysis.dosaCounterCount, 2);
  assert.equal(analysis.recommendedDosaCounters, 2);
  assert.ok(["optimal", "moderate"].includes(analysis.queueStatus));
  assert.ok(analysis.estimatedWaitMinutes <= 11);
});

test("Detects optimal throughput for 200 guests with duplicated Dosa counters", () => {
  const analysis = calculateCateringCapacity(200, [
    "dosa",
    "dosa",
    "buffet_spread",
    "sweet_halwa",
    "chaat",
    "idli",
    "beverage_bar",
    "dessert_icecream"
  ]);
  assert.equal(analysis.dosaCounterCount, 2);
  assert.equal(analysis.queueStatus, "optimal");
  assert.ok(analysis.estimatedWaitMinutes <= 8);
});
