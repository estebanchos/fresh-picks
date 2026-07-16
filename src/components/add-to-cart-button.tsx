"use client";

import { useAddToCart } from "@/domains/cart/hooks";
import { useTrackAddToCart } from "@/domains/experimentation/hooks";

type Props = {
  variantId: string;
  available: boolean;
};

export function AddToCartButton({ variantId, available }: Props) {
  const addToCart = useAddToCart();
  const trackAddToCart = useTrackAddToCart();

  return (
    <div>
      <button
        data-testid="add-to-cart"
        onClick={() =>
          addToCart.mutate(
            { variantId },
            { onSuccess: () => trackAddToCart({ merchandiseId: variantId }) },
          )
        }
        disabled={!available || addToCart.isPending}
        className="rounded-md bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
      >
        {!available
          ? "Sold out"
          : addToCart.isPending
            ? "Adding…"
            : "Add to cart"}
      </button>
      {addToCart.isError && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {addToCart.error.message}
        </p>
      )}
      {addToCart.isSuccess && (
        <p className="mt-2 text-sm text-emerald-700">Added to cart ✓</p>
      )}
    </div>
  );
}
