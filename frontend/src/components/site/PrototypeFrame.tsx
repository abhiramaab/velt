"use client";

import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
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
  const isPhone = doc.format === "app";
  const isPoster = doc.format === "poster" || doc.format === "social" || doc.format === "brand";
  const width = isPhone ? 390 : isPoster ? 720 : 1280;
  const scale = isPhone ? 0.42 : 0.26;

  return (
    <figure className="w-[300px] shrink-0 md:w-[340px]">
      <div
        className={`frame-shadow overflow-hidden rounded-[22px] border border-line/80 bg-paper-2 ${
          tall ? "h-[420px]" : "h-[230px]"
        }`}
      >
        <div
          className="origin-top-left"
          style={{
            width,
            transform: `scale(${isPhone ? 0.72 : scale})`,
          }}
        >
          <PrototypeRenderer doc={doc} />
        </div>
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
