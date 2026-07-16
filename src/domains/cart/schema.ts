import { z } from "zod";

import type { CartLine } from "./logic";

const moneySchema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

const cartLineNodeSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  merchandise: z.object({
    id: z.string(),
    title: z.string(),
    price: moneySchema,
  }),
});

export const cartSchema = z.object({
  id: z.string(),
  totalQuantity: z.number(),
  checkoutUrl: z.string(),
  lines: z.object({ nodes: z.array(cartLineNodeSchema) }),
});

const userErrorSchema = z.object({
  field: z.array(z.string()).nullable(),
  message: z.string(),
});

const cartMutationPayloadSchema = z.object({
  cart: cartSchema.nullable(),
  userErrors: z.array(userErrorSchema),
});

export const cartCreateResponseSchema = z.object({
  cartCreate: cartMutationPayloadSchema,
});

export const cartLinesAddResponseSchema = z.object({
  cartLinesAdd: cartMutationPayloadSchema,
});

export const cartResponseSchema = z.object({
  cart: cartSchema.nullable(),
});

export type Cart = z.infer<typeof cartSchema>;
export type CartMutationPayload = z.infer<typeof cartMutationPayloadSchema>;

/** Maps the API's cart lines into the pure logic module's CartLine shape. */
export function toCartLines(cart: Cart): CartLine[] {
  return cart.lines.nodes.map((node) => ({
    merchandiseId: node.merchandise.id,
    title: node.merchandise.title,
    quantity: node.quantity,
    price: node.merchandise.price,
  }));
}
