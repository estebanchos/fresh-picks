import Image from "next/image";
import Link from "next/link";

import { formatMoney } from "@/domains/catalog/format";
import type { ProductCard as ProductCardData } from "@/domains/catalog/schema";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      data-testid="product-card"
      className="group rounded-lg border border-neutral-200 p-4 transition hover:shadow-md"
    >
      {product.featuredImage ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          width={400}
          height={400}
          className="aspect-square w-full rounded-md object-cover"
        />
      ) : (
        <div className="aspect-square w-full rounded-md bg-neutral-100" />
      )}
      <h3 className="mt-3 font-medium group-hover:underline">
        {product.title}
      </h3>
      <p className="text-sm text-neutral-600">
        {formatMoney(product.priceRange.minVariantPrice)}
      </p>
    </Link>
  );
}
