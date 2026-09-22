"use client";

import dynamic from "next/dynamic";

const Workspace = dynamic(() => import("@/components/Workspace"), {
  ssr: false,
  loading: () => (
    <div className="grid h-dvh place-items-center text-sm text-zinc-500">
      Loading workspace…
    </div>
  ),
});

export function ClientApp() {
  return <Workspace />;
}
