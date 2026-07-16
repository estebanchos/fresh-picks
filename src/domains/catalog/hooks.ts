"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { shopifyFetch } from "@/lib/shopify/client";

import {
  productsPayloadV1Schema,
  type ProductsPayloadV1,
} from "./contract";
import { COLLECTIONS_QUERY, PRODUCT_BY_HANDLE_QUERY } from "./queries";
import {
  collectionsResponseSchema,
  productByHandleResponseSchema,
} from "./schema";

/** The grid consumes our BFF (service contract), not Shopify directly. */
async function fetchProductsPayload(
  collection: string | null,
  after: string | null,
): Promise<ProductsPayloadV1> {
  const params = new URLSearchParams();
  if (collection) params.set("collection", collection);
  if (after) params.set("after", after);
  const query = params.toString();

  const res = await fetch(`/api/products${query ? `?${query}` : ""}`);
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    const upstream =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${res.status}`;
    throw new Error(`Products BFF failed: ${upstream}`);
  }

  return productsPayloadV1Schema.parse(await res.json());
}

/** Cursor-paginated product list, optionally scoped to a collection. */
export function useProducts(collectionHandle: string | null) {
  return useInfiniteQuery({
    queryKey: ["catalog", "products", collectionHandle],
    queryFn: ({ pageParam }) =>
      fetchProductsPayload(collectionHandle, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : null,
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["catalog", "product", handle],
    queryFn: async () => {
      const data = productByHandleResponseSchema.parse(
        await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle }),
      );
      if (!data.product) throw new Error(`Product not found: ${handle}`);
      return data.product;
    },
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["catalog", "collections"],
    queryFn: async () => {
      const data = collectionsResponseSchema.parse(
        await shopifyFetch(COLLECTIONS_QUERY, { first: 10 }),
      );
      return data.collections.nodes;
    },
  });
}
