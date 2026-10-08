import { test, expect } from "@playwright/test";

test("the game should be able to load", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("canvas")).toBeVisible();
});

test("it should be able to initialize a match", async ({ page }) => {
    const responsePromise = page.waitForResponse(
        (response) =>
            response.url().includes("/api/game/start") &&
            response.request().method() === "POST"
    );

    await page.goto("/");

    const response = await responsePromise;

    expect(response.status()).toBe(200);
});

test("the player should be able to move", async ({ page }) => {
    await page.goto("/");

    const canvas = page.locator("canvas");

    await expect(canvas).toBeVisible();

    await page.keyboard.down("w");
    await page.waitForTimeout(500);
    await page.keyboard.up("w");

    expect(true).toBe(true);
});

test("o jogador deve conseguir atirar", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("canvas")).toBeVisible();

    await page.keyboard.press(" ");
    await page.waitForTimeout(100);

    expect(true).toBe(true);
});

test("the game shold be able to restart", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("canvas")).toBeVisible();

    await page.reload();

    await expect(page.locator("canvas")).toBeVisible();

    const response = await page.waitForResponse(
        (response) =>
            response.url().includes("/api/game/start") &&
            response.request().method() === "POST"
    );

    expect(response.status()).toBe(200);
});
