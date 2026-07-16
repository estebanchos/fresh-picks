import { beforeEach, describe, expect, it, vi } from "vitest";

import { productsPayloadV1Schema } from "@/domains/catalog/contract";

vi.mock("@/lib/shopify/client", () => ({
  shopifyFetch: vi.fn(),
}));

import { shopifyFetch } from "@/lib/shopify/client";

import { GET } from "./route";

const mockedShopifyFetch = vi.mocked(shopifyFetch);

const validUpstream = {
  products: {
    nodes: [
      {
        id: "gid://shopify/Product/1",
        title: "Chuck Roast - Beef Cuts",
        handle: "premium-beef-cuts",
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: "24.99", currencyCode: "USD" },
        },
      },
    ],
    pageInfo: { hasNextPage: false, endCursor: null },
  },
};

describe("GET /api/products", () => {
  beforeEach(() => {
    mockedShopifyFetch.mockReset();
  });

  it("returns a valid v1 payload for valid upstream data", async () => {
    mockedShopifyFetch.mockResolvedValue(validUpstream);

    const response = await GET(new Request("http://test/api/products"));

    expect(response.status).toBe(200);
    const payload = productsPayloadV1Schema.parse(await response.json());
    expect(payload.version).toBe("v1");
    expect(payload.products).toHaveLength(1);
  });

  it("fails loudly (502) when upstream data violates the schema", async () => {
    mockedShopifyFetch.mockResolvedValue({
      products: {
        // price arrives as a number instead of Shopify's decimal string —
        // exactly the kind of silent drift the contract must catch
        nodes: [
          {
            id: "gid://shopify/Product/1",
            title: "Chuck Roast - Beef Cuts",
            handle: "premium-beef-cuts",
            featuredImage: null,
            priceRange: { minVariantPrice: { amount: 24.99 } },
          },
        ],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    });

    const response = await GET(new Request("http://test/api/products"));

    expect(response.status).toBe(502);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBeTruthy();
  });
});
