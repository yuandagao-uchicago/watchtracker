import { test, expect } from "@playwright/test";

test.describe("WatchTracker", () => {
  test("dashboard loads with stats and recent activity", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("WATCHLIST");
    await expect(page.locator("text=WATCHING").first()).toBeVisible();
    await expect(page.locator("text=COMPLETED").first()).toBeVisible();
  });

  test("navigate to watchlist and see items", async ({ page }) => {
    await page.goto("/watchlist");
    await expect(page.locator("h1")).toContainText("WATCHLIST");
    await expect(page.locator("text=Inception")).toBeVisible();
    await expect(page.locator("text=Breaking Bad")).toBeVisible();
  });

  test("filter watchlist by status", async ({ page }) => {
    await page.goto("/watchlist");
    await page.click("button:has-text('WATCHING')");
    await expect(page.locator("text=The Bear")).toBeVisible();
    await expect(page.locator("text=Inception")).not.toBeVisible();
  });

  test("add a new item via form", async ({ page }) => {
    await page.goto("/watchlist/add");
    await expect(page.locator("h1")).toContainText("ADD");

    await page.fill('input[placeholder="e.g. The Dark Knight"]', "Interstellar");
    await page.fill('input[placeholder="e.g. 2024"]', "2014");
    await page.click("button:has-text('SCI-FI')");
    await page.fill('textarea[placeholder="Brief description..."]', "A team of explorers travel through a wormhole in space.");
    await page.click("button:has-text('ADD TO WATCHLIST')");

    await expect(page).toHaveURL("/watchlist");
    await expect(page.locator("text=Interstellar")).toBeVisible();
  });

  test("view item detail page via dynamic route", async ({ page }) => {
    await page.goto("/show/1");
    await expect(page.locator("h1")).toHaveText("Inception");
    await expect(page.locator("text=dream-sharing technology")).toBeVisible();
  });

  test("change rating on detail page", async ({ page }) => {
    await page.goto("/show/1");
    const ratingButton = page.locator("button", { hasText: /^7$/ }).first();
    await ratingButton.click({ timeout: 10000 });
    await expect(page.locator("text=7/10").first()).toBeVisible();
  });

  test("recommend page shows suggestions", async ({ page }) => {
    await page.goto("/recommend");
    await expect(page.locator("h1")).toContainText("RECOMMENDED");
    await expect(page.locator("text=The Shawshank Redemption")).toBeVisible();
  });

  test("stats page shows charts", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.locator("h1")).toContainText("STATS");
    await expect(page.locator("text=BY STATUS")).toBeVisible();
    await expect(page.locator("text=TOP GENRES")).toBeVisible();
    await expect(page.locator("text=RATING DISTRIBUTION")).toBeVisible();
  });

  test("navigation works between all pages", async ({ page }) => {
    await page.goto("/");
    await page.click("nav >> text=WATCHLIST");
    await expect(page.locator("h1")).toContainText("WATCHLIST");
    await page.click("nav >> text=FOR YOU");
    await expect(page.locator("h1")).toContainText("RECOMMENDED");
    await page.click("nav >> text=STATS");
    await expect(page.locator("h1")).toContainText("STATS");
    await page.click("nav >> text=HOME");
    await expect(page.locator("h1")).toContainText("WATCHLIST");
  });
});
