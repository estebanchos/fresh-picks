# PRD — Fresh Picks

> **Read this fully before creating any plans or assigning work to sub-agents.**
> This PRD is the single source of truth. It distills and supersedes the
> narrative in `dev_project_plan.md` for planning purposes; that file remains
> the reference for milestone rationale and interview framing.

## One-sentence summary
A headless Shopify storefront demo — Next.js App Router + Storefront GraphQL
API with a TDD'd cart, one PostHog A/B experiment, Sentry monitoring, and a
full CI/CD pipeline — built in one weekend (~14h) to close four job-posting
gaps.

## Why
Close four posting gaps with one small, shippable project: Shopify, GraphQL
depth, engineering-side experimentation, and a second observability tool.
The deliverable is equal parts working demo and honest interview material —
the learning-log entries produced along the way ARE the interview answers.

## Target user
- **Primary:** Carlos, in a technical interview, speaking in first person
  about specifics (cursor pagination, cart mutations, flag assignment,
  exposure/conversion events, service contracts).
- **Secondary:** recruiters/interviewers clicking the GitHub README and the
  deployed Vercel URL.

## Core flows
1. **Browse:** landing page → product grid (cursor-paginated) → filter by
   collection.
2. **Product:** grid → product detail page by handle.
3. **Cart:** product page → add to cart (`cartCreate` / `cartLinesAdd`) →
   cart count updates.
4. **Experiment:** visitor is assigned hero CTA variant A/B → exposure event
   fires → CTA click and add-to-cart fire conversion events.

## Non-goals (honored by all later work)
- Checkout / payments
- Auth / customer accounts
- Shopify theme / Liquid work
- More than one experiment
- Design polish beyond clean defaults
- React Native version

Nothing on this list gets built without an explicit chat instruction.
If time-crunched, Milestone 2b (BFF) is cut first; TDD and CI are never cut.

## Tech stack (pinned)
Next.js (App Router, server actions) · TypeScript strict · Shopify dev store +
Storefront GraphQL API · TanStack Query · zod (service contract) · Vitest
(TDD) · PostHog (A/B) · @sentry/nextjs · Playwright (BDD-style e2e) ·
GitHub Actions + Vercel (CI/CD).

Deliberate deviations from the house default web stack: no Prisma (no own
database — Shopify is the backend), no Clerk (auth is a non-goal), no heavy
GraphQL SDK (thin typed `fetch` client — more learning per hour).

## System architecture sketch
Code is structured **domain-driven**: business logic lives in framework-free
domain modules; routes and components are thin consumers.

```
src/
  domains/
    catalog/        # products, collections
      queries.ts    #   GraphQL documents (fragments, variables, cursors)
      schema.ts     #   zod schemas + inferred types
      hooks.ts      #   TanStack Query hooks
    cart/           # cart domain
      logic.ts      #   PURE cart math — the TDD module (no imports from React/Next)
      logic.test.ts #   Vitest, written test-first
      mutations.ts  #   cartCreate / cartLinesAdd documents
      hooks.ts
    experimentation/ # flag access + exposure/conversion event helpers
  lib/
    shopify/        # thin typed GraphQL fetch client (endpoint, token, errors)
    posthog/        # client init
  app/              # App Router routes — presentation + wiring only
    api/products/   # (M2b) BFF route: fetch → zod-validate → own typed shape
e2e/                # Playwright specs, Given/When/Then structure
.github/workflows/  # CI: typecheck → lint → Vitest → Playwright
```

Request flow: client components → TanStack Query hooks → domain queries →
`lib/shopify` client → Storefront API. With M2b, the product grid instead
consumes `/api/products`, whose zod schema is the versioned service contract —
invalid upstream data fails loudly.

Test seams: `cart/logic.ts` is pure (unit-testable with zero mocks); the
BFF route is integration-tested against its contract; the user journey is
pinned by one Playwright e2e.

## Success criteria
1. Browsable grid → product page → add to cart works end to end on the
   deployed Vercel URL.
2. Cart module has 8–10 Vitest unit tests that existed before the code.
3. PostHog dashboard shows the A/B experiment with exposure and conversion
   data from real test traffic (screenshot captured).
4. Sentry captured one deliberate error (client or server) that was then fixed.
5. A PR with a failing test blocks itself; merging to main auto-deploys.
6. Learning log has honest entries for GraphQL (3–4), TDD (1), and
   experimentation — written by Carlos, in his words.
7. README states what it is and what was learned; résumé gains one
   Technical Projects line.
