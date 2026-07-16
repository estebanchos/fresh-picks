import { getProductsPayload } from "@/domains/catalog/bff";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const payload = await getProductsPayload({
      collection: searchParams.get("collection"),
      after: searchParams.get("after"),
    });
    return Response.json(payload);
  } catch (error) {
    // Fail loudly: invalid upstream data or Shopify errors become an
    // explicit 502, never a silently empty grid.
    const message =
      error instanceof Error ? error.message : "Upstream request failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
