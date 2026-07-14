import type { Money } from "./schema";

/** Formats a Storefront MoneyV2 (decimal string + currency code) for display.
 * Pure and framework-free. */
export function formatMoney(money: Money, locale = "en"): string {
  const amount = Number(money.amount);
  if (Number.isNaN(amount)) {
    throw new Error(`Invalid money amount: "${money.amount}"`);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
  }).format(amount);
}
