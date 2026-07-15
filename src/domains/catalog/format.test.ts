import { describe, expect, it } from "vitest";

import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("formats a USD amount", () => {
    expect(formatMoney({ amount: "12.5", currencyCode: "USD" })).toBe("$12.50");
  });

  it("formats whole amounts with cents", () => {
    expect(formatMoney({ amount: "8", currencyCode: "USD" })).toBe("$8.00");
  });

  it("respects the currency code", () => {
    expect(formatMoney({ amount: "10", currencyCode: "EUR" })).toBe("€10.00");
  });

  it("throws on a non-numeric amount", () => {
    expect(() =>
      formatMoney({ amount: "not-a-number", currencyCode: "USD" }),
    ).toThrow(/Invalid money amount/);
  });
});
