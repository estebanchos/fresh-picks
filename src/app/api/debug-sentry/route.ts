/** TEMPORARY (M4): deliberate server error to verify Sentry capture.
 * Removed once capture is confirmed in the dashboard. */
export function GET() {
  throw new Error("Sentry verification: deliberate server error (M4)");
}
