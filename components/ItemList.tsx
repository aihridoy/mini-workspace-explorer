"use client";

import {
  FileIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/Icons";
import { getChildren } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";
import type { Item } from "@/types";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

interface ItemListProps {
  items: Item[];
  onRename: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemList({ items, onRename, onDelete }: ItemListProps) {
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
        <li key={item.id} className="group flex items-center hover:bg-zinc-50">
          <button
            type="button"
            onClick={() =>
              dispatch(
                item.type === "folder"
                  ? { type: "SELECT_FOLDER", id: item.id }
                  : { type: "OPEN_FILE", id: item.id },
              )
            }
            className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left"
          >
            {item.type === "folder" ? (
              <FolderIcon className="size-5 shrink-0 text-amber-500" />
            ) : (
              <FileIcon className="size-5 shrink-0 text-zinc-400" />
            )}
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {item.name}
            </span>
            <span className="hidden shrink-0 text-xs text-zinc-500 sm:inline">
              {describe(item)}
            </span>
          </button>
          <div className="flex shrink-0 gap-1 pr-2">
            <button
              type="button"
              onClick={() => onRename(item)}
              aria-label={`Rename ${item.name}`}
              className="grid size-8 place-items-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800"
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              aria-label={`Delete ${item.name}`}
              className="grid size-8 place-items-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
