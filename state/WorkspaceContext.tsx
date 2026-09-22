"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";
import { loadState, saveState } from "@/lib/storage";
import { createInitialState, workspaceReducer } from "@/state/workspaceReducer";
import type { WorkspaceAction, WorkspaceState } from "@/types";

interface WorkspaceContextValue {
  state: WorkspaceState;
  dispatch: Dispatch<WorkspaceAction>;
  setUnsavedChanges: (value: boolean) => void;
}

const NAVIGATION_ACTIONS = new Set<WorkspaceAction["type"]>([
  "SELECT_FOLDER",
  "OPEN_FILE",
  "CLOSE_FILE",
]);

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatchAction] = useReducer(
    workspaceReducer,
    undefined,
    () => loadState() ?? createInitialState(),
  );
  const hasUnsavedChanges = useRef(false);
  const [blockedAction, setBlockedAction] = useState<WorkspaceAction | null>(
    null,
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setUnsavedChanges = useCallback((value: boolean) => {
    hasUnsavedChanges.current = value;
  }, []);

  const dispatch = useCallback((action: WorkspaceAction) => {
    if (hasUnsavedChanges.current && NAVIGATION_ACTIONS.has(action.type)) {
      setBlockedAction(action);
      return;
    }
    dispatchAction(action);
  }, []);

  const discardAndContinue = () => {
    if (!blockedAction) return;
    hasUnsavedChanges.current = false;
    dispatchAction(blockedAction);
    setBlockedAction(null);
  };

  return (
    <WorkspaceContext value={{ state, dispatch, setUnsavedChanges }}>
      {children}
      {blockedAction && (
        <UnsavedChangesDialog
          onDiscard={discardAndContinue}
          onClose={() => setBlockedAction(null)}
        />
      )}
    </WorkspaceContext>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  }
  return context;
}
