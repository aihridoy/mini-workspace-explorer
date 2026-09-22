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

export function saveState(state: WorkspaceState): boolean {
  if (typeof localStorage === "undefined") return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
