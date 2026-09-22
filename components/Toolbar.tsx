"use client";

import type { ReactNode } from "react";
import {
  FilePlusIcon,
  FolderPlusIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/Icons";

interface ToolbarProps {
  canEditCurrent: boolean;
  onNewFolder: () => void;
  onNewFile: () => void;
  onRenameCurrent: () => void;
  onDeleteCurrent: () => void;
}

function ToolbarButton({
  label,
  icon,
  onClick,
  danger = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium ${
        danger
          ? "text-zinc-600 hover:bg-red-50 hover:text-red-600"
          : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export function Toolbar({
  canEditCurrent,
  onNewFolder,
  onNewFile,
  onRenameCurrent,
  onDeleteCurrent,
}: ToolbarProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <ToolbarButton
        label="New folder"
        icon={<FolderPlusIcon className="size-4" />}
        onClick={onNewFolder}
      />
      <ToolbarButton
        label="New file"
        icon={<FilePlusIcon className="size-4" />}
        onClick={onNewFile}
      />
      {canEditCurrent && (
        <>
          <span className="mx-1 h-5 w-px bg-zinc-200" aria-hidden="true" />
          <ToolbarButton
            label="Rename folder"
            icon={<PencilIcon className="size-4" />}
            onClick={onRenameCurrent}
          />
          <ToolbarButton
            label="Delete folder"
            icon={<TrashIcon className="size-4" />}
            onClick={onDeleteCurrent}
            danger
          />
        </>
      )}
    </div>
  );
}
