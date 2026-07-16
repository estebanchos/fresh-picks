"use client";

import { formatMoney } from "@/domains/catalog/format";
import { useCart } from "@/domains/cart/hooks";
import { summarizeCart } from "@/domains/cart/logic";
import { toCartLines } from "@/domains/cart/schema";

export function CartCount() {
  const { data: cart } = useCart();

  const lines = cart ? toCartLines(cart) : [];
  const summary = summarizeCart(lines);
  const currencyCode = lines[0]?.price.currencyCode;

  return (
    <span
      data-testid="cart-count"
      className="rounded-full bg-emerald-700 px-3 py-1 text-sm font-medium text-white"
    >
      Cart: {summary.totalQuantity}
      {currencyCode &&
        ` · ${formatMoney({ amount: summary.subtotalAmount, currencyCode })}`}
    </span>
  );
}
