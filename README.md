# Mini Workspace Explorer

A browser-based file manager for folders and text files. Create, rename, delete, search and edit items in a workspace that survives a page refresh. No backend.

Built for the Webbly Media frontend developer assessment.

**Live demo:** _add your Vercel URL here_

## Features

- Sidebar tree with expand/collapse and arbitrary nesting depth
- Main panel showing the selected folder's contents
- Clickable breadcrumb (`Workspace / Projects / Webbly`)
- Create folders and text files, with name validation
- Rename and delete, with a confirmation that counts nested items
- Text editor with explicit save, `Cmd/Ctrl+S` and unsaved-changes protection
- Workspace-wide search across any depth, with the path of each match
- Everything persisted in `localStorage`
- Responsive: the sidebar becomes a drawer on small screens

## Running the project

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Command              | What it does                    |
| -------------------- | ------------------------------- |
| `npm run build`      | Production build                |
| `npm start`          | Serve the production build      |
| `npm test`           | Run the unit tests once         |
| `npm run test:watch` | Re-run tests on change          |
| `npm run lint`       | ESLint                          |
| `npm run format`     | Format everything with Prettier |

## Tech stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Vitest, Prettier. No state-management or UI libraries.

## Project structure

```
app/                   layout, page, global styles
components/            all UI components
  AppShell             header, sidebar, drawer, main area
  Sidebar, TreeNode    recursive folder tree
  MainPanel            breadcrumb + list / editor / search results
  ItemList, EmptyState, Breadcrumb, Toolbar, SearchBox, SearchResults
  FileEditor           textarea, save, unsaved-changes handling
  Modal, NameDialog, ConfirmDeleteDialog, UnsavedChangesDialog
  Icons                inline SVG icons
lib/
  tree.ts              pure helpers (children, path, descendants, validation, search)
  storage.ts           localStorage load/save + save-failure store
  seed.ts              sample workspace for a first visit
state/
  workspaceReducer.ts  pure reducer, all workspace changes
  WorkspaceContext.tsx provider, persistence, navigation guard
types.ts               Item, WorkspaceState, WorkspaceAction
```

Layering: `lib/` contains no React, `state/` builds on `lib/`, and components read state through a hook. The logic that is worth testing has no UI attached to it.

## File-system data structure

Items are stored **flat and normalized**, keyed by id, exactly as the brief describes:

```ts
interface Item {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null; // null = directly under the Workspace root
  content?: string; // files only
  createdAt: number;
  updatedAt: number;
}

type ItemMap = Record<string, Item>;
```

The tree is **derived**, not stored. `parentId` links describe the hierarchy, and helpers compute what the UI needs:

| Helper             | Answers                                                     |
| ------------------ | ----------------------------------------------------------- |
| `getChildren`      | What is inside this folder? (folders first, then A–Z)       |
| `getPath`          | Where am I? (used by the breadcrumb)                        |
| `getDescendantIds` | What is inside this folder at every level? (used by delete) |
| `validateName`     | Is this name allowed here?                                  |
| `getUniqueName`    | A free default name, e.g. `New folder 2`                    |
| `searchItems`      | Which items match this query, and where do they live?       |

Why flat rather than nested: O(1) lookup by id, updates touch a single object instead of copying nested arrays, nesting depth costs nothing, and search is a single pass over one list.

`getDescendantIds` builds a parent → children map once and then walks it with an explicit stack, so deletion is O(n) and has no recursion-depth limit.

## State management

`useReducer` + Context, with no external library.

- All workspace changes go through one pure reducer: `(state, action) => newState`. Actions: `CREATE_ITEM`, `RENAME_ITEM`, `DELETE_ITEM`, `SELECT_FOLDER`, `OPEN_FILE`, `CLOSE_FILE`, `SAVE_FILE`, `TOGGLE_EXPAND`.
- Impure values (`crypto.randomUUID()`, `Date.now()`) are created in components and passed into actions, so the reducer stays pure and easy to test.
- State shape: `items`, `selectedFolderId`, `openFileId`, `expanded`.
- Temporary UI state (which dialog is open, the search query, the editor draft) stays local to components. It is not workspace data and should not be persisted.

## Persistence

- Saved to `localStorage` under `webbly-workspace:v1` after every state change.
- Loaded once, when the provider is created.
- The version in the key means a future schema change cannot load incompatible data.
- Corrupt or wrong-shaped JSON falls back to the sample workspace.
- A saved selection pointing at a deleted item is reset on load.
- If saving fails (quota exceeded, private mode, blocked storage), the app keeps working and shows a banner instead of losing data silently.

Because the data lives in the browser, the app is rendered client-side only (`dynamic(..., { ssr: false })`). Server-rendering it would produce the sample workspace on the server and the saved one in the browser, which is a hydration mismatch.

## Implementation decisions

- **The Workspace root is not an item.** Items with `parentId: null` sit at the root, so the root cannot be renamed or deleted, removing a class of edge cases.
- **Duplicate names are rejected case-insensitively** within the same folder, matching how macOS and Windows behave. The same name in different folders is fine.
- **Navigation is guarded in one place.** The provider wraps `dispatch`; if the editor has unsaved changes and the action would navigate, it is held until the user confirms. Components keep calling plain `dispatch`.
- **Explicit save, not autosave.** The brief asks for a save action, and it lets a user abandon changes by not saving. `beforeunload` covers refresh and tab close.
- **Native `<dialog>` for popups**, which gives focus trapping, `Esc` to close and correct stacking with no dependency.
- **`useDeferredValue` for search**, which keeps typing responsive without a debounce timer.
- **Icons are inline SVG**, so no icon library is needed for five glyphs.

## Edge cases

| Case                                              | Behaviour                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| Empty or whitespace-only name                     | Rejected, with an inline error                                     |
| Duplicate name in the same folder                 | Rejected, case-insensitive                                         |
| Name containing `/` or over 100 characters        | Rejected                                                           |
| Deleting a folder with contents                   | Confirmation states how many nested items will go; all are removed |
| Deleting the selected folder or an ancestor of it | Navigates to the deleted folder's parent                           |
| Deleting the open file                            | Editor closes                                                      |
| Empty folder / empty workspace                    | Empty state with create actions                                    |
| Deeply nested search                              | Works at any depth; each result shows its full path                |
| Unsaved changes                                   | In-app confirmation plus the browser's own warning on refresh      |
| Long names                                        | Truncated in the tree, list and breadcrumb                         |
| Corrupt or unavailable storage                    | Falls back to sample data; save failures are surfaced              |

## Testing

36 unit tests with Vitest, covering the tree helpers, the reducer and persistence, including the delete cascade, selection rules after a delete, name validation, search and storage failures.

```bash
npm test
```

## Deployment

Deployed on Vercel from the `main` branch. It is a fully static client app, so no environment variables or server configuration are required.
