# 🥬 Fresh Picks

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Shopify](https://img.shields.io/badge/Shopify-Storefront%20API-96BF48?logo=shopify&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A headless Shopify storefront: browse a cursor-paginated product grid, filter
by collection, open a product page, and add to cart, all against the Shopify
Storefront GraphQL API. Built with the Next.js App Router, TypeScript strict,
TanStack Query, and zod validation at every API boundary.

> **Why build this?** A weekend-timeboxed learning project: real Shopify and
> GraphQL work end to end, with a deliberately thin `fetch` client instead of a
> GraphQL SDK. Writing the queries, fragments, cursors, and cart mutations by
> hand is the point.

## 🚧 Roadmap

Built milestone by milestone over a weekend. Current state:

- ✅ **Shopify foundation.** Dev store with food-themed products, Headless
  channel, Storefront API token verified in GraphiQL.
- ✅ **GraphQL client work.** Typed `fetch` client, catalog queries with
  fragments and cursor pagination, cart mutations, TanStack Query wiring,
  browse-to-cart flow working end to end.
- ⏳ **TDD'd cart logic.** Pure cart math module written strict
  red-green-refactor with Vitest.
- ⏳ **BFF + service contract.** A `/api/products` route that validates the
  upstream response against a versioned zod schema and fails loudly.
- ⏳ **A/B experimentation.** One PostHog feature-flag experiment (hero CTA
  copy) with exposure and conversion events.
- ⏳ **Observability + CI/CD.** Sentry, a Given/When/Then Playwright e2e, and a
  GitHub Actions pipeline (typecheck, lint, unit, e2e) with Vercel deploys.

## Features

- 🛍️ **Cursor-paginated product grid.** `first`/`after` pagination with a
  shared product fragment and variables throughout.
- 🏷️ **Collection filter.** Filter the grid by collection, with the selection
  reflected in the URL search params.
- 📄 **Product detail by handle.** Grid to product page with variant pricing.
- 🛒 **Minimal cart.** `cartCreate` / `cartLinesAdd` mutations with a live
  cart count in the header.
- 🔌 **Thin typed GraphQL client.** A plain `fetch` wrapper, no SDK: endpoint
  construction, token header, and loud errors on non-200 responses or GraphQL
  errors.
- 🧩 **Domain-driven structure.** Business logic lives in framework-free
  domain modules (`catalog`, `cart`); routes and components are thin
  consumers; zod narrows `unknown` at every boundary.

## Tech Stack

| Layer      | Technology                                           |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19, TypeScript 5      |
| Backend    | Shopify dev store, Storefront GraphQL API (2026-07)  |
| Data layer | TanStack Query 5, thin typed `fetch` client          |
| Validation | Zod 4 (schemas + inferred types at boundaries)       |
| UI         | Tailwind CSS 4                                       |
| Testing    | Vitest 4 (Playwright e2e planned)                    |

## Getting Started

### Prerequisites

- Node.js 20+
- A Shopify development store with the Headless channel enabled and a
  Storefront API access token ([docs](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started))

### Run locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local   # then fill in your store domain and token

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse the storefront.
See [`.env.example`](./.env.example) for the required variables; the
Storefront token is a public token by design.

Other scripts: `npm run test` (Vitest), `npm run typecheck`, `npm run lint`.

## How It Works

1. Client components call TanStack Query hooks owned by each domain
   (`src/domains/catalog/hooks.ts`, `src/domains/cart/hooks.ts`).
2. Hooks execute GraphQL documents (fragments, variables, cursors) through the
   thin client in `src/lib/shopify/`, which posts to
   `/api/<version>/graphql.json` and throws on any non-200 or GraphQL error.
3. Responses are parsed with zod schemas in each domain; invalid data fails
   loudly instead of rendering silently wrong.
4. Dependencies point inward: `app/` → `domains/` → `lib/`. Domain logic
   imports nothing from React or Next, which keeps it unit-testable with zero
   mocks.

## License

[MIT](./LICENSE)
