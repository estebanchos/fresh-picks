"use client";

import { useCart } from "@/domains/cart/hooks";

export function CartCount() {
  const { data: cart } = useCart();

  return (
    <span
      data-testid="cart-count"
      className="rounded-full bg-emerald-700 px-3 py-1 text-sm font-medium text-white"
    >
      Cart: {cart?.totalQuantity ?? 0}
    </span>
  );
}
