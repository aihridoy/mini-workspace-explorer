"use client";

import { ROOT_NAME } from "@/lib/tree";
import { useWorkspace } from "@/state/WorkspaceContext";

export function MainPanel() {
  const { state } = useWorkspace();
  const folder = state.selectedFolderId
    ? state.items[state.selectedFolderId]
    : null;
  const file = state.openFileId ? state.items[state.openFileId] : null;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">{folder?.name ?? ROOT_NAME}</h2>
      {file && (
        <p className="mt-1 text-sm text-zinc-500">Open file: {file.name}</p>
      )}
    </div>
  );
}
