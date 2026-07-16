import { z } from "zod";

import { pageInfoSchema, productCardSchema } from "./schema";

/**
 * Service contract for GET /api/products — the shape OUR client consumes.
 * Versioned: breaking changes mean a v2 schema and a new literal, never a
 * silent mutation of v1. The route validates upstream data before mapping,
 * and the client re-parses this contract, so both sides fail loudly.
 */
export const PRODUCTS_CONTRACT_VERSION = "v1" as const;

export const productsPayloadV1Schema = z.object({
  version: z.literal(PRODUCTS_CONTRACT_VERSION),
  products: z.array(productCardSchema),
  pageInfo: pageInfoSchema,
});

export type ProductsPayloadV1 = z.infer<typeof productsPayloadV1Schema>;
