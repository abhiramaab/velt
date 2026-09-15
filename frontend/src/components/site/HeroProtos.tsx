"use client";

import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
import { SAMPLES } from "@/lib/samples";

const CARDS = [
  { src: "/showcases/s1.jpg", className: "left-[-2%] top-[22%] hidden w-[210px] lg:block", delay: "0s", rot: "-12deg" },
  { src: "/showcases/s2.jpg", className: "right-[-2%] top-[18%] hidden w-[230px] lg:block", delay: "0.6s", rot: "10deg" },
  { src: "/showcases/s3.jpg", className: "left-[2%] bottom-[8%] hidden w-[190px] md:block", delay: "1.1s", rot: "8deg" },
  { src: "/showcases/s5.jpg", className: "right-[1%] bottom-[10%] hidden w-[200px] md:block", delay: "1.7s", rot: "-7deg" },
];

export function HeroProtos() {
  const phone = SAMPLES.find((s) => s.format === "app") ?? SAMPLES[2];
  const site = SAMPLES[0];

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      {CARDS.map((card) => (
        <div
          key={card.src}
          className={`proto-float absolute overflow-hidden rounded-xl border border-white/25 shadow-[0_18px_50px_rgba(0,0,0,0.45)] ${card.className}`}
          style={{ animationDelay: card.delay, ["--rot" as string]: card.rot }}
        >
          <img src={card.src} alt="" className="block w-full" />
        </div>
      ))}

      <div
        className="proto-float absolute left-[6%] top-[38%] hidden w-[148px] xl:block"
        style={{ animationDelay: "0.4s", ["--rot" as string]: "-8deg" }}
      >
        <div className="rounded-[28px] border-[5px] border-white/30 bg-black/50 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <div className="h-[290px] overflow-hidden rounded-[20px] bg-white">
            <div className="origin-top-left" style={{ width: 390, transform: "scale(0.35)" }}>
              <PrototypeRenderer doc={phone} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="proto-float absolute right-[5%] top-[40%] hidden w-[240px] xl:block"
        style={{ animationDelay: "1.3s", ["--rot" as string]: "6deg" }}
      >
        <div className="overflow-hidden rounded-xl border border-white/25 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <div className="h-[150px] overflow-hidden">
            <div className="origin-top-left" style={{ width: 1280, transform: "scale(0.187)" }}>
              <PrototypeRenderer doc={site} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
