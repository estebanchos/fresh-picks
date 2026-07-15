import Link from "next/link";

import { CartCount } from "./cart-count";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          🥬 Fresh Picks
        </Link>
        <CartCount />
      </div>
    </header>
  );
}
