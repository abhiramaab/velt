"use client";

import { ScaledMockup } from "@/components/renderer/Mockup";
import type { DesignDoc } from "@/lib/design";

export function PrototypeFrame({
  doc,
  caption,
  tall = false,
}: {
  doc: DesignDoc;
  caption?: string;
  tall?: boolean;
}) {
  return (
    <figure className="w-[300px] shrink-0 md:w-[340px]">
      <div
        className={`frame-shadow relative isolate overflow-hidden rounded-[22px] border border-line/80 bg-paper-2 ${
          tall ? "h-[420px]" : "h-[230px]"
        }`}
      >
        <ScaledMockup doc={doc} fit="width" maxScale={0.34} />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-[12px] text-muted">
          <span className="text-ink">{doc.name}</span>
          <span className="mx-2 opacity-40">·</span>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
