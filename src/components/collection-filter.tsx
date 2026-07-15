"use client";

import { useCollections } from "@/domains/catalog/hooks";

type Props = {
  selected: string | null;
  onSelect: (handle: string | null) => void;
};

export function CollectionFilter({ selected, onSelect }: Props) {
  const { data: collections } = useCollections();

  if (!collections?.length) return null;

  const baseClass = "rounded-full border px-4 py-1.5 text-sm transition";
  const activeClass = "border-emerald-700 bg-emerald-700 text-white";
  const idleClass = "border-neutral-300 hover:border-emerald-700";

  return (
    <nav aria-label="Collections" className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`${baseClass} ${selected === null ? activeClass : idleClass}`}
      >
        All
      </button>
      {collections.map((collection) => (
        <button
          key={collection.id}
          onClick={() => onSelect(collection.handle)}
          className={`${baseClass} ${selected === collection.handle ? activeClass : idleClass}`}
        >
          {collection.title}
        </button>
      ))}
    </nav>
  );
}
