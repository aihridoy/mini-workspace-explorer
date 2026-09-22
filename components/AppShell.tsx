"use client";

import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { MainPanel } from "@/components/MainPanel";
import { SearchBox } from "@/components/SearchBox";
import { Sidebar } from "@/components/Sidebar";

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <div className="flex h-dvh flex-col bg-white text-zinc-900">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-zinc-200 px-4">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open folder tree"
          className="-ml-2 grid size-8 place-items-center rounded-md hover:bg-zinc-100 md:hidden"
        >
          <MenuIcon className="size-5" />
        </button>
        <h1 className="hidden text-sm font-semibold sm:block">
          Mini Workspace Explorer
        </h1>
        <div className="ml-auto flex min-w-0 flex-1 justify-end">
          <SearchBox query={query} onChange={setQuery} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-zinc-200 bg-zinc-50 md:block">
          <Sidebar onNavigate={() => {}} />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeDrawer}
              aria-hidden="true"
            />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-zinc-50 shadow-xl">
              <div className="flex h-12 items-center justify-between border-b border-zinc-200 px-4">
                <span className="text-sm font-semibold">Folders</span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close folder tree"
                  className="-mr-2 grid size-8 place-items-center rounded-md hover:bg-zinc-200"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>
              <Sidebar onNavigate={closeDrawer} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-hidden">
          <MainPanel query={query} onClearQuery={() => setQuery("")} />
        </main>
      </div>
    </div>
  );
}
