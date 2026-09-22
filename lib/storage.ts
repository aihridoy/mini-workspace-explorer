import type { WorkspaceState } from "@/types";

export const STORAGE_KEY = "webbly-workspace:v1";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isIdOrNull = (value: unknown): value is string | null =>
  value === null || typeof value === "string";

function isWorkspaceState(value: unknown): value is WorkspaceState {
  return (
    isObject(value) &&
    isObject(value.items) &&
    isObject(value.expanded) &&
    isIdOrNull(value.selectedFolderId) &&
    isIdOrNull(value.openFileId)
  );
}

export function loadState(): WorkspaceState | null {
  if (typeof localStorage === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isWorkspaceState(parsed)) return null;

    const { items, selectedFolderId, openFileId } = parsed;
    return {
      ...parsed,
      selectedFolderId:
        selectedFolderId && items[selectedFolderId] ? selectedFolderId : null,
      openFileId: openFileId && items[openFileId] ? openFileId : null,
    };
  } catch {
    return null;
  }
}

let saveFailed = false;
const saveListeners = new Set<() => void>();

function reportSaveResult(succeeded: boolean) {
  if (saveFailed === !succeeded) return;
  saveFailed = !succeeded;
  for (const listener of saveListeners) listener();
}

export function subscribeToSaveState(listener: () => void): () => void {
  saveListeners.add(listener);
  return () => {
    saveListeners.delete(listener);
  };
}

export function hasSaveFailed(): boolean {
  return saveFailed;
}

export function saveState(state: WorkspaceState): boolean {
  if (typeof localStorage === "undefined") return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    reportSaveResult(true);
    return true;
  } catch {
    reportSaveResult(false);
    return false;
  }
}
