import { test, expect } from "@playwright/test";

test.describe("WatchTracker", () => {
  test("dashboard loads with stats and recent activity", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Dashboard");
    // Should show stat cards
    await expect(page.locator("div").filter({ hasText: /^Watching$/ }).first()).toBeVisible();
    await expect(page.locator("div").filter({ hasText: /^Completed$/ }).first()).toBeVisible();
    await expect(page.locator("text=Plan to Watch").first()).toBeVisible();
  });

  test("navigate to watchlist and see items", async ({ page }) => {
    await page.goto("/watchlist");
    await expect(page.locator("h1")).toHaveText("Watchlist");
    // Should see seed data items
    await expect(page.locator("text=Inception")).toBeVisible();
    await expect(page.locator("text=Breaking Bad")).toBeVisible();
  });

  test("filter watchlist by status", async ({ page }) => {
    await page.goto("/watchlist");
    await page.click("button:has-text('Watching')");
    await expect(page.locator("text=The Bear")).toBeVisible();
    // Completed items should not be visible
    await expect(page.locator("text=Inception")).not.toBeVisible();
  });

  test("add a new item via form", async ({ page }) => {
    await page.goto("/watchlist/add");
    await expect(page.locator("h1")).toHaveText("Add to Watchlist");

    // Fill out form
    await page.fill('input[placeholder="e.g. The Dark Knight"]', "Interstellar");
    await page.fill('input[placeholder="e.g. 2024"]', "2014");
    await page.click("button:has-text('Sci-Fi')");
    await page.fill(
      'textarea[placeholder="Brief description..."]',
      "A team of explorers travel through a wormhole in space."
    );
    await page.click("button:has-text('Add to Watchlist')");

    // Should redirect to watchlist and show new item
    await expect(page).toHaveURL("/watchlist");
    await expect(page.locator("text=Interstellar")).toBeVisible();
  });

  test("view item detail page via dynamic route", async ({ page }) => {
    await page.goto("/show/1");
    // Should be on the detail page
    await expect(page.locator("h1")).toHaveText("Inception");
    await expect(page.locator("text=Synopsis")).toBeVisible();
  });

  test("change rating on detail page", async ({ page }) => {
    await page.goto("/show/1");
    // Click rating button "7"
    const ratingButton = page.locator("button:has-text('7')").first();
    await ratingButton.click();
    await expect(page.locator("text=Your rating: 7/10")).toBeVisible();
  });

  test("recommend page shows suggestions", async ({ page }) => {
    await page.goto("/recommend");
    await expect(page.locator("h1")).toHaveText("Recommended for You");
    // Should show plan_to_watch items as recommendations
    await expect(page.locator("text=The Shawshank Redemption")).toBeVisible();
  });

  test("stats page shows charts", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.locator("h1")).toHaveText("Stats");
    await expect(page.locator("text=By Status")).toBeVisible();
    await expect(page.locator("text=Top Genres")).toBeVisible();
    await expect(page.locator("text=Rating Distribution")).toBeVisible();
  });

  test("navigation works between all pages", async ({ page }) => {
    await page.goto("/");

    // Navigate to watchlist
    await page.click("nav >> text=Watchlist");
    await expect(page.locator("h1")).toHaveText("Watchlist");

    // Navigate to recommend
    await page.click("nav >> text=Recommend");
    await expect(page.locator("h1")).toHaveText("Recommended for You");

    // Navigate to stats
    await page.click("nav >> text=Stats");
    await expect(page.locator("h1")).toHaveText("Stats");

    // Navigate back to dashboard
    await page.click("nav >> text=Dashboard");
    await expect(page.locator("h1")).toHaveText("Dashboard");
  });
});
