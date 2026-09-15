"use client";

import { SAMPLES } from "@/lib/samples";
import { PrototypeFrame } from "./PrototypeFrame";

export function Marquee({ reverse = false, slice = [0, 6] }: { reverse?: boolean; slice?: [number, number] }) {
  const items = SAMPLES.slice(slice[0], slice[1]);
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden">
      <div className={`marquee-track flex w-max gap-5 px-3 ${reverse ? "reverse" : ""}`}>
        {loop.map((doc, i) => (
          <PrototypeFrame key={`${doc.name}-${i}`} doc={doc} />
        ))}
      </div>
    </div>
  );
}
