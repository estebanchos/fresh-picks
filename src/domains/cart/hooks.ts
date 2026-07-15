"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { shopifyFetch } from "@/lib/shopify/client";

import { CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION } from "./mutations";
import { CART_QUERY } from "./queries";
import {
  cartCreateResponseSchema,
  cartLinesAddResponseSchema,
  cartResponseSchema,
  type Cart,
  type CartMutationPayload,
} from "./schema";

const CART_ID_KEY = "fresh-picks:cart-id";

function storedCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CART_ID_KEY);
}

function unwrap(payload: CartMutationPayload): Cart {
  if (payload.userErrors.length > 0) {
    throw new Error(
      `Cart mutation failed: ${payload.userErrors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!payload.cart) throw new Error("Cart mutation returned no cart");
  return payload.cart;
}

/** The current cart (null until the first add). */
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async (): Promise<Cart | null> => {
      const cartId = storedCartId();
      if (!cartId) return null;
      const data = cartResponseSchema.parse(
        await shopifyFetch(CART_QUERY, { cartId }),
      );
      return data.cart;
    },
  });
}

/** Adds a variant to the cart — cartCreate on first add, cartLinesAdd after. */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { variantId: string; quantity?: number }) => {
      const lines = [
        { merchandiseId: input.variantId, quantity: input.quantity ?? 1 },
      ];
      const cartId = storedCartId();

      if (!cartId) {
        const data = cartCreateResponseSchema.parse(
          await shopifyFetch(CART_CREATE_MUTATION, { lines }),
        );
        const cart = unwrap(data.cartCreate);
        window.localStorage.setItem(CART_ID_KEY, cart.id);
        return cart;
      }

      const data = cartLinesAddResponseSchema.parse(
        await shopifyFetch(CART_LINES_ADD_MUTATION, { cartId, lines }),
      );
      return unwrap(data.cartLinesAdd);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
    },
  });
}
