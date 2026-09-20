"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
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
  MousePointerClick,
  Palette,
  PanelTop,
  PenTool,
  Presentation,
  RectangleHorizontal,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import { FORMATS as ALL_FORMATS } from "@/lib/design";
import { SAMPLES } from "@/lib/samples";
import { ScaledMockup } from "@/components/renderer/Mockup";
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
  { index: 0, caption: "a quiet ceramic studio in Kyoto, warm clay" },
  { index: 1, caption: "dark creative studio site for an art direction team" },
  { index: 2, caption: "swiss architecture landing page, one red accent" },
  { index: 3, caption: "writing app landing page, literary not neon" },
  { index: 4, caption: "morning bakery mobile app, warm and playful" },
  { index: 5, caption: "editorial poster for a late brass set" },
  { index: 6, caption: "boutique hotel, tiled floors and long lunches" },
  { index: 7, caption: "soft skincare brand, blush and cream" },
];

const HOW_STEPS = [
  {
    kicker: "Describe",
    title: "Brief it in one sentence",
    body: "Write the way you would brief a designer — a mood, a constraint, a reference. No forms, no templates, no dropdown gymnastics.",
    icon: Wand2,
  },
  {
    kicker: "Compose",
    title: "Velt composes the system",
    body: "The engine resolves format, type scale, grid, palette, and hierarchy at once. You get a complete, coherent design — not a moodboard.",
    icon: Sparkles,
  },
  {
    kicker: "Direct",
    title: "Refine in plain language",
    body: "Move an accent, tighten the headline, shift the tone. Every follow-up refines the same structured document, in place.",
    icon: MousePointerClick,
  },
];

const FEATURES: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  visual: VisualKind;
}[] = [
  {
    eyebrow: "Formats",
    title: "Make every surface",
    body: "Websites, product flows, dashboards, social creative, posters, decks, and brands — all drawn from one document.",
    href: "/showcase",
    visual: "formats",
  },
  {
    eyebrow: "Direction",
    title: "Steer without rebuilding",
    body: "Chat to change layout, palette, hierarchy, or copy tone. Each pass edits the same document instead of regenerating it.",
    href: "/studio",
    visual: "chat",
  },
  {
    eyebrow: "Brand",
    title: "Extract a design system",
    body: "Every result ships with tokens: type scale, spacing rhythm, hex palette, and mood — ready to reuse anywhere.",
    href: "/tools",
    visual: "tokens",
  },
  {
    eyebrow: "Iteration",
    title: "Branch directions",
    body: "Explore several art directions side by side, then merge the strongest parts into one coherent system.",
    href: "/studio",
    visual: "versions",
  },
  {
    eyebrow: "Export",
    title: "Inspect real components",
    body: "Open the structured React tree and the design spec behind any render. Nothing is flattened, nothing is locked in.",
    href: "/tools",
    visual: "export",
  },
  {
    eyebrow: "Speed",
    title: "From prompt to pixels",
    body: "A complete direction renders in seconds, so the first draft is never the expensive part of the work.",
    href: "/studio",
    visual: "speed",
  },
];

type VisualKind = "formats" | "chat" | "tokens" | "versions" | "export" | "speed";

const PRINCIPLES = [
  {
    k: "Hierarchy first",
    v: "Typography, rhythm, and proportion are decided before a single pixel of ornament — that is why the output reads as design, not decoration.",
  },
  {
    k: "One system, many formats",
    v: "A website, a poster, and an app screen drawn from the same tokens stay recognisably one brand.",
  },
  {
    k: "Editable by default",
    v: "Every result is a structured document. Refine any layer without regenerating the whole.",
  },
  {
    k: "Export without lock-in",
    v: "Structured React components and high-resolution assets, ready for the tools you already use.",
  },
];

const FAQS = [
  {
    q: "What can I make with Velt?",
    a: "Landing pages, marketing graphics, product visuals, social content, and UI concepts — all from a single prompt.",
    href: "/showcase",
    link: "See what people are building",
  },
  {
    q: "How do credits work?",
    a: "Each design generation costs 2 credits. Most other tools and edits cost 1 credit per use.",
    href: "/pricing",
    link: "Compare plans",
  },
  {
    q: "Can I edit a design after it renders?",
    a: "Yes — change layouts, colors, copy, style, or format with simple follow-up prompts in the studio.",
    href: "/studio",
    link: "Open the studio",
  },
  {
    q: "Do I need design experience?",
    a: "Just describe what you want and Velt handles the design work — hierarchy, type, palette, and layout included.",
    href: "/#how",
    link: "See how it works",
  },
  {
    q: "Does it replace a designer?",
    a: "It helps you explore ideas, create directions, and move faster from concept to execution — the taste stays yours.",
    href: "/#method",
    link: "Read the method",
  },
  {
    q: "Can I use the designs commercially?",
    a: "Yes. Everything you create can be used for client work, products, marketing, and commercial projects.",
    href: "/pricing",
    link: "Read the terms",
  },
];

/* ------------------------------------------------------------------ */
/*  Scroll-reveal controller                                           */
/* ------------------------------------------------------------------ */

function useReveal() {
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
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" }
    );
    const els = document.querySelectorAll(
      ".vl-reveal, .vl-pop, .vl-words, .vl-roll, .vl-sweep, .vl-bar, .vl-line, .vl-page, .vl-row"
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref, display: value.toFixed(decimals) };
}

function Reveal({
  children,
  className = "",
  delay,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: "div" | "p" | "article" | "li" | "figure";
}) {
  return (
    <Tag className={`vl-reveal ${className}`} data-delay={delay ? String(delay) : undefined}>
      {children}
    </Tag>
  );
}

function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`vl-words ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="vl-word">
          <span style={{ transitionDelay: `${i * 0.06}s` }}>{w}</span>
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#008be3]">
      {children}
    </span>
  );
}

function SectionHeading({
  first,
  second,
  className = "",
}: {
  first: string;
  second?: string;
  className?: string;
}) {
  return (
    <h2
      className={`vl-words font-display text-[32px] font-semibold leading-[1.06] tracking-[-0.03em] text-[#0b1b2b] sm:text-[44px] lg:text-[52px] ${className}`}
    >
      <Words text={first} />
      {second ? (
        <>
          <br />
          <span className="text-[#5b7290]">
            <Words text={second} />
          </span>
        </>
      ) : null}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function HomePage() {
  useReveal();

  return (
    <main className="vl relative min-h-screen overflow-hidden bg-[#f4f9ff] text-[#0b1b2b]">
      <Nav overHero />
      <Hero />
      <Showcase />
      <HowItWorks />
      <Features />
      <Walkthrough />
      <Method />
      <FAQ />
      <Closing />
      <Footer />
    </main>
  );
}

/* Hero — intentionally preserved as-is */

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
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/hero-day-mobile-1170.jpg?v=2 1170w"
          sizes="100vw"
        />
        <source
          media="(max-width: 899px)"
          srcSet="/hero-day-1600.jpg?v=2 1600w"
          sizes="100vw"
        />
        <source
          media="(max-width: 1279px)"
          srcSet="/hero-day-2560.jpg?v=2 2560w"
          sizes="100vw"
        />
        <source
          media="(min-width: 1280px)"
          srcSet="/hero-day.jpg?v=13 3840w"
          sizes="100vw"
        />
        <img
          src="/hero-day.jpg?v=13"
          alt=""
          className="hero-photo select-none"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      <SakuraPetals />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1/2 bg-gradient-to-b from-[#0b387e]/35 to-transparent" />

      <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center justify-center text-center">
        <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/25 px-3.5 py-1 text-[11px] sm:text-[12px] font-semibold text-white backdrop-blur-md shadow-sm">
          <span>AI Design Intelligence for Builders &amp; Creators</span>
        </div>

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

        <p className="mt-2.5 sm:mt-4 max-w-[340px] sm:max-w-[580px] px-2 text-[15px] sm:text-[22px] font-medium leading-[1.45] text-white">
          Describe what you want, and we handle the rest.
          <br className="hidden sm:inline" />
          {" "}From idea to stunning design in seconds.
        </p>

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

/* 01 — Showcase marquee */

function Showcase() {
  return (
    <section id="showcase" className="scroll-mt-24 overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <Reveal className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Selected output</Eyebrow>
            <SectionHeading first="What people are" second="building right now." className="mt-4" />
          </div>
          <Reveal as="p" delay={1} className="max-w-sm text-[14px] leading-relaxed text-[#5b7290] sm:text-[15px]">
            Every direction below began as a single sentence. No template was chosen, no component was assembled by hand.
          </Reveal>
        </div>
      </Reveal>

      <Reveal delay={2} className="vl-marquee-mask relative left-1/2 right-1/2 mt-12 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
        <div className="vl-marquee flex w-max items-stretch gap-4">
          {[...SHOWCASES, ...SHOWCASES].map((item, i) => {
            const doc = SAMPLES[item.index % SAMPLES.length];
            return (
              <figure
                key={`${doc.name}-${i}`}
                className="group relative w-[76vw] max-w-[420px] shrink-0 overflow-hidden rounded-2xl border border-[#d6e6f7] bg-white sm:w-[460px]"
              >
                <div className="relative isolate aspect-[4/3] overflow-hidden bg-[#eef6ff]">
                  <div className="pointer-events-none absolute inset-0">
                    <ScaledMockup doc={doc} fit="width" maxScale={0.34} />
                  </div>
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-[#06203a]/80 to-transparent px-4 pb-3 pt-12 text-[12px] font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

/* 02 — How it works */

function HowItWorks() {
  return (
    <section
      id="how"
      className="scroll-mt-24 overflow-hidden bg-[#eef6ff] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32 xl:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <SectionHeading first="Go from a sentence" second="to a whole system." className="mt-4" />
          <Reveal as="p" delay={1} className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#5b7290] sm:text-[16px]">
            Start with intent, let Velt resolve the design decisions, then direct the details in plain language.
          </Reveal>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-5 lg:gap-6">
          {HOW_STEPS.map((step, i) => (
            <Reveal as="article" key={step.title} delay={((i % 3) + 1) as 1 | 2 | 3} className="min-w-0">
              <div className="relative h-[24rem] overflow-hidden rounded-2xl border border-[#d6e6f7]/70 bg-[#f4f9ff]">
                <MockFor index={i} />
              </div>
              <div className="mt-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#008be3]">
                  {step.kicker}
                </span>
                <h3 className="mt-2 font-display text-[22px] font-semibold leading-snug tracking-[-0.02em] text-[#0b1b2b] sm:text-[24px]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[#5b7290] sm:text-[15px]">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MockFor({ index }: { index: number }) {
  if (index === 0) return <ComposeMock />;
  if (index === 1) return <FormatsMock />;
  return <ExportMock />;
}

function ComposeMock() {
  return (
    <div className="vl-pop flex h-full items-center justify-center px-5">
      <div className="w-full max-w-[280px] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_0_0_1px_rgba(11,27,43,0.04),0_8px_24px_-16px_rgba(11,27,43,0.24)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#5b7290]">
          <Wand2 className="size-3.5 text-[#008be3]" strokeWidth={2} />
          Prompt
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[#0b1b2b]">
          &ldquo;A quiet ceramics studio in Kyoto — warm clay, paper, one deep indigo accent.&rdquo;
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Website", "Editorial", "Warm", "Indigo"].map((t) => (
            <span key={t} className="rounded-full bg-[#e9f3ff] px-2.5 py-0.5 text-[11px] font-medium text-[#008be3]">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-[#e9f3ff] pt-3 text-[11px] text-[#5b7290]">
          <span className="relative inline-flex size-1.5 text-[#10ce6a]">
            <span className="vl-ping absolute inset-0 rounded-full" />
            <span className="size-1.5 rounded-full bg-current" />
          </span>
          Composing layout, type &amp; palette
        </div>
      </div>
    </div>
  );
}

function FormatsMock() {
  const rows = [
    { name: "Website", note: "Marketing site", color: "#008be3" },
    { name: "Dashboard", note: "Product surface", color: "#7c7af0" },
    { name: "Poster", note: "Print / editorial", color: "#e85a48" },
  ];
  return (
    <div className="flex h-full items-center justify-center px-5">
      <div className="w-full max-w-[290px] space-y-2.5">
        {rows.map((r, i) => (
          <div
            key={r.name}
            className="vl-row flex items-center gap-3 rounded-xl border border-[#d6e6f7] bg-white/90 px-3.5 py-3 shadow-[0_8px_24px_-18px_rgba(11,27,43,0.3)]"
            style={{ "--vl-row-x": i % 2 === 0 ? "-18px" : "18px", animation: `vl-row-in .5s var(--vl-ease) ${i * 0.07}s both` } as React.CSSProperties}
          >
            <span className="size-7 shrink-0 rounded-lg" style={{ background: `${r.color}1a`, color: r.color }}>
              <span className="flex h-full w-full items-center justify-center">
                <span className="size-2 rounded-[3px] bg-current" />
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-[#0b1b2b]">{r.name}</span>
              <span className="block truncate text-[11px] text-[#5b7290]">{r.note}</span>
            </span>
            <Check className="size-4 shrink-0 text-[#10ce6a]" strokeWidth={2.4} />
          </div>
        ))}
        <div className="pt-1 text-center text-[11px] font-medium text-[#5b7290]">
          14 formats · one document
        </div>
      </div>
    </div>
  );
}

function ExportMock() {
  const bars = [38, 52, 46, 68, 78, 92];
  return (
    <div className="vl-pop flex h-full items-center justify-center px-5">
      <div className="w-full max-w-[290px] rounded-2xl border border-[#d6e6f7] bg-white/95 p-4 shadow-[0_0_0_1px_rgba(11,27,43,0.04),0_8px_24px_-16px_rgba(11,27,43,0.24)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#5b7290]">Output</span>
          <span className="rounded-full bg-[#10ce6a]/10 px-2 py-0.5 text-[11px] font-semibold text-[#0b8f4e]">
            Ready
          </span>
        </div>
        <div className="mt-3 flex items-end gap-1.5" style={{ height: 96 }}>
          {bars.map((h, i) => (
            <span
              key={i}
              className="vl-bar flex-1 rounded-t-md bg-[#008be3]/25 last:bg-[#008be3]/70"
              style={{
                height: `${h}%`,
                transformOrigin: "bottom",
                animation: `vl-bar-grow .5s var(--vl-ease) ${0.05 * i}s both`,
              }}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#e9f3ff] pt-3 text-[11px]">
          <div>
            <div className="text-[#5b7290]">Components</div>
            <div className="font-mono text-[13px] font-medium text-[#0b1b2b]">142</div>
          </div>
          <div>
            <div className="text-[#5b7290]">Format</div>
            <div className="font-mono text-[13px] font-medium text-[#0b1b2b]">React</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 03 — Features */

function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>Product features</Eyebrow>
            <SectionHeading first="Everything stays together." second="Nothing is an add-on." className="mt-4" />
            <Reveal as="p" delay={1} className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#5b7290] sm:text-[16px]">
              Move from a single prompt to the formats, systems, and code behind it — without losing the context that connects them.
            </Reveal>
          </Reveal>
        </div>

        <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal as="article" key={f.title} delay={((i % 3) + 1) as 1 | 2 | 3} className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#d6e6f7] bg-[#f4f9ff]">
              <div className="vl-feature-visual h-60 shrink-0 overflow-hidden sm:h-64">
                <FeatureVisual kind={f.visual} />
              </div>
              <div className="flex flex-1 flex-col px-7 py-7 sm:px-8 sm:py-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#008be3]">
                  {f.eyebrow}
                </span>
                <h3 className="mt-2 font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] text-[#0b1b2b] sm:text-[22px]">
                  <Link href={f.href} className="transition-colors hover:text-[#008be3]">
                    {f.title}
                  </Link>
                </h3>
                <p className="mt-3 min-h-[4.5rem] text-[14px] leading-relaxed text-[#5b7290] sm:min-h-[5.25rem]">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureVisual({ kind }: { kind: VisualKind }) {
  if (kind === "formats") return <FormatsVisual />;
  if (kind === "chat") return <ChatVisual />;
  if (kind === "tokens") return <TokensVisual />;
  if (kind === "versions") return <VersionsVisual />;
  if (kind === "export") return <ExportVisual />;
  return <SpeedVisual />;
}

function FormatsVisual() {
  const items = ["Website", "Dashboard", "Poster", "Story", "Email", "Brand"];
  return (
    <div className="flex h-full flex-wrap content-center justify-center gap-2 p-8">
      {items.map((t, i) => (
        <span
          key={t}
          className="vl-pop vl-chip rounded-full border border-[#d6e6f7] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#3a5a7a] shadow-sm"
          style={{ transitionDelay: `${i * 0.04}s`, animationDelay: `${i * 0.3}s` }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function ChatVisual() {
  const bubbles = [
    { side: "end", text: "Warmer palette, tighter headline" },
    { side: "start", text: "Updated the accent and re-set the type scale." },
    { side: "end", text: "Make it more Swiss" },
  ] as const;

  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-7">
      {bubbles.map((b, i) => (
        <div
          key={b.text}
          className={`vl-chat-bubble max-w-[78%] ${
            b.side === "end"
              ? "self-end rounded-2xl rounded-br-sm bg-[#008be3] px-3.5 py-2 text-[12.5px] font-medium text-white"
              : "self-start rounded-2xl rounded-bl-sm border border-[#d6e6f7] bg-white px-3.5 py-2 text-[12.5px] text-[#3a5a7a]"
          }`}
          style={{ animationDelay: `${i * 0.85}s` }}
        >
          {b.text}
        </div>
      ))}
      <div className="mt-1 flex items-center gap-2 self-start rounded-full border border-[#d6e6f7] bg-white px-3 py-1.5 text-[11.5px] text-[#5b7290]">
        <span className="vl-typing flex items-center gap-0.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-1 rounded-full bg-[#008be3]" />
          ))}
        </span>
        Refining document
      </div>
    </div>
  );
}

function TokensVisual() {
  const swatches = ["#0b1b2b", "#008be3", "#7c7af0", "#e85a48", "#10ce6a"];
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-8">
      <div className="flex items-end gap-2">
        <span className="vl-pop font-display text-[40px] font-semibold leading-none text-[#0b1b2b]">Aa</span>
        <div className="pb-1 text-[11px] leading-tight text-[#5b7290]">
          <div className="font-medium text-[#3a5a7a]">Display</div>
          <div>48 / 1.05 / -3%</div>
        </div>
      </div>
      <div className="flex gap-2">
        {swatches.map((c, i) => (
          <span
            key={c}
            className="vl-swatch size-8 rounded-lg border border-black/5"
            style={{ background: c, animationDelay: `${0.08 + i * 0.09}s, ${i * 0.35}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function VersionsVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-3 px-7">
      {["A", "B", "C"].map((v, i) => (
        <div
          key={v}
          className="vl-pop relative aspect-[3/4] w-24 overflow-hidden rounded-xl border border-[#d6e6f7] bg-white shadow-sm"
          style={{
            transitionDelay: `${i * 0.07}s`,
            transform: `translateY(${(i - 1) * 10}px)`,
            animation: `vl-deal-in 0.7s var(--vl-ease) ${0.1 + i * 0.12}s both`,
          }}
        >
          <div className="h-8 border-b border-[#e9f3ff] bg-[#e9f3ff]" />
          <div className="space-y-1.5 p-2.5">
            <div className="h-1.5 w-3/4 rounded-full bg-[#0b1b2b]/70" />
            <div className="h-1 w-full rounded-full bg-[#d6e6f7]" />
            <div className="h-1 w-5/6 rounded-full bg-[#d6e6f7]" />
            <div className="mt-2 h-10 rounded-md bg-[#008be3]/12" />
          </div>
          <span className="absolute bottom-2 right-2 rounded-md bg-[#0b1b2b] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

function ExportVisual() {
  const lines = [
    { d: "  <Section", c: "text-[#7c7af0]" },
    { d: "    variant=\"hero\"", c: "text-[#0b8f4e]" },
    { d: "    accent=\"indigo\"", c: "text-[#0b8f4e]" },
    { d: "  />", c: "text-[#7c7af0]" },
  ];
  return (
    <div className="flex h-full items-center justify-center px-7">
      <div className="w-full rounded-xl border border-[#d6e6f7] bg-white p-4 font-mono text-[12px] leading-relaxed shadow-sm">
        {lines.map((l, i) => (
          <div
            key={i}
            className={`vl-code-line ${l.c}`}
            style={{ animationDelay: `${0.15 + i * 0.28}s` }}
          >
            {l.d}
            {i === lines.length - 1 ? <span className="vl-code-caret" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeedVisual() {
  const { display, ref } = useCountUp(2.4, 1500, 1);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="vl-count font-mono text-[56px] font-semibold leading-none tracking-[-0.04em] text-[#0b1b2b]">
        <span ref={ref}>{display}</span>s
      </div>
      <div className="flex items-center gap-2 text-[12px] font-medium text-[#5b7290]">
        <Sparkles className="vl-spark size-3.5 text-[#008be3]" />
        average render time
      </div>
    </div>
  );
}

/* 04 — Walkthrough (01 / 02) */

function Walkthrough() {
  return (
    <section id="walkthrough" className="scroll-mt-24 bg-[#f4f9ff] pt-20 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8 lg:px-12">
        <Reveal>
          <Eyebrow>Product walkthrough</Eyebrow>
          <SectionHeading first="See the answer." second="Then inspect the system behind it." className="mt-4" />
        </Reveal>
      </div>

      <Beat
        index="01 / 02"
        tint="lilac"
        title="Follow a direction from one line of intent."
        body="Read the exact decisions Velt made — format, grid, type scale, and palette — so the route from prompt to render stays legible."
        fact="Every render ships as an inspectable document, not a flat image."
        mock={<EditorMock />}
      />
      <Beat
        index="02 / 02"
        tint="mint"
        title="Turn one direction into a whole brand."
        body="The same tokens expand across web, product, social, and print. Change the source and every surface stays recognisably one system."
        fact="One source of truth keeps a brand coherent across every format."
        mock={<SystemMock />}
      />
    </section>
  );
}

function Beat({
  index,
  tint,
  title,
  body,
  fact,
  mock,
}: {
  index: string;
  tint: "lilac" | "mint";
  title: string;
  body: string;
  fact: string;
  mock: ReactNode;
}) {
  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 pb-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16 lg:pb-10">
          <Reveal>
            <span className="vl-stamp inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#008be3]">
              {index}
            </span>
            <h3 className="mt-3 font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0b1b2b] sm:text-[32px]">
              <Words text={title} />
            </h3>
          </Reveal>
          <Reveal delay={1}>
            <p className="max-w-2xl text-[15px] leading-relaxed text-[#5b7290] sm:text-[16px]">{body}</p>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-[#3a5a7a]">
              <span className="size-1.5 shrink-0 rounded-full bg-[#0b1b2b]/30" />
              {fact}
            </p>
          </Reveal>
        </div>

        <Reveal delay={2} className={`relative isolate overflow-hidden rounded-3xl p-2 outline outline-1 -outline-offset-1 outline-black/5 sm:p-10 lg:p-14 ${tint === "lilac" ? "vl-tint-lilac" : "vl-tint-mint"}`}>
          <div className="relative z-10 mx-auto max-w-5xl">{mock}</div>
        </Reveal>
      </div>
    </section>
  );
}

function MockShell({ active, children }: { active: string; children: ReactNode }) {
  const nav = ["Overview", "Formats", "Studio", "Assets", "Brand"];
  return (
    <div className="vl-pop vl-shadow flex flex-col overflow-hidden rounded-2xl bg-white md:min-h-[540px]">
      <div className="flex items-center gap-2 border-b border-[#e9f3ff] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-md bg-[#f4f9ff] px-3 py-1 text-[11.5px] text-[#5b7290]">
          velt.studio
        </span>
      </div>
      <div className="flex flex-1">
        <aside className="hidden w-52 shrink-0 border-r border-[#e9f3ff] bg-[#f4f9ff]/70 p-3 md:block">
          <div className="flex items-center gap-2 px-2 py-2 font-display text-[15px] font-semibold text-[#0b1b2b]">
            <span className="size-4 rounded-[5px] bg-[#008be3]" />
            Velt
          </div>
          <nav className="mt-2 space-y-1">
            {nav.map((n) => (
              <span
                key={n}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] ${
                  n === active
                    ? "bg-white font-medium text-[#0b1b2b] shadow-[0_0_0_1px_rgba(11,27,43,0.05)]"
                    : "text-[#5b7290]"
                }`}
              >
                <span className="size-3.5 rounded-[4px] bg-current opacity-40" />
                {n}
              </span>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 p-5 sm:p-7">{children}</div>
      </div>
    </div>
  );
}

function EditorMock() {
  const pages = [
    { label: "Hero — editorial cover", stage: 0 },
    { label: "Grid & type scale", stage: 1 },
    { label: "Palette & tokens", stage: 2 },
  ];
  return (
    <MockShell active="Studio">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display text-[18px] font-semibold tracking-[-0.02em] text-[#0b1b2b]">
            Studio
          </h4>
          <p className="text-[12px] text-[#5b7290]">Kyoto ceramics · one direction</p>
        </div>
        <span className="rounded-full bg-[#e9f3ff] px-3 py-1 text-[11.5px] font-medium text-[#008be3]">
          Refining
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-[#d6e6f7] bg-[#f4f9ff]/60 p-4">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-24 rounded-full bg-[#0b1b2b]/70" />
            <div className="h-6 w-16 rounded-full bg-[#008be3]" />
          </div>
          <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-[#008be3]/25 to-[#7c7af0]/25" />
          <div className="mt-4 space-y-2">
            <div className="h-2 w-5/6 rounded-full bg-[#0b1b2b]/25" />
            <div className="h-2 w-full rounded-full bg-[#0b1b2b]/12" />
            <div className="h-2 w-2/3 rounded-full bg-[#0b1b2b]/12" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-lg border border-[#d6e6f7] bg-white" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {pages.map((p, i) => (
            <div
              key={p.label}
              className="vl-page flex items-center gap-3 rounded-xl border border-[#d6e6f7] bg-white px-3.5 py-3"
              style={{ animation: `vl-page-in 7.2s var(--vl-ease) ${i * 1.1}s infinite both` }}
            >
              <span
                className="vl-badge flex size-6 shrink-0 items-center justify-center rounded-md bg-[#e9f3ff] font-mono text-[10.5px] font-medium text-[#008be3]"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate text-[12.5px] text-[#3a5a7a]">{p.label}</span>
            </div>
          ))}
          <div className="rounded-xl border border-[#d6e6f7] bg-white p-3.5">
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#5b7290]">
              Type scale
            </div>
            <div className="mt-2 flex items-end gap-2 text-[#0b1b2b]">
              <span className="font-display text-[28px] font-semibold leading-none">Aa</span>
              <span className="font-display text-[20px] leading-none">Aa</span>
              <span className="font-display text-[15px] leading-none">Aa</span>
              <span className="font-display text-[12px] leading-none">Aa</span>
            </div>
          </div>
        </div>
      </div>
    </MockShell>
  );
}

function SystemMock() {
  const surfaces = [
    { n: "Website", meta: "12 pages", color: "#008be3" },
    { n: "App screen", meta: "6 flows", color: "#7c7af0" },
    { n: "Poster", meta: "A2 print", color: "#e85a48" },
    { n: "Story", meta: "9:16", color: "#10ce6a" },
  ];
  return (
    <MockShell active="Formats">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display text-[18px] font-semibold tracking-[-0.02em] text-[#0b1b2b]">
            Formats
          </h4>
          <p className="text-[12px] text-[#5b7290]">One brand system · four surfaces</p>
        </div>
        <span className="rounded-full bg-[#10ce6a]/10 px-3 py-1 text-[11.5px] font-semibold text-[#0b8f4e]">
          Coherent
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {surfaces.map((s, i) => (
          <div
            key={s.n}
            className="vl-page overflow-hidden rounded-xl border border-[#d6e6f7] bg-white"
            style={{ animation: `vl-page-in 7.2s var(--vl-ease) ${i * 0.9}s infinite both` }}
          >
            <div className="flex items-center justify-between border-b border-[#e9f3ff] px-3.5 py-2.5">
              <span className="text-[12.5px] font-medium text-[#0b1b2b]">{s.n}</span>
              <span className="text-[11px] text-[#5b7290]">{s.meta}</span>
            </div>
            <div className="p-3.5">
              <div className="h-3 w-2/3 rounded-full" style={{ background: s.color, opacity: 0.85 }} />
              <div className="mt-2.5 h-2 w-full rounded-full bg-[#0b1b2b]/10" />
              <div className="mt-1.5 h-2 w-4/5 rounded-full bg-[#0b1b2b]/10" />
              <div className="mt-3 h-12 rounded-lg" style={{ background: `${s.color}1f` }} />
            </div>
          </div>
        ))}
      </div>
    </MockShell>
  );
}

/* 05 — Method */

function Method() {
  return (
    <section id="method" className="scroll-mt-24 border-y border-[#d6e6f7] bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Reveal>
            <Eyebrow>The method</Eyebrow>
            <SectionHeading first="Design decisions," second="made explicit." className="mt-4" />
            <Reveal as="p" delay={1} className="mt-6 max-w-md text-[15px] leading-relaxed text-[#5b7290]">
              Velt is opinionated about the things that make design legible — hierarchy, rhythm, restraint — while staying neutral about your taste.
            </Reveal>
          </Reveal>

          <dl>
            {PRINCIPLES.map((p, i) => (
              <Reveal
                key={p.k}
                delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
                className="grid gap-2 border-t border-[#d6e6f7] py-6 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:gap-8"
              >
                <dt className="font-display text-[20px] leading-snug tracking-[-0.02em] text-[#0b1b2b] sm:text-[22px]">
                  {p.k}
                </dt>
                <dd className="text-[14px] leading-relaxed text-[#5b7290] sm:text-[15px]">{p.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* 06 — FAQ */

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 bg-[#f4f9ff] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <SectionHeading first="Questions, answered." className="mt-4" />
        </Reveal>

        <Reveal delay={1} className="mt-10 rounded-3xl bg-[#e9f3ff] p-2">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`overflow-hidden border border-[#d6e6f7]/60 bg-white first:rounded-t-[26px] last:rounded-b-[26px] ${
                  i > 0 ? "border-t-0" : ""
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-h-16 w-full items-center justify-between gap-6 px-5 py-4 text-left transition-colors hover:bg-[#f4f9ff]/60"
                >
                  <span className="text-[15px] font-medium text-[#0b1b2b] sm:text-[16px]">{item.q}</span>
                  <span className="relative flex size-5 shrink-0 items-center justify-center">
                    <span className="absolute h-px w-3.5 bg-[#5b7290]" />
                    <span
                      className={`absolute h-3.5 w-px bg-[#5b7290] transition-all duration-300 ${
                        isOpen ? "rotate-90 opacity-0" : "opacity-100"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5">
                      <p className="text-[14px] leading-relaxed text-[#5b7290]">{item.a}</p>
                      <Link
                        href={item.href}
                        className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-[#008be3] underline-offset-4 hover:underline"
                      >
                        {item.link}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* 07 — Closing */

function Closing() {
  return (
    <section id="start" className="scroll-mt-24 bg-white px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-12 lg:pb-28 lg:pt-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="relative isolate overflow-hidden rounded-3xl bg-[#008be3] px-6 py-16 text-center sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-[#00a5ef] blur-3xl" />
            <div className="absolute -bottom-28 -right-16 size-80 rounded-full bg-[#7c7af0] blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Web design
            </span>
            <h2 className="vl-words mt-4 font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-[54px]">
              <Words text="Make anything you imagine." />
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-[16px]">
              Each piece was made from a single line with Velt, generated on the first try in seconds.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-[#008be3] shadow-[inset_0px_1px_0px_rgba(255,255,255,0.5)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Start creating
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </Link>
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Browse showcases
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1} className="vl-marquee-mask relative left-1/2 right-1/2 mt-14 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
          <div className="vl-marquee vl-marquee-reverse flex w-max items-stretch gap-4">
            {[...SHOWCASES, ...SHOWCASES].map((item, i) => {
              const doc = SAMPLES[(item.index + 3) % SAMPLES.length];
              return (
                <figure key={`c-${doc.name}-${i}`} className="w-[70vw] max-w-[380px] shrink-0 overflow-hidden rounded-2xl border border-[#d6e6f7] bg-white sm:w-[420px]">
                  <div className="relative isolate aspect-[4/3] overflow-hidden bg-[#eef6ff]">
                    <div className="pointer-events-none absolute inset-0">
                      <ScaledMockup doc={doc} fit="width" maxScale={0.32} />
                    </div>
                  </div>
                  <figcaption className="px-4 py-3 text-[12px] text-[#5b7290]">{item.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
