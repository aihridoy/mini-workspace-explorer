import { describe, expect, test } from "vitest";
import { createSeedItems } from "@/lib/seed";
import {
  getChildren,
  getDescendantIds,
  getPath,
  getUniqueName,
  searchItems,
  validateName,
} from "@/lib/tree";

const items = createSeedItems(0);
const names = (list: { name: string }[]) => list.map((i) => i.name);

describe("getChildren", () => {
  test("lists root items, folders first then alphabetical", () => {
    expect(names(getChildren(items, null))).toEqual([
      "Documents",
      "Projects",
      "README.txt",
    ]);
  });

  test("returns [] for an empty folder", () => {
    expect(getChildren(items, "documents")).toEqual([]);
  });
});

describe("getPath", () => {
  test("builds the chain from top level down to the item", () => {
    expect(names(getPath(items, "notes"))).toEqual([
      "Projects",
      "Webbly",
      "notes.txt",
    ]);
  });

  test("returns [] for the Workspace root", () => {
    expect(getPath(items, null)).toEqual([]);
  });
});

describe("getDescendantIds", () => {
  test("collects everything nested inside a folder, at any depth", () => {
    expect(getDescendantIds(items, "projects").sort()).toEqual(
      ["notes", "personal", "tasks", "webbly"].sort(),
    );
  });

  test("returns [] for a file or empty folder", () => {
    expect(getDescendantIds(items, "readme")).toEqual([]);
    expect(getDescendantIds(items, "documents")).toEqual([]);
  });
});

describe("validateName", () => {
  test("rejects empty and whitespace-only names", () => {
    expect(validateName(items, "", null)).toMatch(/empty/);
    expect(validateName(items, "   ", null)).toMatch(/empty/);
  });

  test('rejects names containing "/"', () => {
    expect(validateName(items, "a/b", null)).toMatch(/\//);
  });

  test("rejects duplicates in the same folder, case-insensitively", () => {
    expect(validateName(items, "projects", null)).toMatch(/already exists/);
    expect(validateName(items, " NOTES.TXT ", "webbly")).toMatch(
      /already exists/,
    );
  });

  test("allows the same name in a different folder", () => {
    expect(validateName(items, "notes.txt", "personal")).toBeNull();
  });

  test("allows renaming an item to its own name", () => {
    expect(validateName(items, "Notes.txt", "webbly", "notes")).toBeNull();
  });
});

describe("searchItems", () => {
  test("finds items at any depth, case-insensitively", () => {
    expect(names(searchItems(items, "TXT").map((r) => r.item))).toEqual([
      "notes.txt",
      "README.txt",
      "tasks.txt",
    ]);
  });

  test("includes each result's location", () => {
    const [result] = searchItems(items, "notes");
    expect(result.location).toBe("Workspace / Projects / Webbly");
  });

  test("returns [] for an empty query", () => {
    expect(searchItems(items, "  ")).toEqual([]);
  });
});

describe("getUniqueName", () => {
  test("keeps the name when it is free", () => {
    expect(getUniqueName(items, null, "New folder")).toBe("New folder");
  });

  test("adds a number when the name is taken", () => {
    expect(getUniqueName(items, null, "Projects")).toBe("Projects 2");
  });

  test("puts the number before the file extension", () => {
    expect(getUniqueName(items, "webbly", "notes.txt")).toBe("notes 2.txt");
  });
});
