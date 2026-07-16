import posthog from "posthog-js";

/** Initializes PostHog (no-op without a key, so the app runs fine before
 * the project is configured). No PII: we only capture flag exposures and
 * anonymous funnel events. */
export function initPostHog(): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog disabled: NEXT_PUBLIC_POSTHOG_KEY not set");
    }
    return;
  }

  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    defaults: "2026-05-30",
    debug: process.env.NODE_ENV === "development",
  });
}

export { posthog };
