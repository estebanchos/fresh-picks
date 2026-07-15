# TASKS — Fresh Picks

Ordered milestones; work one milestone at a time. Read `PRD.md` fully first.

Each task is tagged by who executes it:
- **[human]** — requires accounts, credentials, dashboards, or Carlos's own words
- **[agent]** — Claude Code can do it end to end
- **[pair]** — human drives the discipline/judgment, agent assists

Branch per milestone (`milestone/mN-shortname`), conventional commits, tests in
the same commit as the code. Never commit to main.

---

## Milestone 1 — Shopify foundation (~1.5h) — `milestone/m1-shopify`
- [x] [human] Create free Shopify Partners account → create a development store
- [x] [human] Add ~6 food-themed fake products across 2–3 collections (images, prices)
- [x] [human] Create a custom app, enable Storefront API access, generate the
      **Storefront API access token**; note the API version
- [x] [agent] Draft the products test query (with a shared product fragment) to
      run in Shopify's GraphiQL explorer
- [x] [human] Run the query in GraphiQL successfully; skim Storefront docs for
      the object model (products, collections, cart)

**✅ Done when:** products query returns real store data in GraphiQL.
**✅ COMPLETE (2026-07-14)** — via the Headless channel (legacy custom apps deprecated Jan 2026); verified with curl against `/api/2026-07/graphql.json`, 6 products returned.

## Milestone 2 — GraphQL client work (~3h) — `milestone/m2-graphql`
- [x] [agent] Scaffold Next.js app (App Router, TS strict); `.env.example` with
      `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`, API version
- [x] [human] Fill `.env.local` with real values (never committed)
- [x] [agent] `src/lib/shopify/` — thin typed GraphQL `fetch` client: endpoint
      construction, token header, throws loudly on non-200 and GraphQL errors
- [x] [agent] `src/domains/catalog/` — product fragment; product list query with
      `first`/`after` cursor pagination; product-by-handle query; collection
      filter query; zod schemas + inferred types
- [x] [agent] `src/domains/cart/mutations.ts` — `cartCreate` and `cartLinesAdd`
- [x] [agent] Wire TanStack Query: provider + per-domain hooks
      (`catalog/hooks.ts`, `cart/hooks.ts`) with loading/error states
- [x] [agent] UI (thin, in `app/`): product grid with pagination + collection
      filter → product detail page → add-to-cart button → cart count in header
- [x] [human] Manually verify grid → product page → add to cart end to end
- [x] [human] 📝 Learning log: 3–4 honest GraphQL observations (cursor vs offset
      pagination, over/under-fetching, fragments and component data ownership)

**✅ Done when:** browse → product → add to cart works end to end locally.
**✅ COMPLETE (2026-07-14)** — verified against the live dev store; also shipped: TanStack Query devtools, collection filter in URL search params.

## Milestone 2a — TDD the cart logic (~1.5h) — `milestone/m2a-cart-tdd`
- [ ] [pair] Confirm the module: cart math in `src/domains/cart/logic.ts`
      (line totals, quantity updates, empty/edge states) — pure, framework-free
- [ ] [pair] Strict red-green-refactor with Vitest: failing test FIRST →
      minimal implementation → refactor → full suite. One behavior at a time,
      8–10 tests total. **No exceptions for this module.**
- [ ] [agent] Wire the tested logic into the cart hooks/UI
- [ ] [human] 📝 Learning log: one honest sentence on where TDD helped and
      where it felt slow

**✅ Done when:** 8–10 unit tests exist that predate the code they test.

## Milestone 2b — BFF + service contract (~1.5h) — `milestone/m2b-bff`
**[CUT FIRST IF SHORT ON TIME]**
- [ ] [agent] Versioned zod schema for the product-grid payload — this is the
      service contract
- [ ] [agent] `app/api/products/` route: calls Storefront API, validates the
      upstream response against the schema, returns our own typed shape
- [ ] [agent] One integration test against the route: an invalid upstream
      response fails loudly
- [ ] [agent] Switch the product grid to consume `/api/products` instead of
      Shopify directly
- [ ] [human] Verify the failure mode (feed it a broken response; watch it fail
      loudly, not silently)

**✅ Done when:** grid consumes the BFF, and bad upstream data fails loudly.

## Milestone 3 — Experimentation (~2h) — `milestone/m3-experiment`
- [ ] [human] Create PostHog project; get project API key into `.env.local`
- [ ] [agent] `src/lib/posthog/` client init + provider (no PII in events)
- [ ] [human] Create the feature flag / experiment in the PostHog dashboard:
      hero CTA copy variant A/B
- [ ] [agent] `src/domains/experimentation/` — read the flag, render CTA
      variant, fire **exposure** event on assignment and **conversion** events
      (CTA click → add-to-cart)
- [ ] [human] Generate test traffic across both variants; let data collect
- [ ] [human] Screenshot the experiment dashboard
- [ ] [human] 📝 Check: can you explain assignment, exposure, and conversion
      tracking in one breath, as an engineer?

**✅ Done when:** dashboard shows exposures and conversions for both variants.

## Milestone 4 — Observability, e2e, CI/CD (~2.5h) — `milestone/m4-ci-observability`
- [ ] [human] Create Sentry project; DSN into env
- [ ] [agent] Wire `@sentry/nextjs` (client + server config)
- [ ] [agent] Throw one deliberate error → [human] confirm capture in the
      Sentry dashboard → [agent] fix it
- [ ] [human] Read a 10-minute Gherkin primer (so BDD claims stay honest)
- [ ] [agent] One Playwright e2e in Given/When/Then structure: **given** the
      landing page, **when** I open a product and add to cart, **then** the
      cart count updates
- [ ] [agent] GitHub Actions workflow on every push: typecheck → lint →
      Vitest → Playwright
- [ ] [human] Push repo to GitHub; connect to Vercel: preview deploys per
      branch, auto-deploy on main; add env vars in Vercel
- [ ] [pair] Prove the boundary: open a PR with a deliberately failing test →
      confirm it blocks itself → fix → merge → confirm auto-deploy

**✅ Done when:** a failing-test PR blocks itself and merging to main deploys.

## Milestone 5 — Ship + tell (~1h) — `milestone/m5-ship`
- [ ] [human] Final deploy check on the production Vercel URL
- [ ] [agent] Draft README: what it is, stack, how to run, learning-log section
      scaffolded
- [ ] [human] Fill the learning-log section in your own words (these are the
      interview answers — agent must not write them)
- [ ] [human] Update claims: GraphQL → "Working"; Shopify → "basic familiarity,
      built a headless dev-store storefront"
- [ ] [pair] Résumé: add the one-line Technical Projects entry and slot it into
      the tailored docx (before the technical round)

**✅ Done when:** public repo + live URL + honest README + updated résumé line.
