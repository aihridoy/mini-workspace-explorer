import type { Item, ItemMap, SearchResult } from "@/types";

export const ROOT_NAME = "Workspace";
export const MAX_NAME_LENGTH = 100;

function compareItems(a: Item, b: Item): number {
  if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
  return a.name.localeCompare(b.name, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function getChildren(items: ItemMap, parentId: string | null): Item[] {
  return Object.values(items)
    .filter((item) => item.parentId === parentId)
    .sort(compareItems);
}

export function getPath(items: ItemMap, id: string | null): Item[] {
  const path: Item[] = [];
  let current = id ? items[id] : undefined;

  while (current) {
    path.unshift(current);
    current = current.parentId ? items[current.parentId] : undefined;
  }

  return path;
}

export function getDescendantIds(items: ItemMap, id: string): string[] {
  const childrenByParent = new Map<string, string[]>();
  for (const item of Object.values(items)) {
    if (item.parentId === null) continue;
    const siblings = childrenByParent.get(item.parentId) ?? [];
    siblings.push(item.id);
    childrenByParent.set(item.parentId, siblings);
  }

  const result: string[] = [];
  const stack = [...(childrenByParent.get(id) ?? [])];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    result.push(currentId);
    stack.push(...(childrenByParent.get(currentId) ?? []));
  }

  return result;
}

export function isAncestor(
  items: ItemMap,
  ancestorId: string,
  id: string,
): boolean {
  let parentId = items[id]?.parentId ?? null;

  while (parentId !== null) {
    if (parentId === ancestorId) return true;
    parentId = items[parentId]?.parentId ?? null;
  }

  return false;
}

export function validateName(
  items: ItemMap,
  name: string,
  parentId: string | null,
  ignoreId?: string,
): string | null {
  const trimmed = name.trim();

  if (trimmed === "") return "Name cannot be empty.";
  if (trimmed.includes("/")) return 'Name cannot contain "/".';
  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  const lower = trimmed.toLowerCase();
  const duplicate = Object.values(items).some(
    (item) =>
      item.parentId === parentId &&
      item.id !== ignoreId &&
      item.name.toLowerCase() === lower,
  );
  if (duplicate) return `An item named "${trimmed}" already exists here.`;

  return null;
}

export function getLocationLabel(items: ItemMap, item: Item): string {
  const parentNames = getPath(items, item.parentId).map((p) => p.name);
  return [ROOT_NAME, ...parentNames].join(" / ");
}

export function searchItems(items: ItemMap, query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q === "") return [];

  return Object.values(items)
    .filter((item) => item.name.toLowerCase().includes(q))
    .sort(compareItems)
    .map((item) => ({ item, location: getLocationLabel(items, item) }));
}

export function getUniqueName(
  items: ItemMap,
  parentId: string | null,
  desired: string,
): string {
  if (validateName(items, desired, parentId) === null) return desired;

  const dot = desired.lastIndexOf(".");
  const base = dot > 0 ? desired.slice(0, dot) : desired;
  const extension = dot > 0 ? desired.slice(dot) : "";

  for (let n = 2; ; n++) {
    const candidate = `${base} ${n}${extension}`;
    if (validateName(items, candidate, parentId) === null) return candidate;
  }
}
