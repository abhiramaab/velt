"use client";

import { ScaledMockup } from "@/components/renderer/Mockup";
import { SAMPLES } from "@/lib/samples";

const CARDS = [
  { index: 6, className: "left-[-2%] top-[22%] hidden w-[210px] lg:block", delay: "0s", rot: "-12deg" },
  { index: 1, className: "right-[-2%] top-[18%] hidden w-[230px] lg:block", delay: "0.6s", rot: "10deg" },
  { index: 2, className: "left-[2%] bottom-[8%] hidden w-[190px] md:block", delay: "1.1s", rot: "8deg" },
  { index: 4, className: "right-[1%] bottom-[10%] hidden w-[200px] md:block", delay: "1.7s", rot: "-7deg" },
];

const BASE =
  "proto-float absolute z-[1] overflow-hidden rounded-xl border border-white/25 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.45)]";

export function HeroProtos() {
  const phone = SAMPLES.find((s) => s.format === "app") ?? SAMPLES[4];
  const site = SAMPLES[0];

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      {CARDS.map((card) => {
        const doc = SAMPLES[card.index % SAMPLES.length];
        return (
          <div
            key={`${doc.name}-${card.index}`}
            className={`${BASE} ${card.className}`}
            style={{ animationDelay: card.delay, ["--rot" as string]: card.rot }}
          >
            <div className="relative isolate aspect-[4/3] overflow-hidden">
              <ScaledMockup doc={doc} fit="width" maxScale={0.3} />
            </div>
          </div>
        );
      })}

      <div
        className="proto-float absolute left-[6%] top-[38%] z-[2] hidden w-[148px] xl:block"
        style={{ animationDelay: "0.4s", ["--rot" as string]: "-8deg" }}
      >
        <div className="rounded-[28px] border-[5px] border-white/30 bg-black/50 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <div className="relative isolate h-[290px] overflow-hidden rounded-[20px] bg-white">
            <ScaledMockup doc={phone} device="mobile" fit="width" maxScale={0.34} />
          </div>
        </div>
      </div>

      <div
        className="proto-float absolute right-[5%] top-[40%] z-[2] hidden w-[240px] xl:block"
        style={{ animationDelay: "1.3s", ["--rot" as string]: "6deg" }}
      >
        <div className="overflow-hidden rounded-xl border border-white/25 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <div className="relative isolate h-[150px] overflow-hidden">
            <ScaledMockup doc={site} fit="width" maxScale={0.2} />
          </div>
        </div>
      </div>
    </div>
  );
}
