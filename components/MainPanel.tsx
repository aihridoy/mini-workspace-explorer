"use client";

import { useDeferredValue, useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { EmptyState } from "@/components/EmptyState";
import { FileEditor } from "@/components/FileEditor";
import { ItemList } from "@/components/ItemList";
import { NameDialog } from "@/components/NameDialog";
import { SearchResults } from "@/components/SearchResults";
import { Toolbar } from "@/components/Toolbar";
import { getChildren, getUniqueName } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";
import type { Item, ItemType } from "@/types";

type DialogState =
  | { kind: "create"; type: ItemType }
  | { kind: "rename"; item: Item }
  | { kind: "delete"; item: Item }
  | null;

const DEFAULT_NAMES: Record<ItemType, string> = {
  folder: "New folder",
  file: "untitled.txt",
};

interface MainPanelProps {
  query: string;
  onClearQuery: () => void;
}

export function MainPanel({ query, onClearQuery }: MainPanelProps) {
  const { state, dispatch } = useWorkspace();
  const [dialog, setDialog] = useState<DialogState>(null);
  const closeDialog = () => setDialog(null);
  const deferredQuery = useDeferredValue(query);
  const isSearching = query.trim() !== "";

  const folderId = state.selectedFolderId;
  const currentFolder = folderId ? state.items[folderId] : undefined;
  const file = state.openFileId ? state.items[state.openFileId] : undefined;
  const children = getChildren(state.items, folderId);

  const createItem = (type: ItemType, name: string) => {
    const now = Date.now();
    const item: Item = {
      id: crypto.randomUUID(),
      name,
      type,
      parentId: folderId,
      ...(type === "file" ? { content: "" } : {}),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "CREATE_ITEM", item });
    if (type === "file") dispatch({ type: "OPEN_FILE", id: item.id });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-12 items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2 sm:px-6">
        <Breadcrumb />
        {!file && !isSearching && (
          <Toolbar
            canEditCurrent={Boolean(currentFolder)}
            onNewFolder={() => setDialog({ kind: "create", type: "folder" })}
            onNewFile={() => setDialog({ kind: "create", type: "file" })}
            onRenameCurrent={() =>
              currentFolder &&
              setDialog({ kind: "rename", item: currentFolder })
            }
            onDeleteCurrent={() =>
              currentFolder &&
              setDialog({ kind: "delete", item: currentFolder })
            }
          />
        )}
      </div>

      {isSearching ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <SearchResults query={deferredQuery} onNavigate={onClearQuery} />
        </div>
      ) : file ? (
        <FileEditor
          key={file.id}
          file={file}
          onRename={(item) => setDialog({ kind: "rename", item })}
          onDelete={(item) => setDialog({ kind: "delete", item })}
        />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children.length > 0 ? (
            <ItemList
              items={children}
              onRename={(item) => setDialog({ kind: "rename", item })}
              onDelete={(item) => setDialog({ kind: "delete", item })}
            />
          ) : (
            <EmptyState isRoot={folderId === null} />
          )}
        </div>
      )}

      {dialog?.kind === "create" && (
        <NameDialog
          title={dialog.type === "folder" ? "New folder" : "New file"}
          submitLabel="Create"
          initialName={getUniqueName(
            state.items,
            folderId,
            DEFAULT_NAMES[dialog.type],
          )}
          parentId={folderId}
          onSubmit={(name) => {
            createItem(dialog.type, name);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}

      {dialog?.kind === "rename" && (
        <NameDialog
          title={`Rename ${dialog.item.type}`}
          submitLabel="Rename"
          initialName={dialog.item.name}
          parentId={dialog.item.parentId}
          ignoreId={dialog.item.id}
          onSubmit={(name) => {
            dispatch({
              type: "RENAME_ITEM",
              id: dialog.item.id,
              name,
              now: Date.now(),
            });
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}

      {dialog?.kind === "delete" && (
        <ConfirmDeleteDialog
          item={dialog.item}
          onConfirm={() => {
            dispatch({ type: "DELETE_ITEM", id: dialog.item.id });
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
