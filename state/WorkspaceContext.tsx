"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { loadState, saveState } from "@/lib/storage";
import { createInitialState, workspaceReducer } from "@/state/workspaceReducer";
import type { WorkspaceAction, WorkspaceState } from "@/types";

interface WorkspaceContextValue {
  state: WorkspaceState;
  dispatch: Dispatch<WorkspaceAction>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    workspaceReducer,
    undefined,
    () => loadState() ?? createInitialState(),
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <WorkspaceContext value={{ state, dispatch }}>{children}</WorkspaceContext>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  }
  return context;
}
