import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

/* Source-map upload only runs when SENTRY_AUTH_TOKEN is present (CI/Vercel);
 * locally this wrapper is inert. */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
});
