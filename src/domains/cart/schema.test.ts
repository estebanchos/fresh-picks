import { describe, expect, it } from "vitest";

import { toCartLines, type Cart } from "./schema";

describe("toCartLines", () => {
  it("maps API cart lines to the logic module's CartLine shape", () => {
    const cart: Cart = {
      id: "gid://shopify/Cart/abc",
      totalQuantity: 2,
      checkoutUrl: "https://example.myshopify.com/cart/c/abc",
      lines: {
        nodes: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              id: "gid://shopify/ProductVariant/1",
              title: "Beef Striploin",
              price: { amount: "20.99", currencyCode: "USD" },
            },
          },
        ],
      },
    };

    expect(toCartLines(cart)).toEqual([
      {
        merchandiseId: "gid://shopify/ProductVariant/1",
        title: "Beef Striploin",
        quantity: 2,
        price: { amount: "20.99", currencyCode: "USD" },
      },
    ]);
  });
});
