"use client";

import { useState } from "react";

import { useProducts } from "@/domains/catalog/hooks";

import { CollectionFilter } from "./collection-filter";
import { ProductCard } from "./product-card";

export function ProductGrid() {
  const [collection, setCollection] = useState<string | null>(null);
  const {
    data,
    error,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useProducts(collection);

  return (
    <section id="products" className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <CollectionFilter selected={collection} onSelect={setCollection} />
      </div>

      {isPending && <p className="text-neutral-500">Loading products…</p>}
      {error && (
        <p role="alert" className="text-red-700">
          Failed to load products: {error.message}
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.pages
              .flatMap((page) => page.nodes)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
          {hasNextPage && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-md border border-emerald-700 px-6 py-2 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
