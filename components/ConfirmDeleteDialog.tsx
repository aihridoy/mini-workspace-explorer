"use client";

import { Modal } from "@/components/Modal";
import { getDescendantIds } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";
import type { Item } from "@/types";

interface ConfirmDeleteDialogProps {
  item: Item;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteDialog({
  item,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) {
  const { state } = useWorkspace();
  const nestedCount =
    item.type === "folder" ? getDescendantIds(state.items, item.id).length : 0;

  return (
    <Modal title={`Delete "${item.name}"?`} onClose={onClose}>
      <p className="text-sm text-zinc-600">
        {nestedCount > 0
          ? `This folder and the ${nestedCount} ${nestedCount === 1 ? "item" : "items"} inside it will be deleted.`
          : `This ${item.type} will be deleted.`}{" "}
        This can&apos;t be undone.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
