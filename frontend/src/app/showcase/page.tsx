"use client";

import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import Link from "next/link";
import { SHOWCASE_DATA, AnimatedMockupCard } from "@/components/showcase/AnimatedShowcaseCard";
import { Sparkles, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Tech & SaaS", "Mobile Apps", "AI & Cloud", "Commerce & Studio"] as const;

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = selectedCategory === "All"
    ? SHOWCASE_DATA
    : SHOWCASE_DATA.filter((c) => c.category === selectedCategory);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-32">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-[12px] font-semibold tracking-wider text-sky-700">
            <Sparkles size={13} />
            CURATED ARCHETYPES · LIGHT THEME
          </div>
          <h1 className="font-lastik mt-4 max-w-4xl text-5xl leading-[1.06] tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
            Each design was composed live from a single sentence.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            High-fidelity responsive layouts, live device viewports, micro-interactions, and instant production code.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid of Animated Mockups */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/studio?prompt=${encodeURIComponent(item.prompt)}&format=${item.deviceType === "mobile" ? "app" : "website"}`}
            >
              <AnimatedMockupCard item={item} />
            </Link>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:flex-row sm:p-12">
          <div>
            <h3 className="font-lastik text-2xl text-slate-900 sm:text-3xl">
              Ready to generate your own website?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Start with a 2-day free trial (up to 200 credits). Clone from reference sites or type any vision.
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
