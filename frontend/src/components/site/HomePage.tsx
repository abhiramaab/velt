"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Camera,
  Check,
  ChevronDown,
  Clapperboard,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Megaphone,
  Monitor,
  Palette,
  PanelTop,
  PenTool,
  Presentation,
  RectangleHorizontal,
  ShoppingBag,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { FORMATS as ALL_FORMATS } from "@/lib/design";
import { getToken } from "@/lib/api";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { SakuraPetals } from "./SakuraPetals";

const FORMAT_ICONS: Record<string, LucideIcon> = {
  website: Monitor,
  landing: LayoutTemplate,
  ecommerce: ShoppingBag,
  app: Smartphone,
  dashboard: LayoutDashboard,
  facebook: Megaphone,
  instagram: Camera,
  story: Smartphone,
  youtube: Clapperboard,
  banner: RectangleHorizontal,
  email: Mail,
  pitch: Presentation,
  poster: PenTool,
  brand: Palette,
};

const FORMAT_GROUPS = ["Web", "Product", "Marketing", "Brand"] as const;
const FORMATS = ALL_FORMATS.map((f) => ({ ...f, icon: FORMAT_ICONS[f.id] ?? PanelTop }));

const SHOWCASES = [
  { src: "/showcases/s1.jpg", caption: "a quiet luxury fashion house, cream and silk" },
  { src: "/showcases/s2.jpg", caption: "dark creative studio site for an art direction team" },
  { src: "/showcases/s3.jpg", caption: "swiss architecture landing page, one red accent" },
  { src: "/showcases/s4.jpg", caption: "coastal hotel with long lunches and tiled floors" },
  { src: "/showcases/s5.jpg", caption: "soft skincare brand, blush and cream" },
  { src: "/showcases/s6.jpg", caption: "editorial portfolio for a fashion photographer" },
  { src: "/showcases/s7.jpg", caption: "agency poster series, bold type and color blocks" },
  { src: "/showcases/s8.jpg", caption: "writing app landing page, literary not neon" },
];

const STEPS = [
  {
    no: "01",
    title: "Describe the intent",
    body: "Write it the way you would brief a designer. A sentence, a mood, a constraint. No forms, no templates, no dropdown gymnastics.",
  },
  {
    no: "02",
    title: "Velt composes",
    body: "The engine resolves format, type scale, grid, palette, and hierarchy. You get a complete, coherent design — not a moodboard.",
  },
  {
    no: "03",
    title: "Direct the details",
    body: "React in plain language. Move an accent, tighten the headline, change the tone. Each pass refines the same document, in place.",
  },
  {
    no: "04",
    title: "Take it anywhere",
    body: "One direction expands across web, product, social, print, and brand. Export clean components or ship the source directly.",
  },
];

const PRINCIPLES = [
  {
    k: "Hierarchy first",
    v: "Typography, rhythm, and proportion are decided before a single pixel of ornament. That is why the output reads as design, not decoration.",
  },
  {
    k: "One system, many formats",
    v: "A website, a poster, and an app screen drawn from the same tokens stay recognisably one brand.",
  },
  {
    k: "Editable by default",
    v: "Every result is a structured document. Nothing is flattened. Refine any layer without regenerating the whole.",
  },
  {
    k: "Export without lock-in",
    v: "Structured React components and high-resolution assets, ready for the tools you already use.",
  },
];

const USE_CASES = [
  { n: "Marketing sites", d: "Landing pages and multi-section sites with a real point of view." },
  { n: "Product surfaces", d: "App flows and dashboards you can click before you build." },
  { n: "Campaign creative", d: "Feed posts, stories, banners, and thumbnails that hold a frame." },
  { n: "Brand systems", d: "Marks, palettes, and type scales starting from one line." },
  { n: "Print & editorial", d: "Posters and decks where the grid does the talking." },
  { n: "Email & one-pagers", d: "Campaign letters with a single, deliberate ask." },
];

const FAQS = [
  { q: "What can I make with Velt?", a: "Landing pages, marketing graphics, product visuals, social content, and UI concepts, all from a single prompt." },
  { q: "How do credits work?", a: "Each design generation costs 2 credits. Most other tools and edits cost 1 credit per use." },
  { q: "Can I edit a design after it renders?", a: "Yes — change layouts, colors, copy, style, or format with simple follow-up prompts." },
  { q: "Do I need design experience?", a: "Just describe what you want and Velt handles the design work." },
  { q: "Does it replace a designer?", a: "It helps you explore ideas, create directions, and move faster from concept to execution." },
  { q: "Can I use the designs commercially?", a: "Yes. Everything you create can be used for client work, products, marketing, and commercial projects." },
];

export function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    const elements = document.querySelectorAll(".ed-reveal, .ed-clip, .ed-rule, .ed-line-draw");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f7] text-[#0e0e0e]">
      <Nav overHero />
      <Hero />
      <Showcase />
      <HowItWorks />
      <Principles />
      <UseCases />
      <Pricing />
      <FAQ />
      <Closing />
      <Footer />
    </main>
  );
}

function Hero() {
  const [format, setFormat] = useState(FORMATS[0]);
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  async function go() {
    const text = prompt.trim() || "A quiet ceramic studio in Kyoto, wabi-sabi, paper and warm clay";
    const q = `?prompt=${encodeURIComponent(text)}&format=${format.id}`;
    if (!getToken()) {
      window.location.href = `/login${q}`;
      return;
    }
    window.location.href = `/studio${q}`;
  }

  return (
    <section className="hero-sky relative mx-auto flex min-h-[90svh] sm:min-h-[min(88vh,820px)] w-full items-center justify-center overflow-hidden px-4 pt-24 pb-12 sm:px-8 sm:py-28 text-white">
      {/* 4K UHD Daylight Landscape. Responsive, high-density sources keep the
          hero crisp on phones, tablets, and large retina displays alike. */}
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/hero-day-mobile-1170.jpg?v=1 1170w"
          sizes="100vw"
        />
        <source
          media="(max-width: 1279px)"
          srcSet="/hero-day-1600.jpg?v=1 1600w"
          sizes="100vw"
        />
        <source
          media="(min-width: 1280px)"
          srcSet="/hero-day.jpg?v=12 3840w"
          sizes="100vw"
        />
        <img
          src="/hero-day.jpg?v=12"
          alt=""
          className="hero-photo select-none"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* Drifting animated cherry blossom petals */}
      <SakuraPetals />

      {/* Soft azure wash only at the very top for legibility — no dark cast over the photo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1/2 bg-gradient-to-b from-[#0b387e]/35 to-transparent" />

      <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center justify-center text-center">
        {/* Eyebrow Pill */}
        <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/25 px-3.5 py-1 text-[11px] sm:text-[12px] font-semibold text-white backdrop-blur-md shadow-sm">
          <span>AI Design Intelligence for Builders & Creators</span>
        </div>

        {/* Main Headline */}
        <h1
          className="animate-slide-down text-center text-white"
          style={{
            fontFamily: "var(--font-lastik), 'EB Garamond', Times, serif",
            fontSize: "clamp(46px, 9.2vw, 86px)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Velt
        </h1>

        {/* Subtitle */}
        <p className="mt-2.5 sm:mt-4 max-w-[340px] sm:max-w-[580px] px-2 text-[15px] sm:text-[22px] font-medium leading-[1.45] text-white">
          Describe what you want, and we handle the rest.
          <br className="hidden sm:inline" />
          {" "}From idea to stunning design in seconds.
        </p>

        {/* Prompt Card */}
        <div className="relative mt-6 sm:mt-10 flex w-full min-w-0 max-w-[670px] cursor-text flex-col justify-between overflow-visible rounded-2xl border border-white/90 bg-white/95 p-3 sm:p-4 text-slate-800 shadow-[0_16px_50px_rgba(0,35,90,0.22)] backdrop-blur-xl transition-all sm:rounded-[20px] min-h-[114px] sm:min-h-[128px]">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                go();
              }
            }}
            placeholder="Describe what you want to build..."
            className="w-full resize-none bg-transparent px-1 pt-1 text-[14.5px] font-normal leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 sm:text-[16.5px]"
            rows={2}
          />

          <div className="flex items-center justify-between gap-2 pt-2">
            {/* Format Dropdown Button */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-normal text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:text-[14px]"
              >
                <Monitor className="size-4 text-slate-500" />
                <span className="truncate">{format.label}</span>
                <ChevronDown className="size-3.5 text-slate-400" />
              </button>

              {open ? (
                <div className="absolute bottom-11 left-0 z-40 w-[min(280px,85vw)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-2 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
                  <div className="max-h-[320px] overflow-y-auto">
                    {FORMAT_GROUPS.map((group) => (
                      <div key={group} className="px-1.5 pb-1">
                        <div className="px-3 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {group}
                        </div>
                        {FORMATS.filter((f) => f.group === group).map((f) => (
                          <button
                            key={f.id}
                            onClick={() => {
                              setFormat(f);
                              setOpen(false);
                            }}
                            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13.5px] transition ${
                              format.id === f.id ? "bg-slate-100 font-medium text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <f.icon className="size-4 text-slate-500" />
                            {f.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Circular Blue Arrow Submit Button */}
            <button
              type="button"
              aria-label="Submit"
              onClick={go}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-400/80 bg-white text-sky-500 shadow-sm transition hover:bg-sky-50 hover:border-sky-500 active:scale-95 sm:h-10 sm:w-10"
            >
              <ArrowUp className="size-4 sm:size-4.5" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Mobile Quick Inspiration Pills */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-[11.5px] sm:hidden">
          <span className="mr-0.5 font-medium text-white/85">Try:</span>
          {["Modern SaaS", "Kyoto Cafe", "Editorial Portfolio"].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setPrompt(suggestion)}
              className="rounded-full border border-white/40 bg-white/20 px-3 py-0.5 font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-white/30 active:scale-95"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="ed-reveal flex items-center gap-4">
      <span className="font-mono text-[11px] tracking-[0.28em] text-[#c0392b]">{index}</span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6f6b64]">{children}</span>
      <span className="ed-rule h-px flex-1 bg-[#dedbd5]" />
    </div>
  );
}

function Showcase() {
  return (
    <section className="border-b border-[#dedbd5] px-5 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="01">Selected output</SectionLabel>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="ed-clip font-lastik max-w-[16ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
            <span>What people are building.</span>
          </h2>
          <p className="ed-reveal max-w-[34ch] text-[14px] leading-relaxed text-[#6f6b64] sm:text-[15px]" data-delay="1">
            Every direction below began as a single sentence. No template was chosen. No component was assembled by hand.
          </p>
        </div>
      </div>

      <div className="ed-marquee-mask relative left-1/2 right-1/2 mt-10 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
        <div className="ed-marquee flex w-max items-stretch gap-px bg-[#dedbd5]">
          {[...SHOWCASES, ...SHOWCASES].map((item, i) => (
            <figure
              key={item.src + i}
              className="group relative w-[74vw] max-w-[420px] shrink-0 overflow-hidden bg-[#faf9f7] sm:w-[460px]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.src}
                  alt=""
                  className="h-full w-full object-cover grayscale-[0.35] transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-[12px] font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="ed-marquee-mask relative left-1/2 right-1/2 mt-px -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-t border-[#dedbd5] pt-px">
        <div className="ed-marquee flex w-max items-stretch gap-px bg-[#dedbd5]" style={{ animationDirection: "reverse" }}>
          {[...SHOWCASES.slice(4), ...SHOWCASES.slice(0, 4), ...SHOWCASES.slice(4), ...SHOWCASES.slice(0, 4)].map((item, i) => (
            <figure key={`b-${item.src}-${i}`} className="w-[60vw] max-w-[320px] shrink-0 overflow-hidden bg-[#faf9f7] sm:w-[340px]">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={item.src} alt="" className="h-full w-full object-cover grayscale-[0.35] transition-all duration-700 hover:grayscale-0" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.step);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how" className="border-b border-[#dedbd5] px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="02">How it works</SectionLabel>

        <h2 className="ed-clip font-lastik mt-8 max-w-[18ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[56px]">
          <span>Four moves from</span>
        </h2>
        <div className="ed-clip font-lastik max-w-[18ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[56px]">
          <span>a sentence to a system.</span>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
          {/* Sticky index */}
          <div className="md:sticky md:top-32 md:self-start">
            <ol className="relative space-y-1">
              <span
                aria-hidden
                className="absolute left-[15px] top-2 bottom-2 w-px bg-[#dedbd5]"
              />
              {STEPS.map((step, i) => {
                const live = active === i;
                return (
                  <li key={step.no} className="relative flex items-center gap-4 py-2.5">
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${
                        live
                          ? "ed-dot-live border-[#c0392b] bg-[#c0392b] text-white"
                          : "border-[#dedbd5] bg-[#faf9f7] text-[#6f6b64]"
                      }`}
                    >
                      {step.no}
                    </span>
                    <button
                      type="button"
                      onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                      className={`text-left text-[14px] font-medium transition-colors duration-300 sm:text-[15px] ${
                        live ? "text-[#0e0e0e]" : "text-[#a8a49d] hover:text-[#6f6b64]"
                      }`}
                    >
                      {step.title}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Steps */}
          <ul className="space-y-px">
            {STEPS.map((step, i) => {
              const live = active === i;
              return (
                <li
                  key={step.no}
                  data-step={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="ed-reveal border-t border-[#dedbd5] py-8 first:border-t-0 md:py-12"
                  data-delay={String((i % 3) + 1) as "1" | "2" | "3"}
                >
                  <div className="flex items-baseline gap-5">
                    <span
                      className={`font-mono text-[12px] tabular-nums transition-colors duration-300 ${
                        live ? "text-[#c0392b]" : "text-[#c8c4bd]"
                      }`}
                    >
                      {step.no}
                    </span>
                    <div>
                      <h3
                        className={`font-lastik text-[26px] leading-tight tracking-[-0.01em] transition-colors duration-300 sm:text-[34px] ${
                          live ? "text-[#0e0e0e]" : "text-[#8d8981]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-[#6f6b64] sm:text-[15.5px]">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="border-b border-[#dedbd5] px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="03">The method</SectionLabel>

        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <div>
            <h2 className="ed-clip font-lastik max-w-[14ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
              <span>Design decisions,</span>
            </h2>
            <div className="ed-clip font-lastik max-w-[14ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
              <span>made explicit.</span>
            </div>
            <p className="ed-reveal mt-6 max-w-[40ch] text-[14px] leading-relaxed text-[#6f6b64]" data-delay="1">
              Velt is opinionated about the things that make design legible — hierarchy, rhythm, restraint — while staying neutral about your taste.
            </p>
          </div>

          <dl>
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.k}
                className="ed-reveal grid gap-2 border-t border-[#dedbd5] py-6 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:gap-8"
                data-delay={String((i % 5) + 1) as "1" | "2" | "3" | "4" | "5"}
              >
                <dt className="font-lastik text-[20px] leading-snug tracking-[-0.01em] sm:text-[22px]">{p.k}</dt>
                <dd className="text-[14px] leading-relaxed text-[#6f6b64] sm:text-[15px]">{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section className="border-b border-[#dedbd5] px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="04">One engine, many surfaces</SectionLabel>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="ed-clip font-lastik max-w-[14ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
            <span>Built for the whole brief.</span>
          </h2>
          <p className="ed-reveal max-w-[36ch] text-[14px] leading-relaxed text-[#6f6b64] sm:text-[15px]" data-delay="1">
            Fourteen supported formats spanning web, product, marketing, and brand — drawn from one coherent design document.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px border border-[#dedbd5] bg-[#dedbd5] sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((c, i) => (
            <div
              key={c.n}
              className="ed-reveal group relative bg-[#faf9f7] p-6 transition-colors duration-300 hover:bg-white sm:p-8"
              data-delay={String((i % 3) + 1) as "1" | "2" | "3"}
            >
              <span className="font-mono text-[11px] tabular-nums text-[#c8c4bd]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-lastik mt-4 text-[22px] leading-snug tracking-[-0.01em] sm:text-[24px]">{c.n}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6f6b64]">{c.d}</p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#c0392b] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
          {FORMATS.map((f) => (
            <span key={f.id} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6f6b64]">
              <f.icon className="size-3.5 text-[#a8a49d]" strokeWidth={1.75} />
              {f.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const plans = [
    {
      name: "Starter",
      monthly: 6,
      note: "Perfect for getting started.",
      items: ["75 images / month", "Website Design generations", "Graphic Design generations", "Marketing generations & more", "Chat-based refinements"],
    },
    {
      name: "Pro",
      monthly: 14,
      note: "For creators who want more.",
      items: ["200 images / month", "Everything in Starter", "Advanced Reasoning", "Priority rendering queue", "Early access features"],
    },
    {
      name: "Max",
      monthly: 49,
      note: "Built for power users.",
      items: ["400 images / month", "Everything in Pro", "Long-context memory", "Experimental features", "Priority support"],
    },
  ];

  return (
    <section className="border-b border-[#dedbd5] px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="05">Plans and pricing</SectionLabel>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="ed-clip font-lastik max-w-[16ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
              <span>Priced for momentum.</span>
            </h2>
            <p className="ed-reveal mt-4 max-w-[44ch] text-[14px] leading-relaxed text-[#6f6b64] sm:text-[15px]" data-delay="1">
              Start on a three-day trial. Cancel whenever. Every plan includes the full format engine.
            </p>
          </div>

          <div className="ed-reveal inline-flex self-start border border-[#dedbd5] p-0.5 text-[13px] font-medium sm:self-auto" data-delay="2">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 transition-colors ${!yearly ? "bg-[#0e0e0e] text-white" : "text-[#6f6b64] hover:text-[#0e0e0e]"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 transition-colors ${yearly ? "bg-[#0e0e0e] text-white" : "text-[#6f6b64] hover:text-[#0e0e0e]"}`}
            >
              Annually · Save 30%
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-px border border-[#dedbd5] bg-[#dedbd5] md:grid-cols-3">
          {plans.map((plan, i) => {
            const price = yearly ? Math.round(plan.monthly * 0.7) : plan.monthly;
            const featured = i === 1;
            return (
              <div
                key={plan.name}
                className={`ed-reveal relative flex flex-col p-7 sm:p-9 ${featured ? "bg-[#0e0e0e] text-white" : "bg-[#faf9f7] text-[#0e0e0e]"}`}
                data-delay={String(i + 1) as "1" | "2" | "3"}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em]">{plan.name}</span>
                  {featured ? <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Recommended</span> : null}
                </div>
                <p className={`mt-1 text-[13px] ${featured ? "text-white/60" : "text-[#6f6b64]"}`}>{plan.note}</p>
                <div className="font-lastik mt-7 text-[52px] leading-none tracking-[-0.03em]">
                  ${price}
                  <span className="font-sans text-[14px] tracking-normal opacity-50"> / mo</span>
                </div>
                <Link
                  href="/signup"
                  className={`mt-7 block py-3 text-center text-[13.5px] font-semibold transition-colors ${
                    featured ? "bg-white text-[#0e0e0e] hover:bg-white/90" : "bg-[#0e0e0e] text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  Start free trial
                </Link>
                <p className={`mt-3 text-[12px] ${featured ? "text-white/50" : "text-[#a8a49d]"}`}>
                  3-day free trial. Cancel anytime.
                </p>
                <ul className={`mt-7 space-y-2.5 border-t pt-7 text-[13.5px] ${featured ? "border-white/15" : "border-[#dedbd5]"}`}>
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={14} className={`mt-0.5 shrink-0 ${featured ? "text-white/70" : "text-[#c0392b]"}`} />
                      <span className={featured ? "text-white/85" : "text-[#3a3733]"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-b border-[#dedbd5] px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[900px]">
        <SectionLabel index="06">Questions</SectionLabel>

        <h2 className="ed-clip font-lastik mt-8 max-w-[18ch] text-[34px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
          <span>Before you begin.</span>
        </h2>

        <div className="mt-10">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="ed-reveal border-t border-[#dedbd5]" data-delay={String((i % 5) + 1) as "1" | "2" | "3" | "4" | "5"}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] tabular-nums text-[#c8c4bd]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[16px] font-medium text-[#0e0e0e] sm:text-[18px]">{item.q}</span>
                  </span>
                  <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    <span className="absolute h-px w-3.5 bg-[#8d8981] transition-colors group-hover:bg-[#0e0e0e]" />
                    <span
                      className={`absolute h-3.5 w-px bg-[#8d8981] transition-all duration-300 group-hover:bg-[#0e0e0e] ${
                        isOpen ? "rotate-90 opacity-0" : "opacity-100"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-6 pl-8 text-[14px] leading-relaxed text-[#6f6b64] sm:text-[15px]">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-t border-[#dedbd5] pt-6">
            <p className="text-[14px] text-[#6f6b64]">
              Still curious?{" "}
              <a href="mailto:hello@velt.app" className="font-medium text-[#c0392b] underline-offset-4 hover:underline">
                say hello
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="ed-reveal border-t border-[#dedbd5] pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6f6b64]">Web design</p>
          <h2 className="ed-clip font-lastik mt-5 text-[40px] leading-[0.98] tracking-[-0.03em] sm:text-[80px]">
            <span>Make anything you imagine.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[#6f6b64] sm:text-[16px]">
            Each piece below was made from the line beneath it with Velt, generated on the first try in seconds.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 bg-[#0e0e0e] px-6 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#2a2a2a]"
          >
            Start creating
            <ArrowUp className="size-4 rotate-45" strokeWidth={2} />
          </Link>
        </div>

        <div className="ed-marquee-mask relative left-1/2 right-1/2 mt-14 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
          <div className="ed-marquee flex w-max items-stretch gap-px bg-[#dedbd5]">
            {SHOWCASES.map((item, i) => (
              <figure key={item.src + i} className="w-[70vw] max-w-[380px] shrink-0 overflow-hidden bg-[#faf9f7] sm:w-[420px]">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.src} alt="" className="h-full w-full object-cover grayscale-[0.3] transition-all duration-700 hover:grayscale-0" />
                </div>
                <figcaption className="px-4 py-3 text-[12px] text-[#6f6b64]">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
