"use client";

import { AppShell } from "@/components/AppShell";
import { WorkspaceProvider } from "@/state/WorkspaceContext";

export default function Workspace() {
  return (
    <WorkspaceProvider>
      <AppShell />
    </WorkspaceProvider>
  );
}
