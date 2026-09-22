export type ItemType = "folder" | "file";

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export type ItemMap = Record<string, Item>;

export interface WorkspaceState {
  items: ItemMap;
  selectedFolderId: string | null;
  openFileId: string | null;
  expanded: Record<string, boolean>;
}

export interface SearchResult {
  item: Item;
  location: string;
}
