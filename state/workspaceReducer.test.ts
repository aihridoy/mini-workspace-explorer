import { describe, expect, test } from "vitest";
import { createSeedItems } from "@/lib/seed";
import { workspaceReducer } from "@/state/workspaceReducer";
import type { Item, WorkspaceState } from "@/types";

const baseState = (
  overrides: Partial<WorkspaceState> = {},
): WorkspaceState => ({
  items: createSeedItems(0),
  selectedFolderId: null,
  openFileId: null,
  expanded: {},
  ...overrides,
});

describe("CREATE_ITEM", () => {
  test("adds the item and expands its parent", () => {
    const item: Item = {
      id: "new",
      name: "ideas.txt",
      type: "file",
      parentId: "documents",
      content: "",
      createdAt: 1,
      updatedAt: 1,
    };
    const state = workspaceReducer(baseState(), { type: "CREATE_ITEM", item });
    expect(state.items.new).toEqual(item);
    expect(state.expanded.documents).toBe(true);
  });
});

describe("RENAME_ITEM", () => {
  test("renames, trims and updates the timestamp", () => {
    const state = workspaceReducer(baseState(), {
      type: "RENAME_ITEM",
      id: "notes",
      name: "  todo.txt ",
      now: 5,
    });
    expect(state.items.notes.name).toBe("todo.txt");
    expect(state.items.notes.updatedAt).toBe(5);
  });

  test("ignores unknown ids", () => {
    const before = baseState();
    const after = workspaceReducer(before, {
      type: "RENAME_ITEM",
      id: "missing",
      name: "x",
      now: 5,
    });
    expect(after).toBe(before);
  });
});

describe("DELETE_ITEM", () => {
  test("removes a folder and everything nested inside it", () => {
    const state = workspaceReducer(baseState(), {
      type: "DELETE_ITEM",
      id: "projects",
    });
    expect(Object.keys(state.items).sort()).toEqual(["documents", "readme"]);
  });

  test("moves to the parent when the selected folder is deleted", () => {
    const state = workspaceReducer(baseState({ selectedFolderId: "webbly" }), {
      type: "DELETE_ITEM",
      id: "webbly",
    });
    expect(state.selectedFolderId).toBe("projects");
  });

  test("moves to the deleted folder's parent when an ancestor is deleted", () => {
    const state = workspaceReducer(baseState({ selectedFolderId: "webbly" }), {
      type: "DELETE_ITEM",
      id: "projects",
    });
    expect(state.selectedFolderId).toBeNull();
  });

  test("closes the editor when the open file is inside the deleted folder", () => {
    const state = workspaceReducer(baseState({ openFileId: "notes" }), {
      type: "DELETE_ITEM",
      id: "webbly",
    });
    expect(state.openFileId).toBeNull();
  });

  test("keeps selection when an unrelated item is deleted", () => {
    const state = workspaceReducer(
      baseState({ selectedFolderId: "webbly", openFileId: "notes" }),
      { type: "DELETE_ITEM", id: "documents" },
    );
    expect(state.selectedFolderId).toBe("webbly");
    expect(state.openFileId).toBe("notes");
  });
});

describe("SELECT_FOLDER", () => {
  test("selects the folder, closes the editor and expands the path", () => {
    const state = workspaceReducer(baseState({ openFileId: "notes" }), {
      type: "SELECT_FOLDER",
      id: "webbly",
    });
    expect(state.selectedFolderId).toBe("webbly");
    expect(state.openFileId).toBeNull();
    expect(state.expanded).toEqual({ projects: true, webbly: true });
  });

  test("ignores files", () => {
    const before = baseState();
    expect(
      workspaceReducer(before, { type: "SELECT_FOLDER", id: "notes" }),
    ).toBe(before);
  });
});

describe("OPEN_FILE", () => {
  test("opens the file and selects its folder", () => {
    const state = workspaceReducer(baseState(), {
      type: "OPEN_FILE",
      id: "notes",
    });
    expect(state.openFileId).toBe("notes");
    expect(state.selectedFolderId).toBe("webbly");
    expect(state.expanded).toEqual({ projects: true, webbly: true });
  });
});

describe("SAVE_FILE", () => {
  test("stores the new content", () => {
    const state = workspaceReducer(baseState(), {
      type: "SAVE_FILE",
      id: "notes",
      content: "hello",
      now: 9,
    });
    expect(state.items.notes.content).toBe("hello");
    expect(state.items.notes.updatedAt).toBe(9);
  });
});

describe("TOGGLE_EXPAND", () => {
  test("flips a folder open and closed", () => {
    const open = workspaceReducer(baseState(), {
      type: "TOGGLE_EXPAND",
      id: "projects",
    });
    expect(open.expanded.projects).toBe(true);
    const closed = workspaceReducer(open, {
      type: "TOGGLE_EXPAND",
      id: "projects",
    });
    expect(closed.expanded.projects).toBe(false);
  });
});
