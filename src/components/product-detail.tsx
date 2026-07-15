"use client";

import Image from "next/image";

import { formatMoney } from "@/domains/catalog/format";
import { useProduct } from "@/domains/catalog/hooks";

import { AddToCartButton } from "./add-to-cart-button";

export function ProductDetail({ handle }: { handle: string }) {
  const { data: product, error, isPending } = useProduct(handle);

  if (isPending) {
    return <p className="p-10 text-neutral-500">Loading product…</p>;
  }
  if (error) {
    return (
      <p role="alert" className="p-10 text-red-700">
        Failed to load product: {error.message}
      </p>
    );
  }

  const variant = product.variants.nodes[0];

  return (
    <article className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:grid-cols-2">
      {product.featuredImage ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          width={600}
          height={600}
          className="aspect-square w-full rounded-lg object-cover"
          priority
        />
      ) : (
        <div className="aspect-square w-full rounded-lg bg-neutral-100" />
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
        <p className="mt-2 text-xl text-neutral-700">
          {formatMoney(product.priceRange.minVariantPrice)}
        </p>
        {product.description && (
          <p className="mt-4 text-neutral-600">{product.description}</p>
        )}
        <div className="mt-8">
          {variant ? (
            <AddToCartButton
              variantId={variant.id}
              available={variant.availableForSale}
            />
          ) : (
            <p className="text-neutral-500">Unavailable</p>
          )}
        </div>
      </div>
    </article>
  );
}
