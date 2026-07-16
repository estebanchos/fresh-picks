/** The hero CTA copy experiment — one flag, two variants.
 * The flag key and variant keys must match the PostHog experiment exactly. */

export const HERO_CTA_FLAG = "hero-cta-copy";

export const HERO_CTA_COPY: Record<string, string> = {
  control: "Browse fresh picks",
  test: "Get cooking tonight",
};

/** Copy for a variant key; unresolved/unknown variants fall back to control
 * so the page renders correctly with PostHog offline or the flag disabled. */
export function heroCtaCopy(variant: string | boolean | undefined): string {
  if (typeof variant === "string" && variant in HERO_CTA_COPY) {
    return HERO_CTA_COPY[variant];
  }
  return HERO_CTA_COPY.control;
}

/** Conversion event names (no PII in properties — ids and handles only). */
export const EVENT_HERO_CTA_CLICKED = "hero_cta_clicked";
export const EVENT_PRODUCT_ADDED_TO_CART = "product_added_to_cart";
