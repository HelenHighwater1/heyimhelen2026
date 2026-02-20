import { test, expect } from "@playwright/test";

test.describe("page smoke tests", () => {
  test("home page — shows name and tech diagram", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Helen Highwater")).toBeVisible();
    // The tech diagram renders an SVG with the three tech boxes
    await expect(page.getByText("Frontend")).toBeVisible();
    await expect(page.getByText("Backend")).toBeVisible();
    await expect(page.getByText("Database")).toBeVisible();
  });

  test("bio page — heading and at least one bio item visible", async ({ page }) => {
    await page.goto("/bio");
    await expect(page.getByRole("heading", { name: /about me/i })).toBeVisible();
    // First bio item from bio.ts
    await expect(page.getByText(/fullstack software engineer/i).first()).toBeVisible();
  });

  test("dog pictures page — heading and photo count visible", async ({ page }) => {
    await page.goto("/dog-pictures");
    await expect(page.getByRole("heading", { name: /doggo/i })).toBeVisible();
    // Photo count paragraph is always rendered
    await expect(page.getByText(/photos?/i)).toBeVisible();
  });

  test("projects page — heading and first project visible", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: /^projects$/i })).toBeVisible();
    // PourFolio is the first project
    await expect(page.getByText("PourFolio")).toBeVisible();
  });

  test("resume page — heading and download link visible", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.getByRole("heading", { name: /^resume$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /download pdf/i })).toBeVisible();
  });

  test("navigating between pages does not show an error boundary", async ({ page }) => {
    const routes = ["/", "/bio", "/dog-pictures", "/projects", "/resume"];
    for (const route of routes) {
      await page.goto(route);
      // Next.js error pages display a distinctive message
      await expect(page.getByText(/application error/i)).not.toBeVisible();
      await expect(page.getByText(/this page could not be found/i)).not.toBeVisible();
    }
  });
});
