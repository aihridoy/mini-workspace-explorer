"use client";

import { Modal } from "@/components/Modal";

interface UnsavedChangesDialogProps {
  onDiscard: () => void;
  onClose: () => void;
}

export function UnsavedChangesDialog({
  onDiscard,
  onClose,
}: UnsavedChangesDialogProps) {
  return (
    <Modal title="Leave without saving?" onClose={onClose}>
      <p className="text-sm text-zinc-600">
        This file has unsaved changes. If you leave now, they will be lost.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Discard changes
        </button>
      </div>
    </Modal>
  );
}
