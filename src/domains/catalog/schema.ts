import { z } from "zod";

/** zod schemas narrow the Storefront API's responses at the domain boundary —
 * unexpected shapes fail loudly at parse time, not deep in a component. */

export const moneySchema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const imageSchema = z.object({
  url: z.string(),
  altText: z.string().nullable(),
});

export const productCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  featuredImage: imageSchema.nullable(),
  priceRange: z.object({
    minVariantPrice: moneySchema,
  }),
});

export const variantSchema = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  price: moneySchema,
});

export const productDetailSchema = productCardSchema.extend({
  description: z.string(),
  variants: z.object({
    nodes: z.array(variantSchema),
  }),
});

export const pageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  endCursor: z.string().nullable(),
});

export const productConnectionSchema = z.object({
  nodes: z.array(productCardSchema),
  pageInfo: pageInfoSchema,
});

export const collectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
});

/** Full response shapes, one per query document. */
export const productsResponseSchema = z.object({
  products: productConnectionSchema,
});

export const collectionProductsResponseSchema = z.object({
  collection: z
    .object({ products: productConnectionSchema })
    .nullable(),
});

export const productByHandleResponseSchema = z.object({
  product: productDetailSchema.nullable(),
});

export const collectionsResponseSchema = z.object({
  collections: z.object({ nodes: z.array(collectionSchema) }),
});

export type Money = z.infer<typeof moneySchema>;
export type ProductCard = z.infer<typeof productCardSchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
export type ProductVariant = z.infer<typeof variantSchema>;
export type ProductPage = z.infer<typeof productConnectionSchema>;
export type Collection = z.infer<typeof collectionSchema>;
