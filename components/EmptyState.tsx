import { FolderIcon } from "@/components/Icons";

interface EmptyStateProps {
  isRoot: boolean;
}

export function EmptyState({ isRoot }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-zinc-300 px-6 py-16 text-center">
      <FolderIcon className="size-10 text-zinc-300" />
      <p className="mt-3 text-sm font-medium text-zinc-900">
        {isRoot ? "Your workspace is empty" : "This folder is empty"}
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        Create a folder or a text file to get started.
      </p>
    </div>
  );
}
