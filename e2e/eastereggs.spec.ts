import { test, expect } from "@playwright/test";

test.describe("easter egg: ASCII webcam", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the tech diagram SVG to finish drawing
    await page.waitForSelector("svg", { state: "visible" });
  });

  test("clicking the Frontend box opens the ASCII cam overlay", async ({ page }) => {
    // The Frontend SVG box is a hit area rect inside the diagram.
    // Use the text label to locate the parent group, then find its clickable rect.
    await page.locator("svg text").filter({ hasText: "Frontend" }).click();

    const overlay = page.getByRole("dialog", { name: /ascii webcam/i });
    await expect(overlay).toBeVisible();
  });

  test("the close button dismisses the ASCII cam overlay", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Frontend" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /close ascii webcam/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("pressing Escape dismisses the ASCII cam overlay", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Frontend" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test.describe("easter egg: load balancer overlay", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("svg", { state: "visible" });
  });

  test("clicking the Backend box opens the load balancer overlay", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Backend" }).click();

    // The overlay shows the algorithm buttons
    await expect(page.getByText("round robin")).toBeVisible();
    await expect(page.getByText("least connections")).toBeVisible();
    await expect(page.getByText("weighted")).toBeVisible();
  });

  test("the load balancer shows all three worker columns", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Backend" }).click();

    await expect(page.getByText("worker-1")).toBeVisible();
    await expect(page.getByText("worker-2")).toBeVisible();
    await expect(page.getByText("worker-3")).toBeVisible();
  });

  test("submitting a ping task shows it in a worker column", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Backend" }).click();

    await page.getByRole("button", { name: /^ping$/ }).click();

    // A task chip for "ping" should appear in one of the worker columns
    await expect(page.locator(".font-sketch").filter({ hasText: "ping" }).first()).toBeVisible();
  });

  test("the close button dismisses the load balancer overlay", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Backend" }).click();
    await expect(page.getByText("round robin")).toBeVisible();

    await page.getByRole("button", { name: /✕ close/i }).click();

    // The overlay content should be gone
    await expect(page.getByText("round robin")).not.toBeVisible();
  });

  test("pressing Escape dismisses the load balancer overlay", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Backend" }).click();
    await expect(page.getByText("round robin")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("round robin")).not.toBeVisible();
  });

  test("switching algorithms updates the active description", async ({ page }) => {
    await page.locator("svg text").filter({ hasText: "Backend" }).click();

    await page.getByRole("button", { name: "least connections" }).click();
    await expect(page.getByText(/always picks the least-busy worker/i)).toBeVisible();

    await page.getByRole("button", { name: "weighted" }).click();
    await expect(page.getByText(/worker-1 gets 3x traffic/i)).toBeVisible();
  });
});
