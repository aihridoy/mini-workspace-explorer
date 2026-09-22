import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createSeedItems } from "@/lib/seed";
import { loadState, saveState, STORAGE_KEY } from "@/lib/storage";
import type { WorkspaceState } from "@/types";

const state: WorkspaceState = {
  items: createSeedItems(0),
  selectedFolderId: "webbly",
  openFileId: "notes",
  expanded: { projects: true },
};

beforeEach(() => {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("storage", () => {
  test("saves and loads the same state", () => {
    expect(saveState(state)).toBe(true);
    expect(loadState()).toEqual(state);
  });

  test("returns null when nothing is saved", () => {
    expect(loadState()).toBeNull();
  });

  test("returns null for corrupt or wrong-shaped data", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadState()).toBeNull();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: [] }));
    expect(loadState()).toBeNull();
  });

  test("drops a selection that points to a missing item", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        selectedFolderId: "gone",
        openFileId: "gone",
      }),
    );
    const loaded = loadState();
    expect(loaded?.selectedFolderId).toBeNull();
    expect(loaded?.openFileId).toBeNull();
  });

  test("reports failure when storage is full", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    expect(saveState(state)).toBe(false);
  });
});
