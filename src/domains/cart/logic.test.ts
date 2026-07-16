import { describe, expect, it } from "vitest";

import {
  addLine,
  lineTotal,
  summarizeCart,
  updateQuantity,
  type CartLine,
} from "./logic";

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    merchandiseId: "gid://shopify/ProductVariant/1",
    title: "Beef Striploin",
    quantity: 1,
    price: { amount: "20.99", currencyCode: "USD" },
    ...overrides,
  };
}

const beefTimesTwo = line({ quantity: 2 });
const oneBison = line({
  merchandiseId: "gid://shopify/ProductVariant/2",
  title: "Premium Bison Cuts",
  price: { amount: "34.99", currencyCode: "USD" },
});

describe("summarizeCart", () => {
  it("returns zero subtotal and zero quantity for an empty cart", () => {
    const summary = summarizeCart([]);

    expect(summary.subtotalAmount).toBe("0.00");
    expect(summary.totalQuantity).toBe(0);
  });
});

describe("summarizeCart with lines", () => {
  it("sums line totals into the subtotal", () => {
    // 2 × 20.99 + 1 × 34.99
    expect(summarizeCart([beefTimesTwo, oneBison]).subtotalAmount).toBe(
      "76.97",
    );
  });

  it("sums line quantities into the total quantity", () => {
    expect(summarizeCart([beefTimesTwo, oneBison]).totalQuantity).toBe(3);
  });
});

describe("addLine", () => {
  it("appends a line for a product not yet in the cart", () => {
    const result = addLine([beefTimesTwo], oneBison);

    expect(result).toEqual([beefTimesTwo, oneBison]);
  });

  it("adds quantity to the existing line for a product already in the cart", () => {
    const result = addLine([beefTimesTwo], line({ quantity: 3 }));

    expect(result).toEqual([line({ quantity: 5 })]);
  });
});

describe("updateQuantity", () => {
  it("replaces the quantity of the matching line", () => {
    const result = updateQuantity(
      [beefTimesTwo, oneBison],
      beefTimesTwo.merchandiseId,
      4,
    );

    expect(result).toEqual([line({ quantity: 4 }), oneBison]);
  });

  it("removes the line when quantity is updated to zero", () => {
    const result = updateQuantity(
      [beefTimesTwo, oneBison],
      beefTimesTwo.merchandiseId,
      0,
    );

    expect(result).toEqual([oneBison]);
  });

  it("rejects a negative quantity", () => {
    expect(() =>
      updateQuantity([beefTimesTwo], beefTimesTwo.merchandiseId, -1),
    ).toThrow(/quantity/i);
  });

  it("rejects a fractional quantity", () => {
    expect(() =>
      updateQuantity([beefTimesTwo], beefTimesTwo.merchandiseId, 1.5),
    ).toThrow(/quantity/i);
  });
});

describe("lineTotal", () => {
  it("is quantity times unit price", () => {
    expect(lineTotal(beefTimesTwo)).toBe("41.98");
  });

  it("computes exact decimal totals despite float representation", () => {
    // Characterization test: 1.15 × 3 floats to 3.4499999999999997, but the
    // error (~4e-16) stays far below half a cent, so nearest-rounding lands
    // right. For 2-decimal prices × integer quantities this holds across the
    // whole domain. If this module ever grows percentage math (discounts,
    // tax rates), that guarantee dies — switch to integer cents and let this
    // test stand guard.
    const threeItems = line({
      quantity: 3,
      price: { amount: "1.15", currencyCode: "USD" },
    });

    expect(lineTotal(threeItems)).toBe("3.45");
  });
});
