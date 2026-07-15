import { Suspense } from "react";

import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* useSearchParams inside ProductGrid requires a Suspense boundary
          for static prerendering */}
      <Suspense>
        <ProductGrid />
      </Suspense>
    </>
  );
}
