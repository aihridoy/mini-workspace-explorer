"use client";

import { useMemo } from "react";
import { FileIcon, FolderIcon } from "@/components/Icons";
import { searchItems } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";

interface SearchResultsProps {
  query: string;
  onNavigate: () => void;
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  const start = name.toLowerCase().indexOf(query.toLowerCase());
  if (start === -1) return <>{name}</>;
  const end = start + query.length;

  return (
    <>
      {name.slice(0, start)}
      <mark className="bg-yellow-200 text-inherit">
        {name.slice(start, end)}
      </mark>
      {name.slice(end)}
    </>
  );
}

export function SearchResults({ query, onNavigate }: SearchResultsProps) {
  const { state, dispatch } = useWorkspace();
  const results = useMemo(
    () => searchItems(state.items, query),
    [state.items, query],
  );

  if (results.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500">
        No items match &ldquo;{query.trim()}&rdquo;.
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-sm text-zinc-500">
        {results.length} {results.length === 1 ? "result" : "results"} for
        &ldquo;{query.trim()}&rdquo;
      </p>
      <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200">
        {results.map(({ item, location }) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                dispatch(
                  item.type === "folder"
                    ? { type: "SELECT_FOLDER", id: item.id }
                    : { type: "OPEN_FILE", id: item.id },
                );
                onNavigate();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50"
            >
              {item.type === "folder" ? (
                <FolderIcon className="size-5 shrink-0 text-amber-500" />
              ) : (
                <FileIcon className="size-5 shrink-0 text-zinc-400" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  <HighlightedName name={item.name} query={query.trim()} />
                </span>
                <span className="block truncate text-xs text-zinc-500">
                  {location}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
