import { createSeedItems } from "@/lib/seed";
import { getDescendantIds, getPath } from "@/lib/tree";
import type { ItemMap, WorkspaceAction, WorkspaceState } from "@/types";

export function createInitialState(): WorkspaceState {
  return {
    items: createSeedItems(),
    selectedFolderId: null,
    openFileId: null,
    expanded: {},
  };
}

function expandPath(
  expanded: WorkspaceState["expanded"],
  items: ItemMap,
  folderId: string | null,
): WorkspaceState["expanded"] {
  const next = { ...expanded };
  for (const folder of getPath(items, folderId)) {
    next[folder.id] = true;
  }
  return next;
}

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "CREATE_ITEM": {
      const { item } = action;
      return {
        ...state,
        items: { ...state.items, [item.id]: item },
        expanded: item.parentId
          ? { ...state.expanded, [item.parentId]: true }
          : state.expanded,
      };
    }

    case "RENAME_ITEM": {
      const item = state.items[action.id];
      if (!item) return state;
      return {
        ...state,
        items: {
          ...state.items,
          [item.id]: {
            ...item,
            name: action.name.trim(),
            updatedAt: action.now,
          },
        },
      };
    }

    case "DELETE_ITEM": {
      const item = state.items[action.id];
      if (!item) return state;

      const removed = new Set([
        item.id,
        ...getDescendantIds(state.items, item.id),
      ]);
      const items = { ...state.items };
      const expanded = { ...state.expanded };
      for (const id of removed) {
        delete items[id];
        delete expanded[id];
      }

      const selectedWasRemoved =
        state.selectedFolderId !== null && removed.has(state.selectedFolderId);
      const openWasRemoved =
        state.openFileId !== null && removed.has(state.openFileId);

      return {
        items,
        expanded,
        selectedFolderId: selectedWasRemoved
          ? item.parentId
          : state.selectedFolderId,
        openFileId: openWasRemoved ? null : state.openFileId,
      };
    }

    case "SELECT_FOLDER": {
      if (action.id !== null && state.items[action.id]?.type !== "folder") {
        return state;
      }
      return {
        ...state,
        selectedFolderId: action.id,
        openFileId: null,
        expanded: expandPath(state.expanded, state.items, action.id),
      };
    }

    case "OPEN_FILE": {
      const file = state.items[action.id];
      if (file?.type !== "file") return state;
      return {
        ...state,
        openFileId: file.id,
        selectedFolderId: file.parentId,
        expanded: expandPath(state.expanded, state.items, file.parentId),
      };
    }

    case "CLOSE_FILE":
      return { ...state, openFileId: null };

    case "SAVE_FILE": {
      const file = state.items[action.id];
      if (file?.type !== "file") return state;
      return {
        ...state,
        items: {
          ...state.items,
          [file.id]: {
            ...file,
            content: action.content,
            updatedAt: action.now,
          },
        },
      };
    }

    case "TOGGLE_EXPAND":
      return {
        ...state,
        expanded: {
          ...state.expanded,
          [action.id]: !state.expanded[action.id],
        },
      };

    default:
      return state;
  }
}
