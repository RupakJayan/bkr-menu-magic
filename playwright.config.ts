import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 60000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:8099/cater-o-phobic/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx vite preview --host 127.0.0.1 --port 8099",
    url: "http://127.0.0.1:8099/cater-o-phobic/",
    reuseExistingServer: false,
    timeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
