import { describe, expect, it } from "vitest";

import { summarizeCart } from "./logic";

/** TEMPORARY (M4): deliberately failing test to prove a red pipeline blocks
 * the PR. Reverted in the next commit once the block is witnessed. */
describe("CI boundary proof", () => {
  it("fails on purpose so the pipeline goes red", () => {
    expect(summarizeCart([]).subtotalAmount).toBe("999.99");
  });
});
