import { shopifyFetch } from "@/lib/shopify/client";

import {
  PRODUCTS_CONTRACT_VERSION,
  type ProductsPayloadV1,
} from "./contract";
import { COLLECTION_PRODUCTS_QUERY, PRODUCTS_QUERY } from "./queries";
import {
  collectionProductsResponseSchema,
  productsResponseSchema,
  type ProductPage,
} from "./schema";

export const PAGE_SIZE = 6;

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

/** Server-side: fetch from Shopify, validate upstream against our zod
 * schemas (throws on drift), and map into the versioned contract shape. */
export async function getProductsPayload(params: {
  collection: string | null;
  after: string | null;
}): Promise<ProductsPayloadV1> {
  const page = await fetchProductPage(params.collection, params.after);
  return {
    version: PRODUCTS_CONTRACT_VERSION,
    products: page.nodes,
    pageInfo: page.pageInfo,
  };
}
