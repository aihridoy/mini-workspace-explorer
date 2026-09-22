"use client";

import { useCallback, useEffect, useState } from "react";
import { CloseIcon, PencilIcon, TrashIcon } from "@/components/Icons";
import { useWorkspace } from "@/state/WorkspaceContext";
import type { Item } from "@/types";

interface FileEditorProps {
  file: Item;
  onRename: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function FileEditor({ file, onRename, onDelete }: FileEditorProps) {
  const { dispatch, setUnsavedChanges } = useWorkspace();
  const saved = file.content ?? "";
  const [draft, setDraft] = useState(saved);
  const isDirty = draft !== saved;

  const save = useCallback(() => {
    dispatch({
      type: "SAVE_FILE",
      id: file.id,
      content: draft,
      now: Date.now(),
    });
  }, [dispatch, draft, file.id]);

  useEffect(() => {
    setUnsavedChanges(isDirty);
    return () => setUnsavedChanges(false);
  }, [isDirty, setUnsavedChanges]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        if (isDirty) save();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDirty, save]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2 sm:px-6">
        <p className="min-w-0 truncate text-sm text-zinc-500">
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onRename(file)}
            aria-label={`Rename ${file.name}`}
            className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(file)}
            aria-label={`Delete ${file.name}`}
            className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "CLOSE_FILE" })}
            aria-label="Close file"
            className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <CloseIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!isDirty}
            className="ml-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label={`Contents of ${file.name}`}
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-white p-4 font-mono text-sm leading-6 outline-none sm:p-6"
      />
    </div>
  );
}
