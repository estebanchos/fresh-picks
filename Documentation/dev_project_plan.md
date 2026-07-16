# Gap Project — "Fresh Picks" Headless Storefront
**Goal:** Close four posting gaps (Shopify, GraphQL depth, engineering-side experimentation, second observability tool) with one small, shippable project — and earn the right to say "Working" GraphQL and "basic familiarity" with Shopify out loud.

**Stack:** Next.js (App Router - server actions) + TypeScript · Shopify dev store + Storefront GraphQL API · TanStack Query · zod (service contract) · Vitest (TDD) · PostHog (A/B) · Sentry · Playwright (BDD-style e2e) · GitHub Actions + Vercel (CI/CD)
**Timebox:** one weekend, ~14 focused hours. Scope is a demo, not a product. If time-crunched, cut Milestone 2b (BFF) first; keep TDD and CI.
**Method note:** Use Claude Code as your pair throughout — write a proper CLAUDE.md for the repo, note where agent output needed correction, and treat CI as your verification boundary. That practices the posting's AI paragraph (context shaping, verifying, setting boundaries) in miniature.

---

## Milestone 1 — Shopify foundation (~1.5h)
- Create a free Shopify Partners account → create a development store.
- Add ~6 fake products (2–3 collections, images, prices) — food-themed for the HelloFresh nod.
- Enable headless/custom-app access and generate a **Storefront API access token**. Skim the Storefront API docs enough to understand the object model (products, collections, cart).
- ✅ Done when: you can run a products query successfully in Shopify's GraphiQL explorer.

## Milestone 2 — GraphQL client work (~3h)
- Scaffold the Next.js app. Write a thin typed GraphQL client (plain `fetch` to the Storefront endpoint is fine; no heavy SDK — more learning per hour).
- Queries: product list (with pagination via `first`/`after` cursors), product detail by handle, collection filter. Use **fragments** for shared product fields and **variables** throughout.
- Mutations: `cartCreate` and `cartLinesAdd` for a minimal cart.
- Wire TanStack Query on the client for caching/loading states — connects new (GraphQL) to known (your daily stack).
- ✅ Done when: browsable product grid → product page → add to cart works end to end.
- 📝 Learning log: write down 3–4 honest observations (e.g., cursor pagination vs REST offset, over/under-fetching, how fragments change component data ownership). These sentences ARE the interview answer.

## Milestone 2a — TDD the cart logic (~1.5h)
- Pick one pure-logic module: cart math (line totals, quantity updates, empty/edge states) or price formatting.
- Strict red-green-refactor with **Vitest**: write the failing test FIRST, implement minimally, refactor. No exceptions for this module — the discipline is the point.
- ✅ Done when: the module has 8–10 unit tests that existed before the code they test.
- 📝 Learning log: one honest sentence on where TDD helped and where it felt slow — that nuance is a senior answer.

## Milestone 2b — BFF endpoint + service contract (~1.5h) [CUT FIRST IF SHORT ON TIME]
- Add one Next.js API route as a thin backend-for-frontend: it calls the Storefront API, validates the response against a **zod schema**, and returns your own typed shape to the client.
- The zod schema is your **service contract** — version it, and write one integration test against the route.
- ✅ Done when: the client consumes your endpoint (not Shopify directly) for the product grid, and an invalid upstream response fails loudly.

## Milestone 3 — Experimentation (~2h)
- Add PostHog. Create one feature-flag-backed **A/B experiment**: hero CTA copy variant A/B on the landing page.
- Instrument exposure + conversion events (CTA click → add-to-cart).
- Let it collect your own test traffic; screenshot the experiment dashboard.
- ✅ Done when: you can explain assignment, exposure, and conversion tracking in one breath — as an engineer, not a PM.

## Milestone 4 — Observability, BDD-style e2e, CI/CD (~2.5h)
- Wire `@sentry/nextjs` (client + server). Throw one deliberate error, confirm capture, then fix it.
- One Playwright e2e written in **Given/When/Then** structure: given the landing page, when I open a product and add to cart, then the cart count updates. Read a 10-minute Gherkin primer so you can speak to BDD honestly ("I structure e2e specs given/when/then; I haven't run a full Cucumber setup").
- **GitHub Actions** workflow on every push: typecheck → lint → Vitest → Playwright. Vercel preview deployments per branch, auto-deploy on main = a real continuous-delivery pipeline to a customer-facing app.
- ✅ Done when: a PR with a failing test blocks itself, and merging to main deploys automatically.

## Milestone 5 — Ship + tell (~1h)
- Deploy to Vercel. Push to GitHub with a README stating what it is and what you learned (recruiters do click).
- Update claims: GraphQL → "Working" honestly; Shopify → "basic familiarity, built a headless dev-store storefront."
- Résumé (before technical round): add one line to Technical Projects, e.g. *"Fresh Picks — headless Shopify storefront (Next.js, Storefront GraphQL API, TanStack Query) with PostHog A/B experimentation and Sentry monitoring."* Ask Claude to slot it into the tailored docx.

## Out of scope (resist!)
Checkout/payments · auth/accounts · Shopify theme/Liquid work · multiple experiments · design polish beyond clean defaults · React Native version.

## Interview stories this unlocks
1. "Have you used Shopify?" → "Yes, at the basic-familiarity level — I built a headless storefront on the Storefront GraphQL API. The interesting part was [learning-log item]."
2. "GraphQL experience?" → cart mutations, cursor pagination, fragments — specifics, in first person.
3. "Experimentation?" → "Product-side for years at HSBC; I've since implemented one end-to-end myself — flag assignment, exposure events, conversion tracking in PostHog."
4. "TDD?" → "Strict red-green-refactor on my cart module recently, Jest/TDD at Title Collections before that — and honestly, here's where it helped and where it slowed me down: [learning-log item]."
5. "API design / service contracts?" → the zod-validated BFF route: "my schema is the contract; invalid upstream data fails loudly, and the integration test pins it."
6. "CI/CD?" → "Every push runs typecheck, lint, unit, and e2e; previews per branch; main auto-deploys. Same continuous-delivery motion I ran at Title Collections on Vercel."
7. "How do you work with AI agents?" → the repo's CLAUDE.md, where agent output needed correcting, CI as the verification boundary — a concrete, recent example of context shaping and bounded trust.
8. Ties directly to the posting sentence combining storefronts + GraphQL + experimentation — one project now answers all three, plus the testing and delivery asks around them.
