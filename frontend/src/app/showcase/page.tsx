"use client";

import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import Link from "next/link";
import { WEBSITE_SHOWCASES } from "@/lib/websiteShowcases";
import { ScaledMockup } from "@/components/renderer/Mockup";
import { Sparkles, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";

export default function ShowcasePage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1360px] px-4 pb-28 pt-32 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700">
            <Sparkles size={13} />
            REAL WEBSITE HOMEPAGES · PURE LIGHT THEME
          </div>
          <h1 className="font-lastik mt-4 max-w-4xl text-5xl leading-[1.06] tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
            Real website designs, generated in seconds.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Complete, responsive, production-ready website homepage layouts. Click any website below to clone its design rhythm and generate with Velt.
          </p>
        </div>

        {/* Grid of Real Website Homepages in Clean Browser Window Frames */}
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {WEBSITE_SHOWCASES.map((site) => (
            <div
              key={site.id}
              onMouseEnter={() => setHoveredId(site.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group flex flex-col rounded-[28px] border border-slate-200/90 bg-white p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl"
            >
              {/* Browser Window Frame Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 bg-slate-50/70 rounded-t-[20px]">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-rose-400" />
                  <div className="size-2.5 rounded-full bg-amber-400" />
                  <div className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-0.5 text-[11px] font-mono text-slate-500 shadow-2xs">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>https://{site.id}.com</span>
                </div>
                <div className="w-12 text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">1440px</span>
                </div>
              </div>

              {/* Live Rendered Website Homepage */}
              <Link
                href={`/studio?prompt=${encodeURIComponent(site.prompt)}&format=website`}
                className="relative isolate block aspect-[16/10] w-full overflow-hidden rounded-b-[20px] bg-slate-50 cursor-pointer"
              >
                <div className="pointer-events-none absolute inset-0">
                  <ScaledMockup
                    doc={site.doc}
                    device="desktop"
                    fit="width"
                    maxScale={0.48}
                  />
                </div>
                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-200 group-hover:bg-slate-900/5 flex items-end justify-end p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Remix this site <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>

              {/* Website Info Details */}
              <div className="p-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-lastik text-2xl text-slate-900">
                    {site.title}
                  </h3>
                  <Link
                    href={`/studio?prompt=${encodeURIComponent(site.prompt)}&format=website`}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                  >
                    Generate with prompt <ArrowRight size={13} />
                  </Link>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {site.tagline}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  "{site.prompt}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:flex-row sm:p-12">
          <div>
            <h3 className="font-lastik text-2xl text-slate-900 sm:text-3xl">
              Ready to generate your own website?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Start with a 2-day free trial (up to 200 credits). Clone from reference sites or type any prompt.
            </p>
          </div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 shrink-0"
          >
            Launch Studio <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
