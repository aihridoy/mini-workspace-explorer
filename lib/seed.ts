import type { Item, ItemMap } from "@/types";

export function createSeedItems(now: number = Date.now()): ItemMap {
  const make = (
    id: string,
    name: string,
    type: Item["type"],
    parentId: string | null,
    content?: string,
  ): Item => ({
    id,
    name,
    type,
    parentId,
    ...(type === "file" ? { content: content ?? "" } : {}),
    createdAt: now,
    updatedAt: now,
  });

  const items: Item[] = [
    make("projects", "Projects", "folder", null),
    make("webbly", "Webbly", "folder", "projects"),
    make("notes", "notes.txt", "file", "webbly", "Meeting notes go here."),
    make("tasks", "tasks.txt", "file", "webbly", "- Build workspace explorer"),
    make("personal", "Personal", "folder", "projects"),
    make("documents", "Documents", "folder", null),
    make("readme", "README.txt", "file", null, "Welcome to your workspace."),
  ];

  return Object.fromEntries(items.map((item) => [item.id, item]));
}
