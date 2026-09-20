"use client";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import Link from "next/link";
import { SAMPLES } from "@/lib/samples";
import { ScaledMockup } from "@/components/renderer/Mockup";

const CARDS = [
  { sample: "Salt", prompt: "a quiet luxury fashion house, cream and silk" },
  { sample: "LUMEN", prompt: "dark creative studio site for an art direction team" },
  { sample: "AURELI", prompt: "swiss architecture landing page, one red accent" },
  { sample: "Nori", prompt: "coastal hotel with long lunches and tiled floors" },
  { sample: "Halo", prompt: "soft skincare brand, blush and cream" },
  { sample: "Kama", prompt: "editorial portfolio for a fashion photographer" },
  { sample: "Night Set", prompt: "agency poster series, bold type and color blocks" },
  { sample: "Quill", prompt: "writing app landing page, literary not neon" },
];

export default function ShowcasePage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1080px] px-6 pb-20 pt-32">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-sky-600">Showcases</p>
        <h1 className="font-lastik mt-3 max-w-3xl text-5xl leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
          Each design was made from the line beneath it.
        </h1>
        <p className="mt-5 max-w-xl text-slate-500">
          Generated on the first try in seconds. Hover, steal the feeling, then write your own sentence.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CARDS.map((card) => {
            const doc = SAMPLES.find((s) => s.name === card.sample) ?? SAMPLES[0];
            return (
              <Link key={card.sample} href="/signup" className="group block">
                <div className="relative isolate aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="pointer-events-none absolute inset-0">
                    <ScaledMockup doc={doc} fit="width" maxScale={0.36} />
                  </div>
                </div>
                <h2 className="font-lastik mt-4 text-2xl text-slate-900">{doc.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{card.prompt}</p>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
