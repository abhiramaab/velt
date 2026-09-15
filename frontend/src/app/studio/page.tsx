import { Suspense } from "react";
import { StudioHome } from "@/components/studio/StudioHome";

export const metadata = { title: "Studio — Velt" };

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-muted">Opening studio…</div>}>
      <StudioHome />
    </Suspense>
  );
}
