/** Pure cart math — framework-free by design (the test seam).
 * No imports from React, Next, or the Shopify client. */

export type CartLine = {
  merchandiseId: string;
  title: string;
  quantity: number;
  price: { amount: string; currencyCode: string };
};

export type CartSummary = {
  subtotalAmount: string;
  totalQuantity: number;
};

export function addLine(lines: CartLine[], newLine: CartLine): CartLine[] {
  const exists = lines.some(
    (line) => line.merchandiseId === newLine.merchandiseId,
  );
  if (!exists) return [...lines, newLine];

  return lines.map((line) =>
    line.merchandiseId === newLine.merchandiseId
      ? { ...line, quantity: line.quantity + newLine.quantity }
      : line,
  );
}

export function updateQuantity(
  lines: CartLine[],
  merchandiseId: string,
  quantity: number,
): CartLine[] {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error(`Quantity must be a non-negative integer, got ${quantity}`);
  }
  if (quantity === 0) {
    return lines.filter((line) => line.merchandiseId !== merchandiseId);
  }
  return lines.map((line) =>
    line.merchandiseId === merchandiseId ? { ...line, quantity } : line,
  );
}

export function lineTotal(line: CartLine): string {
  return (Number(line.price.amount) * line.quantity).toFixed(2);
}

export function summarizeCart(lines: CartLine[]): CartSummary {
  const subtotal = lines.reduce(
    (sum, line) => sum + Number(lineTotal(line)),
    0,
  );
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  return { subtotalAmount: subtotal.toFixed(2), totalQuantity };
}
