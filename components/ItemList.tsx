"use client";

import { FileIcon, FolderIcon } from "@/components/Icons";
import { getChildren } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";
import type { Item } from "@/types";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

interface ItemListProps {
  items: Item[];
}

export function ItemList({ items }: ItemListProps) {
  const { state, dispatch } = useWorkspace();

  const describe = (item: Item) => {
    if (item.type === "file") {
      return `Edited ${dateFormat.format(item.updatedAt)}`;
    }
    const count = getChildren(state.items, item.id).length;
    return count === 1 ? "1 item" : `${count} items`;
  };

  return (
    <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() =>
              dispatch(
                item.type === "folder"
                  ? { type: "SELECT_FOLDER", id: item.id }
                  : { type: "OPEN_FILE", id: item.id },
              )
            }
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50"
          >
            {item.type === "folder" ? (
              <FolderIcon className="size-5 shrink-0 text-amber-500" />
            ) : (
              <FileIcon className="size-5 shrink-0 text-zinc-400" />
            )}
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {item.name}
            </span>
            <span className="shrink-0 text-xs text-zinc-500">
              {describe(item)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
