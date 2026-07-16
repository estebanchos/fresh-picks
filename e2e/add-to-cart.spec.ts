import { expect, test } from "@playwright/test";

/**
 * The core user journey, structured Given/When/Then (BDD style, Playwright
 * runner). Runs against the real dev store — a fresh browser context per
 * test means a fresh cart every run.
 */
test.describe("Add to cart journey", () => {
  test("cart count updates after adding a product from the grid", async ({
    page,
  }) => {
    await test.step("Given the landing page with a product grid", async () => {
      await page.goto("/");
      await expect(page.getByTestId("hero-cta")).toBeVisible();
      await expect(page.getByTestId("product-card").first()).toBeVisible();
      await expect(page.getByTestId("cart-count")).toHaveText("Cart: 0");
    });

    await test.step("When I filter to the Beef collection and open a product", async () => {
      // Scoped to a curated collection: the store's seed Gift Card is
      // unbuyable (all variants unavailable) and must not start the journey.
      await page.getByRole("button", { name: "Beef" }).click();
      await expect(page).toHaveURL(/collection=/);
      await page.getByTestId("product-card").first().click();
      await expect(page.getByTestId("add-to-cart")).toBeEnabled();
    });

    await test.step("And I add it to the cart", async () => {
      await page.getByTestId("add-to-cart").click();
      await expect(page.getByText("Added to cart ✓")).toBeVisible();
    });

    await test.step("Then the cart count updates", async () => {
      await expect(page.getByTestId("cart-count")).toContainText("Cart: 1");
    });
  });
});
