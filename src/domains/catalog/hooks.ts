"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { shopifyFetch } from "@/lib/shopify/client";

import {
  COLLECTIONS_QUERY,
  COLLECTION_PRODUCTS_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
} from "./queries";
import {
  collectionProductsResponseSchema,
  collectionsResponseSchema,
  productByHandleResponseSchema,
  productsResponseSchema,
  type ProductPage,
} from "./schema";

const PAGE_SIZE = 6;

async function fetchProductPage(
  collectionHandle: string | null,
  after: string | null,
): Promise<ProductPage> {
  if (collectionHandle) {
    const data = collectionProductsResponseSchema.parse(
      await shopifyFetch(COLLECTION_PRODUCTS_QUERY, {
        handle: collectionHandle,
        first: PAGE_SIZE,
        after,
      }),
    );
    if (!data.collection) {
      throw new Error(`Collection not found: ${collectionHandle}`);
    }
    return data.collection.products;
  }

  const data = productsResponseSchema.parse(
    await shopifyFetch(PRODUCTS_QUERY, { first: PAGE_SIZE, after }),
  );
  return data.products;
}

/** Cursor-paginated product list, optionally scoped to a collection. */
export function useProducts(collectionHandle: string | null) {
  return useInfiniteQuery({
    queryKey: ["catalog", "products", collectionHandle],
    queryFn: ({ pageParam }) => fetchProductPage(collectionHandle, pageParam),
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
