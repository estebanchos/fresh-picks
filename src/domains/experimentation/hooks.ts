"use client";

import { useFeatureFlagVariantKey, usePostHog } from "@posthog/react";

import {
  EVENT_HERO_CTA_CLICKED,
  EVENT_PRODUCT_ADDED_TO_CART,
  HERO_CTA_FLAG,
  heroCtaCopy,
} from "./hero-cta";

/** Hero CTA experiment: reading the variant fires the exposure event
 * ($feature_flag_called) automatically; the click is the first conversion. */
export function useHeroCta() {
  const posthog = usePostHog();
  const variant = useFeatureFlagVariantKey(HERO_CTA_FLAG);

  return {
    copy: heroCtaCopy(variant),
    trackCtaClick: () => {
      posthog?.capture(EVENT_HERO_CTA_CLICKED, { variant: variant ?? null });
    },
  };
}

/** Second conversion step of the funnel: CTA click → add to cart. */
export function useTrackAddToCart() {
  const posthog = usePostHog();

  return (properties: { merchandiseId: string }) => {
    posthog?.capture(EVENT_PRODUCT_ADDED_TO_CART, {
      merchandise_id: properties.merchandiseId,
    });
  };
}
