import { describe, expect, it } from "vitest";

import { HERO_CTA_COPY, heroCtaCopy } from "./hero-cta";

describe("heroCtaCopy", () => {
  it("returns the mapped copy for a known variant", () => {
    expect(heroCtaCopy("test")).toBe(HERO_CTA_COPY.test);
    expect(heroCtaCopy("control")).toBe(HERO_CTA_COPY.control);
  });

  it("falls back to control when the flag is unresolved", () => {
    expect(heroCtaCopy(undefined)).toBe(HERO_CTA_COPY.control);
  });

  it("falls back to control for boolean or unknown variants", () => {
    expect(heroCtaCopy(true)).toBe(HERO_CTA_COPY.control);
    expect(heroCtaCopy("nonexistent-variant")).toBe(HERO_CTA_COPY.control);
  });
});
