"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
import { SAMPLES } from "@/lib/samples";
import { getToken } from "@/lib/api";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { SakuraPetals } from "./SakuraPetals";
import { Foliage } from "./Foliage";
import { DemoCanvas } from "./ProductDemo";

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
    accent: "var(--demo-violet)",
  },
  {
    no: "02",
    title: "Velt composes",
    body: "The engine resolves format, type scale, grid, palette, and hierarchy. You get a complete, coherent design — not a moodboard.",
    accent: "var(--demo-coral)",
  },
  {
    no: "03",
    title: "Direct the details",
    body: "React in plain language. Move an accent, tighten the headline, change the tone. Each pass refines the same document, in place.",
    accent: "var(--demo-teal)",
  },
  {
    no: "04",
    title: "Take it anywhere",
    body: "One direction expands across web, product, social, print, and brand. Export clean components or ship the source directly.",
    accent: "var(--demo-amber)",
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

const findDoc = (name: string) => {
  const doc = SAMPLES.find((s) => s.name.toLowerCase() === name.toLowerCase());
  if (!doc) throw new Error(`sample "${name}" not found`);
  return doc;
};

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

    const elements = document.querySelectorAll(".ed-reveal, .ed-clip, .ed-rule, .ed-line-draw, .demo-scene");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f2ee] text-[#16151a]">
      <Nav overHero />
      <Hero />
      <Showcase />
      <HowItWorks />
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
      {/* 4K Daylight Landscape: responsive portrait on mobile, ultra-wide on desktop.
          srcset lets high-DPI phones pull the sharper 4K master. */}
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/hero-day-mobile.jpg?v=2 780w, /hero-day.jpg?v=11 3840w"
          sizes="100vw"
        />
        <source
          media="(min-width: 640px)"
          srcSet="/hero-day.jpg?v=11 3840w"
          sizes="100vw"
        />
        <img src="/hero-day.jpg?v=11" alt="" className="hero-photo select-none" fetchPriority="high" />
      </picture>

      {/* Drifting animated cherry blossom petals */}
      <SakuraPetals />

      {/* Falling foliage — layered with the petals */}
      <Foliage />

      {/* Deep azure blue top wash for crystal-clear white text contrast */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#0b387e]/45 via-[#1d59b3]/15 to-transparent sm:from-[#0b387e]/35 sm:via-[#1d59b3]/10" />

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
            textShadow: "0 4px 24px rgba(5, 30, 80, 0.6), 0 1px 3px rgba(0, 15, 50, 0.8)",
            margin: 0,
          }}
        >
          Velt
        </h1>

        {/* Subtitle */}
        <p className="mt-2.5 sm:mt-4 max-w-[340px] sm:max-w-[580px] px-2 text-[15px] sm:text-[22px] font-medium leading-[1.45] text-white [text-shadow:0_2px_14px_rgba(5,25,70,0.65),0_1px_3px_rgba(0,15,50,0.85)]">
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
          <span className="mr-0.5 font-medium text-white/85 [text-shadow:0_1px_4px_rgba(0,15,50,0.6)]">Try:</span>
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

function SectionLabel({ index, children, tone = "violet" }: { index: string; children: string; tone?: "violet" | "coral" | "teal" | "amber" }) {
  const dot = {
    violet: "var(--demo-violet)",
    coral: "var(--demo-coral)",
    teal: "var(--demo-teal)",
    amber: "var(--demo-amber)",
  }[tone];
  return (
    <div className="ed-reveal demo-eyebrow text-[#8b8780]">
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      <span>{index}</span>
      <span className="opacity-40">—</span>
      <span>{children}</span>
    </div>
  );
}

function Marquee({ reverse = false, children }: { reverse?: boolean; children: ReactNode }) {
  return (
    <div className="ed-marquee-mask relative mt-10 w-full overflow-hidden">
      <div
        className="ed-marquee flex w-max items-stretch gap-4 px-4 sm:gap-6"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

function ShowcaseCard({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="group relative w-[72vw] max-w-[380px] shrink-0 overflow-hidden rounded-2xl border border-[#e3e0d9] bg-white shadow-[0_18px_40px_-24px_rgba(22,21,26,0.35)] sm:w-[440px]">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <figcaption className="flex items-center gap-2 px-4 py-3 text-[12.5px] text-[#6f6b64]">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--demo-coral)]" />
        {caption}
      </figcaption>
    </figure>
  );
}

function Showcase() {
  return (
    <section className="border-b border-[#e3e0d9] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-10">
        <SectionLabel index="Output" tone="coral">Made with Velt</SectionLabel>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="ed-clip demo-display max-w-[15ch] text-[38px] sm:text-[64px]">
            <span>A studio in a sentence.</span>
          </h2>
          <p className="ed-reveal max-w-[36ch] text-[15px] leading-relaxed text-[#6f6b64] sm:text-[16px]" data-delay="1">
            Every direction below began as a single line of plain language. No template was chosen. Nothing was assembled by hand.
          </p>
        </div>
      </div>

      <Marquee>
        {[...SHOWCASES, ...SHOWCASES].map((item, i) => (
          <ShowcaseCard key={item.src + i} {...item} />
        ))}
      </Marquee>
      <Marquee reverse>
        {[...SHOWCASES.slice(4), ...SHOWCASES.slice(0, 4), ...SHOWCASES.slice(4), ...SHOWCASES.slice(0, 4)].map((item, i) => (
          <ShowcaseCard key={`b-${item.src}-${i}`} {...item} />
        ))}
      </Marquee>
    </section>
  );
}

function StepPromptDemo() {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "generating" | "done">("typing");
  const full = "Dark creative studio site for an art direction team.";

  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i < full.length) {
        timer = setTimeout(tick, 42);
      } else {
        timer = setTimeout(() => setPhase("generating"), 550);
        timer = setTimeout(() => setPhase("done"), 1900);
      }
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div className="rounded-2xl border border-[#e3e0d9] bg-white p-4 shadow-[0_18px_40px_-26px_rgba(22,21,26,0.3)]">
        <div className="flex items-start gap-2.5 text-[14px] text-[#16151a]">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--demo-violet)] text-[10px] font-bold text-white">
            V
          </span>
          <p className="leading-snug">
            {typed}
            {phase === "typing" ? <span className="demo-caret" /> : null}
          </p>
        </div>
        {phase !== "typing" ? (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eeece7]">
            <div
              className={`h-full rounded-full bg-[var(--demo-violet)] transition-all duration-700 ${
                phase === "done" ? "w-full" : "demo-sweep w-2/3"
              }`}
            />
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute -bottom-8 -right-3 hidden sm:block">
        <div className="demo-float rounded-xl border border-[#e3e0d9] bg-white px-3 py-2 text-[11px] font-medium shadow-lg">
          <span className="text-[var(--demo-violet)]">●</span> composing layout…
        </div>
      </div>
    </div>
  );
}

function StepChatDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2200);
    return () => clearInterval(t);
  }, []);
  const bubbles = [
    { me: true, text: "Make the headline bolder and add warm accents." },
    { me: false, text: "Done — tightened the hierarchy and switched the accent to terracotta." },
    { me: false, text: "Reflowed the hero for mobile at the same time." },
  ];
  return (
    <div className="space-y-2.5">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className={`flex transition-all duration-500 ${b.me ? "justify-end" : "justify-start"} ${
            step >= i + 1 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {!b.me ? (
            <span className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--demo-teal)] text-[10px] font-bold text-white">
              V
            </span>
          ) : null}
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-snug ${
              b.me
                ? "rounded-tr-sm bg-[#16151a] text-white"
                : "rounded-tl-sm border border-[#e3e0d9] bg-white text-[#16151a] shadow-sm"
            }`}
          >
            {b.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const showcaseDoc = findDoc("Lumen");
  const editDoc = findDoc("Kama");

  return (
    <section id="how" className="demo-stage border-b border-[#e3e0d9] px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="Process" tone="violet">How it works</SectionLabel>

        <h2 className="ed-clip demo-display mt-6 max-w-[18ch] text-[38px] sm:text-[64px]">
          <span>From a sentence to a system.</span>
        </h2>
        <p className="ed-reveal mt-5 max-w-[50ch] text-[15px] leading-relaxed text-[#6f6b64] sm:text-[17px]" data-delay="1">
          Four moves. No forms to fill, no components to drag. You direct the work the way you would direct a designer.
        </p>

        <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-28">
          {STEPS.map((step, i) => {
            const live = active === i;
            const flip = i % 2 === 1;
            return (
              <div
                key={step.no}
                data-step={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="demo-scene grid list-none items-center gap-8 md:grid-cols-2 md:gap-16"
              >
                <div className={`${flip ? "md:order-2" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white"
                      style={{ background: step.accent, boxShadow: `0 8px 24px -8px ${step.accent}` }}
                    >
                      {step.no}
                    </span>
                    <span
                      className="text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300"
                      style={{ color: live ? step.accent : "#a8a49d" }}
                    >
                      Step {i + 1} of 4
                    </span>
                  </div>
                  <h3 className="demo-display mt-5 text-[30px] sm:text-[42px]">{step.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-[#6f6b64] sm:text-[16.5px]">{step.body}</p>
                </div>

                <div className={`${flip ? "md:order-1" : ""}`}>
                  {i === 0 ? <StepPromptDemo /> : null}
                  {i === 1 ? (
                    <DemoCanvas doc={showcaseDoc} baseWidth={1280} device="browser" maxHeight={280} />
                  ) : null}
                  {i === 2 ? (
                    <div className="rounded-2xl border border-[#e3e0d9] bg-white p-4 shadow-[0_18px_40px_-26px_rgba(22,21,26,0.3)] sm:p-5">
                      <StepChatDemo />
                    </div>
                  ) : null}
                  {i === 3 ? (
                    <div className="grid grid-cols-2 gap-4">
                      <DemoCanvas doc={editDoc} baseWidth={1280} device="browser" maxHeight={220} />
                      <DemoCanvas doc={findDoc("Loaf")} baseWidth={390} device="phone" maxHeight={220} />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const featured = [
    { doc: findDoc("House"), label: "Dashboards", tone: "var(--demo-amber)" },
    { doc: findDoc("Quill"), label: "Landing pages", tone: "var(--demo-violet)" },
    { doc: findDoc("Loaf"), label: "Mobile apps", tone: "var(--demo-coral)" },
    { doc: findDoc("AURELI"), label: "Websites", tone: "var(--demo-teal)" },
  ];

  return (
    <section className="border-b border-[#e3e0d9] px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="Formats" tone="teal">One engine, every surface</SectionLabel>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="ed-clip demo-display max-w-[16ch] text-[38px] sm:text-[64px]">
            <span>Built for the whole brief.</span>
          </h2>
          <p className="ed-reveal max-w-[36ch] text-[15px] leading-relaxed text-[#6f6b64] sm:text-[16px]" data-delay="1">
            Fourteen formats spanning web, product, marketing, and brand — all drawn from one coherent design document.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {featured.map((f, i) => (
            <div key={f.label} className="demo-scene" data-delay={String((i % 3) + 1) as "1" | "2" | "3"}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.tone }} />
                <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-[#6f6b64]">{f.label}</span>
              </div>
              <DemoCanvas doc={f.doc} baseWidth={f.doc.format === "app" ? 390 : 1280} device={f.doc.format === "app" ? "phone" : "browser"} maxHeight={260} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3">
          {FORMATS.map((f) => (
            <span key={f.id} className="inline-flex items-center gap-2 text-[13px] font-medium text-[#6f6b64]">
              <f.icon className="size-4 text-[#a8a49d]" strokeWidth={1.75} />
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
    <section className="border-b border-[#e3e0d9] px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="Pricing" tone="amber">Simple and honest</SectionLabel>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="ed-clip demo-display max-w-[16ch] text-[38px] sm:text-[64px]">
              <span>Priced for momentum.</span>
            </h2>
            <p className="ed-reveal mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[#6f6b64] sm:text-[16px]" data-delay="1">
              Start on a three-day trial. Cancel whenever. Every plan includes the full format engine.
            </p>
          </div>

          <div className="ed-reveal inline-flex self-start rounded-full border border-[#e3e0d9] bg-white p-1 text-[13px] font-medium sm:self-auto" data-delay="2">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 transition-colors ${!yearly ? "bg-[#16151a] text-white" : "text-[#6f6b64] hover:text-[#16151a]"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-4 py-1.5 transition-colors ${yearly ? "bg-[#16151a] text-white" : "text-[#6f6b64] hover:text-[#16151a]"}`}
            >
              Annually · Save 30%
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((plan, i) => {
            const price = yearly ? Math.round(plan.monthly * 0.7) : plan.monthly;
            const featured = i === 1;
            return (
              <div
                key={plan.name}
                className={`demo-scene relative flex flex-col rounded-3xl border p-7 sm:p-8 ${
                  featured
                    ? "border-transparent bg-[#16151a] text-white shadow-[0_30px_70px_-30px_rgba(22,21,26,0.6)]"
                    : "border-[#e3e0d9] bg-white text-[#16151a]"
                }`}
                data-delay={String(i + 1) as "1" | "2" | "3"}
              >
                {featured ? (
                  <span className="absolute -top-3 left-7 rounded-full bg-[var(--demo-violet)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                ) : null}
                <span className="text-[13px] font-semibold uppercase tracking-[0.16em]">{plan.name}</span>
                <p className={`mt-1 text-[13px] ${featured ? "text-white/60" : "text-[#6f6b64]"}`}>{plan.note}</p>
                <div className="demo-display mt-6 text-[52px] leading-none">
                  ${price}
                  <span className="font-sans text-[14px] tracking-normal opacity-50"> / mo</span>
                </div>
                <Link
                  href="/signup"
                  className={`mt-7 block rounded-full py-3 text-center text-[13.5px] font-semibold transition-all ${
                    featured ? "bg-white text-[#16151a] hover:scale-[1.02]" : "bg-[#16151a] text-white hover:scale-[1.02]"
                  }`}
                >
                  Start free trial
                </Link>
                <p className={`mt-3 text-[12px] ${featured ? "text-white/50" : "text-[#a8a49d]"}`}>
                  3-day free trial. Cancel anytime.
                </p>
                <ul className={`mt-7 space-y-2.5 border-t pt-7 text-[13.5px] ${featured ? "border-white/15" : "border-[#e3e0d9]"}`}>
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={15} className={`mt-0.5 shrink-0 ${featured ? "text-[var(--demo-violet)]" : "text-[var(--demo-teal)]"}`} />
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
    <section className="border-b border-[#e3e0d9] px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[900px]">
        <SectionLabel index="Questions" tone="violet">Before you begin</SectionLabel>

        <h2 className="ed-clip demo-display mt-6 max-w-[18ch] text-[38px] sm:text-[60px]">
          <span>Answers, up front.</span>
        </h2>

        <div className="mt-10">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="ed-reveal border-t border-[#e3e0d9]" data-delay={String((i % 5) + 1) as "1" | "2" | "3" | "4" | "5"}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[16px] font-medium text-[#16151a] sm:text-[18px]">{item.q}</span>
                  <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#e3e0d9] transition-colors group-hover:border-[#16151a]">
                    <span className="absolute h-px w-3 bg-[#16151a]" />
                    <span
                      className={`absolute h-3 w-px bg-[#16151a] transition-all duration-300 ${
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
                    <p className="max-w-[62ch] pb-6 text-[14.5px] leading-relaxed text-[#6f6b64] sm:text-[15.5px]">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-t border-[#e3e0d9] pt-6">
            <p className="text-[14px] text-[#6f6b64]">
              Still curious?{" "}
              <a href="mailto:hello@velt.app" className="font-medium text-[var(--demo-violet)] underline-offset-4 hover:underline">
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
  const hero = findDoc("Lumen");
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1180px]">
        <div className="demo-scene rounded-[32px] border border-[#e3e0d9] bg-white p-8 sm:p-14">
          <div className="flex flex-col items-center text-center">
            <SectionLabel index="Start" tone="coral">Free for three days</SectionLabel>
            <h2 className="ed-clip demo-display mt-6 max-w-[16ch] text-[42px] leading-[0.98] sm:text-[84px]">
              <span>Make anything you imagine.</span>
            </h2>
            <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-[#6f6b64] sm:text-[17px]">
              Describe it once. Refine it in plain language. Ship it everywhere.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#16151a] px-7 py-3.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Start creating
              <ArrowUp className="size-4 rotate-45" strokeWidth={2.2} />
            </Link>
          </div>

          <div className="mt-12">
            <DemoCanvas doc={hero} baseWidth={1280} device="browser" maxHeight={380} />
          </div>
        </div>
      </div>
    </section>
  );
}
