# CLAUDE.md — Fresh Picks

Headless Shopify storefront demo (Next.js App Router + TypeScript + Storefront
GraphQL API). Weekend-timeboxed gap project — a demo, not a product.

## Prime directives

### 1. Scope discipline
- Implement only what the current milestone in `Documentation/TASKS.md`
  requires.
- **Never** touch anything under the PRD's "Non-goals" (checkout/payments,
  auth/accounts, Shopify theme/Liquid, multiple experiments, design polish,
  React Native) without an explicit chat instruction.
- No speculative features or abstractions. If time-crunched, Milestone 2b (BFF)
  is cut first — never TDD or CI.

### 2. Latest docs over training memory
- For Shopify Storefront API, Next.js App Router, PostHog, and Sentry SDKs:
  query the official docs for anything newer than your training data, and
  conform to what the docs say — especially Storefront API versioning
  (`/api/<version>/graphql.json`) and cart mutations.
- **Banned:** Apollo Client or any heavy GraphQL SDK (the client is a thin
  typed `fetch` wrapper — that's the point); Next.js Pages Router patterns
  (`getServerSideProps`, `pages/`); Shopify Admin API (Storefront API only).

### 3. Secrets & privacy
- The Storefront API token and PostHog/Sentry keys live in `.env.local` only —
  never committed, never logged. `.env.example` documents required vars.
- No PII in PostHog events or Sentry breadcrumbs. Debug logging behind
  `process.env.NODE_ENV === 'development'`, off by default.

## Test-driven development (mandatory)
- The cart-logic module (Milestone 2a) is **strict red-green-refactor with
  Vitest**: failing test first → minimal implementation → refactor → full
  suite. No exceptions for this module.
- Elsewhere: new pure logic gets tests in the same commit; UI wiring may be
  verified via the Playwright e2e instead.
- The zod schema in the BFF route is the service contract — version it, and
  pin it with one integration test that fails loudly on invalid upstream data.
- e2e specs are written Given/When/Then (BDD structure, Playwright runner).

## Domain-driven design (code structure)
- Business logic lives in **domain modules** under `src/domains/` — `catalog`,
  `cart`, `experimentation`. Each domain owns its GraphQL documents, zod
  schemas/types, TanStack Query hooks, and pure logic. Speak the domain's
  language in names (line, quantity, handle, collection, variant, exposure).
- **Domain logic is framework-free**: `cart/logic.ts` imports nothing from
  React/Next — pure functions over domain types. That purity is the test seam.
- `app/` routes and components are thin consumers: presentation and wiring
  only, no business rules. Shared infrastructure (`lib/shopify`, `lib/posthog`)
  knows nothing about domains.
- Dependencies point inward: app → domains → lib. Never lib → domains or
  domains → app. Cross-domain imports go through each domain's public exports.

## Language & project conventions
- TypeScript strict; no `any` (use `unknown` + zod narrowing at boundaries).
- GraphQL: fragments for shared product fields, variables throughout, cursor
  pagination (`first`/`after`). Query documents live in their domain.
- Server Components by default; `"use client"` only where TanStack Query or
  interactivity requires it.
- Components ≤300 lines; data fetching separated from presentation.
- Errors at API boundaries fail loudly (throw on non-200 / zod parse failure) —
  no silent fallbacks.
- No new dependencies beyond the pinned stack (TanStack Query, zod, Vitest,
  Playwright, PostHog, @sentry/nextjs) without asking in chat.

## Workflow
- Branch per milestone: `milestone/m1-shopify`, `milestone/m2-graphql`,
  `milestone/m2a-cart-tdd`, `milestone/m2b-bff`, `milestone/m3-experiment`,
  `milestone/m4-ci-observability`, `milestone/m5-ship`. **Never commit to
  main** — merge via PR after CI passes and manual verification.
- Conventional commits: `feat:` / `fix:` / `test:` / `refactor:` / `docs:`.
  Tests land in the same commit as the code they cover.
- **Never** add "Co-Authored-By: Claude" (or any AI attribution) trailers to
  commit messages.
- CI (GitHub Actions) is the verification boundary: typecheck → lint →
  Vitest → Playwright on every push. A red pipeline blocks merge — don't
  ask to override it.
- 📝 After each milestone, prompt Carlos for his learning-log notes (they're
  the interview answers) — the log entries are his words, not yours.

## Read first
1. `Documentation/PRD.md` — the single source of truth: scope, Non-goals,
   architecture, success criteria. Read it fully before planning any work.
2. `Documentation/TASKS.md` — ordered milestones with [human]/[agent]/[pair]
   tags; work one milestone at a time.
3. `Documentation/dev_project_plan.md` — original plan; background on
   rationale and interview framing.
4. Next.js 16 breaks from training data: read the bundled guides in
   `node_modules/next/dist/docs/` before writing Next-specific code.
