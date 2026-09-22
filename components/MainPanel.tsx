"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { EmptyState } from "@/components/EmptyState";
import { ItemList } from "@/components/ItemList";
import { getChildren } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";

export function MainPanel() {
  const { state } = useWorkspace();
  const file = state.openFileId ? state.items[state.openFileId] : undefined;
  const children = getChildren(state.items, state.selectedFolderId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-12 items-center border-b border-zinc-200 px-4 py-2 sm:px-6">
        <Breadcrumb />
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {file ? (
          <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm">
            {file.content}
          </pre>
        ) : children.length > 0 ? (
          <ItemList items={children} />
        ) : (
          <EmptyState isRoot={state.selectedFolderId === null} />
        )}
      </div>
    </div>
  );
}
