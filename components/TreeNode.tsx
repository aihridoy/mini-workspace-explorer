"use client";

import { ChevronRightIcon, FileIcon, FolderIcon } from "@/components/Icons";
import { getChildren } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";
import type { Item } from "@/types";

interface TreeNodeProps {
  item: Item;
  depth: number;
  onNavigate: () => void;
}

export function TreeNode({ item, depth, onNavigate }: TreeNodeProps) {
  const { state, dispatch } = useWorkspace();
  const isFolder = item.type === "folder";
  const isOpen = isFolder && Boolean(state.expanded[item.id]);
  const isActive = isFolder
    ? state.selectedFolderId === item.id
    : state.openFileId === item.id;
  const children = isFolder ? getChildren(state.items, item.id) : [];
  const hasChildren = children.length > 0;

  const handleSelect = () => {
    dispatch(
      isFolder
        ? { type: "SELECT_FOLDER", id: item.id }
        : { type: "OPEN_FILE", id: item.id },
    );
    onNavigate();
  };

  return (
    <li>
      <div
        className={`flex items-center rounded-md pr-2 text-sm ${
          isActive
            ? "bg-blue-100 text-blue-900"
            : "text-zinc-700 hover:bg-zinc-200/70"
        }`}
        style={{ paddingLeft: depth * 12 }}
      >
        {isFolder && hasChildren ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_EXPAND", id: item.id })}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.name}`}
            aria-expanded={isOpen}
            className="grid size-6 shrink-0 place-items-center rounded text-zinc-500 hover:text-zinc-900"
          >
            <ChevronRightIcon
              className={`size-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="size-6 shrink-0" />
        )}
        <button
          type="button"
          onClick={handleSelect}
          aria-current={isActive ? "true" : undefined}
          className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left"
        >
          {isFolder ? (
            <FolderIcon className="size-4 shrink-0 text-amber-500" />
          ) : (
            <FileIcon className="size-4 shrink-0 text-zinc-400" />
          )}
          <span className="truncate">{item.name}</span>
        </button>
      </div>

      {isOpen && hasChildren && (
        <ul>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
