/** Shared Sentry init options. DSN comes from env; without it the SDK stays
 * disabled, so the app runs fine before the Sentry project exists.
 * No PII: default integrations only, no user identification. */
export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Demo project: sample everything so the dashboard has data to show.
  tracesSampleRate: 1.0,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
};
