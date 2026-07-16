"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/** Root error boundary: reports render errors the App Router couldn't
 * recover from, then offers a reload. Must render its own <html>/<body>. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <button
            onClick={reset}
            className="mt-4 rounded-md bg-emerald-700 px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
