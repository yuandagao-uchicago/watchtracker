import { test, expect } from "@playwright/test";

test("add Cyberpunk Edgerunners via form", async ({ page }) => {
  await page.goto("/watchlist/add");

  // Fill title
  await page.fill('input[placeholder="e.g. The Dark Knight"]', "Cyberpunk: Edgerunners");

  // Fill poster URL
  await page.fill(
    'input[placeholder="https://image.tmdb.org/t/p/w500/..."]',
    "https://image.tmdb.org/t/p/w500/7jSHSFsR5VBBhlUBFjsJInCYwgf.jpg"
  );

  // Select Series
  await page.click("button:has-text('SERIES')");

  // Fill year
  await page.fill('input[placeholder="e.g. 2024"]', "2022");

  // Select genres
  await page.click("button:has-text('ACTION')");
  await page.click("button:has-text('ANIMATION')");
  await page.click("button:has-text('SCI-FI')");

  // Synopsis
  await page.fill(
    'textarea[placeholder="Brief description..."]',
    "In a dystopian Night City, a street kid tries to survive by becoming an edgerunner — a mercenary outlaw known as a cyberpunk."
  );

  // Submit
  await page.click("button:has-text('ADD TO WATCHLIST')");

  // Verify it appears in the watchlist
  await expect(page).toHaveURL("/watchlist");
  await expect(page.locator("text=Cyberpunk: Edgerunners")).toBeVisible();

  // Take a screenshot as proof
  await page.screenshot({ path: "edgerunners-added.png", fullPage: true });
});
