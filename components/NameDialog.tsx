"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/Modal";
import { validateName } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";

interface NameDialogProps {
  title: string;
  submitLabel: string;
  initialName: string;
  parentId: string | null;
  ignoreId?: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export function NameDialog({
  title,
  submitLabel,
  initialName,
  parentId,
  ignoreId,
  onSubmit,
  onClose,
}: NameDialogProps) {
  const { state } = useWorkspace();
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(false);
  const error = validateName(state.items, name, parentId, ignoreId);
  const showError = error !== null && (touched || name !== initialName);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (error) return;
    onSubmit(name.trim());
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="item-name" className="text-sm text-zinc-600">
          Name
        </label>
        <input
          id="item-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onFocus={(event) => {
            const dot = event.target.value.lastIndexOf(".");
            event.target.setSelectionRange(
              0,
              dot > 0 ? dot : event.target.value.length,
            );
          }}
          autoFocus
          autoComplete="off"
          aria-invalid={showError}
          aria-describedby={showError ? "item-name-error" : undefined}
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
            showError
              ? "border-red-400 focus:ring-red-200"
              : "border-zinc-300 focus:ring-blue-200"
          }`}
        />
        {showError && (
          <p id="item-name-error" className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={showError}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
