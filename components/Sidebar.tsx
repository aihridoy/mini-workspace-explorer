"use client";

import { FolderIcon } from "@/components/Icons";
import { TreeNode } from "@/components/TreeNode";
import { getChildren, ROOT_NAME } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";

interface SidebarProps {
  onNavigate: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { state, dispatch } = useWorkspace();
  const rootItems = getChildren(state.items, null);
  const isRootActive = state.selectedFolderId === null;

  return (
    <nav aria-label="Workspace tree" className="p-2">
      <button
        type="button"
        onClick={() => {
          dispatch({ type: "SELECT_FOLDER", id: null });
          onNavigate();
        }}
        aria-current={isRootActive ? "true" : undefined}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-semibold ${
          isRootActive
            ? "bg-blue-100 text-blue-900"
            : "text-zinc-800 hover:bg-zinc-200/70"
        }`}
      >
        <FolderIcon className="size-4 shrink-0 text-amber-500" />
        {ROOT_NAME}
      </button>

      {rootItems.length === 0 ? (
        <p className="px-2 py-3 text-sm text-zinc-500">No items yet.</p>
      ) : (
        <ul className="mt-1">
          {rootItems.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              depth={1}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}
