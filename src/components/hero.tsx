/* Hero CTA — copy becomes the PostHog A/B variant in Milestone 3. */
export function Hero() {
  return (
    <section className="bg-emerald-50 py-14 text-center">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900">
          Fresh ingredients, picked for you
        </h1>
        <p className="mt-3 text-emerald-800">
          A headless storefront demo — browse, pick, add to cart.
        </p>
        <a
          href="#products"
          data-testid="hero-cta"
          className="mt-6 inline-block rounded-md bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800"
        >
          Browse fresh picks
        </a>
      </div>
    </section>
  );
}
