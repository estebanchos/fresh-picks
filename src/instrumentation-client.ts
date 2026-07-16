import * as Sentry from "@sentry/nextjs";

import { initPostHog } from "@/lib/posthog/client";
import { sentryOptions } from "@/lib/sentry/config";

initPostHog();

Sentry.init(sentryOptions);

/** Instruments App Router navigations for tracing. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
