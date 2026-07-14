import { z } from "zod";

export const cartSchema = z.object({
  id: z.string(),
  totalQuantity: z.number(),
  checkoutUrl: z.string(),
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
