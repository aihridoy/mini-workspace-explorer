"use client";

import { CloseIcon, SearchIcon } from "@/components/Icons";

interface SearchBoxProps {
  query: string;
  onChange: (query: string) => void;
}

export function SearchBox({ query, onChange }: SearchBoxProps) {
  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xs">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onChange("");
        }}
        placeholder="Search workspace"
        aria-label="Search workspace"
        className="w-full rounded-md border border-zinc-300 py-1.5 pr-8 pl-8 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:hidden"
      />
      {query !== "" && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 grid size-6 -translate-y-1/2 place-items-center rounded text-zinc-400 hover:text-zinc-700"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
