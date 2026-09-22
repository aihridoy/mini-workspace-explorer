"use client";

import { ChevronRightIcon } from "@/components/Icons";
import { getPath, ROOT_NAME } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";

export function Breadcrumb() {
  const { state, dispatch } = useWorkspace();
  const path = getPath(state.items, state.openFileId ?? state.selectedFolderId);
  const crumbs = [
    { id: null, name: ROOT_NAME },
    ...path.map((item) => ({ id: item.id, name: item.name })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li
              key={crumb.id ?? "root"}
              className="flex min-w-0 items-center gap-1"
            >
              {index > 0 && (
                <ChevronRightIcon className="size-3.5 shrink-0 text-zinc-400" />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="truncate font-medium text-zinc-900"
                >
                  {crumb.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "SELECT_FOLDER", id: crumb.id })
                  }
                  className="truncate rounded text-zinc-500 hover:text-zinc-900 hover:underline"
                >
                  {crumb.name}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
