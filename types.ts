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

export type WorkspaceAction =
  | { type: "CREATE_ITEM"; item: Item }
  | { type: "RENAME_ITEM"; id: string; name: string; now: number }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "SELECT_FOLDER"; id: string | null }
  | { type: "OPEN_FILE"; id: string }
  | { type: "CLOSE_FILE" }
  | { type: "SAVE_FILE"; id: string; content: string; now: number }
  | { type: "TOGGLE_EXPAND"; id: string };
