/**
 * Thin typed GraphQL client for the Shopify Storefront API.
 * Plain fetch on purpose — no SDK. Knows nothing about domains.
 */

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

type GraphQLResponse = {
  data?: unknown;
  errors?: Array<{ message: string }>;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new ShopifyError(
      `Missing env var ${name} — copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

function endpoint(): string {
  const domain = requireEnv(
    "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  );
  const version = requireEnv(
    "NEXT_PUBLIC_SHOPIFY_API_VERSION",
    process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  );
  return `https://${domain}/api/${version}/graphql.json`;
}

/**
 * Executes a Storefront API query/mutation. Fails loudly: throws ShopifyError
 * on HTTP errors and on GraphQL-level errors. Callers own response parsing
 * (zod) — this returns the raw `data` as unknown.
 */
export async function shopifyFetch(
  query: string,
  variables?: Record<string, unknown>,
): Promise<unknown> {
  const token = requireEnv(
    "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN",
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  );

  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new ShopifyError(
      `Storefront API HTTP ${res.status} ${res.statusText}`,
      await res.text().catch(() => undefined),
    );
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors?.length) {
    throw new ShopifyError(
      `Storefront API GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`,
      json.errors,
    );
  }
  if (json.data === undefined || json.data === null) {
    throw new ShopifyError("Storefront API returned no data");
  }

  return json.data;
}
