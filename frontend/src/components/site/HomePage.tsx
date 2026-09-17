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
import { getToken, saveSession, velt } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import { SAMPLES } from "@/lib/samples";
import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Starfield } from "./Starfield";
import { HeroProtos } from "./HeroProtos";
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

export function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <Nav overHero />
      <Hero />
      <div className="scroll-reveal"><Building /></div>
      <div className="scroll-reveal"><NeedTeam /></div>
      <div className="scroll-reveal"><ModernByDefault /></div>
      <div className="scroll-reveal"><Pricing /></div>
      <div className="scroll-reveal"><FAQ /></div>
      <Footer />
    </main>
  );
}

function Hero() {
 const { theme } = useTheme();
 const night = theme === "dark";
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
      {/* 4K Daylight Landscape: Responsive portrait on mobile, ultra-wide landscape on desktop */}
      <picture>
        <source media="(max-width: 639px)" srcSet="/hero-day-mobile.jpg?v=2" />
        <img src="/hero-day.jpg?v=11" alt="" className="hero-photo select-none" />
      </picture>

      {/* Drifting animated cherry blossom petals */}
      <SakuraPetals />

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

function MarqueeRow({ items, reverse = false }: { items: typeof SHOWCASES; reverse?: boolean }) {
 const loop = [...items, ...items];
 return (
 <div
 className="w-full overflow-hidden"
 style={{
 maskImage: "linear-gradient(to right, transparent 0, black 4%, black 96%, transparent 100%)",
 WebkitMaskImage: "linear-gradient(to right, transparent 0, black 4%, black 96%, transparent 100%)",
 }}
 >
 <div className={`flex w-max items-start gap-4.5 ${reverse ? "marquee-right" : "marquee-left"}`}>
 {loop.map((item, i) => (
 <div
 key={item.src + i}
 className="w-[80vw] max-w-[360px] shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:scale-[1.01] (0,0,0,0.5)] sm:w-[500px] sm:max-w-none"
 >
 <img src={item.src} alt="" className="block h-auto w-full object-cover transition-opacity hover:opacity-95" />
 </div>
 ))}
 </div>
 </div>
 );
}

function LiveMarquee({ reverse = false }: { reverse?: boolean }) {
 const items = [...SAMPLES, ...SAMPLES];
 return (
 <div
 className="w-full overflow-hidden"
 style={{
 maskImage: "linear-gradient(to right, transparent 0, black 4%, black 96%, transparent 100%)",
 WebkitMaskImage: "linear-gradient(to right, transparent 0, black 4%, black 96%, transparent 100%)",
 }}
 >
 <div className={`flex w-max items-start gap-4.5 ${reverse ? "marquee-right" : "marquee-left"}`}>
 {items.map((doc, i) => (
 <div
 key={`${doc.name}-${i}`}
 className="h-[230px] w-[300px] shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:scale-[1.01] (0,0,0,0.5)] sm:w-[340px]"
 >
 <div
 className="origin-top-left"
 style={{
 width: doc.format === "app" ? 390 : 1280,
 transform: `scale(${doc.format === "app" ? 0.72 : 0.26})`,
 }}
 >
 <PrototypeRenderer doc={doc} />
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}

function Building() {
 return (
 <section className="w-full px-5 pb-8 pt-7 text-slate-950 sm:px-10 sm:pb-10 sm:pt-7">
 <h2 className="font-lastik max-w-full -rotate-1 text-left text-[16px] leading-[1.08] tracking-[-0.005em] text-[#111] sm:text-[22px] sm:tracking-[-0.02em]">
 See what people are building 👀
 </h2>
 <div className="marquee-mask relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-3 w-screen overflow-hidden">
 <div className="flex w-full flex-col gap-4 py-2">
 <MarqueeRow items={SHOWCASES.slice(0, 4)} />
 <LiveMarquee reverse />
 <MarqueeRow items={SHOWCASES.slice(4)} reverse />
 </div>
 </div>
 </section>
 );
}

function NeedTeam() {
  return (
    <section className="mx-auto flex max-w-[860px] flex-col items-center px-6 py-20 text-center">
      <h2 className="reveal-on-view font-lastik mt-4 text-[30px] leading-[1.15] text-[#2d2d2d] sm:text-[44px]">
        You don&apos;t need a design team
        <br />
        to bring an idea to life.
      </h2>
      <div className="mt-11 grid w-full max-w-[760px] grid-cols-3 gap-2 sm:mt-16 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-0">
        <NeedCol
          label="Landing pages"
          animClass="anim-icon-active"
          svg={
            <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 text-sky-500 drop-shadow-[0_4px_12px_rgba(14,165,233,0.25)] transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20">
              <rect x="6" y="10" width="52" height="44" rx="4" stroke="currentColor" strokeWidth="2.5" />
              <path d="M6 20 L58 20" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="11" cy="15" r="1.2" fill="currentColor" />
              <circle cx="15.5" cy="15" r="1.2" fill="currentColor" />
              <circle cx="20" cy="15" r="1.2" fill="currentColor" />
              <rect x="12" y="26" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
              <rect x="12" y="33" width="14" height="14" rx="2" fill="currentColor" className="anim-pulse-subtle" />
              <rect x="30" y="33" width="22" height="6" rx="1.5" fill="currentColor" opacity="0.3" />
              <rect x="30" y="42" width="22" height="5" rx="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          }
        />
        <span aria-hidden className="hidden h-20 w-px bg-slate-200/80 sm:block" />
        <NeedCol
          label="Graphic design"
          animClass="anim-icon-active-delay-1"
          svg={
            <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 text-sky-500 drop-shadow-[0_4px_12px_rgba(14,165,233,0.25)] transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20">
              <rect x="12" y="10" width="40" height="44" rx="3" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="32" cy="28" r="8" stroke="currentColor" strokeWidth="2.5" className="anim-pulse-subtle" />
              <path d="M18 46 L28 34 L36 40 L46 28" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
          }
        />
        <span aria-hidden className="hidden h-20 w-px bg-slate-200/80 sm:block" />
        <NeedCol
          label="Marketing"
          animClass="anim-icon-active-delay-2"
          svg={
            <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 text-sky-500 drop-shadow-[0_4px_12px_rgba(14,165,233,0.25)] transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20">
              <path d="M12 40 L20 28 L28 34 L40 16 L52 40" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <rect x="10" y="40" width="44" height="8" rx="2" fill="currentColor" className="anim-pulse-subtle" />
            </svg>
          }
        />
      </div>
      <p className="mt-8 text-[14px] text-slate-500 sm:text-[16px]">From a single prompt using velt.</p>
    </section>
  );
}

function NeedCol({ label, svg, animClass = "" }: { label: string; svg: ReactNode; animClass?: string }) {
  return (
    <div className={`group flex min-w-0 flex-col items-center gap-3 px-1 py-2 cursor-pointer sm:gap-4 sm:px-0 sm:py-0 ${animClass}`}>
      <div className="transition-transform duration-300 group-hover:-translate-y-1">
        {svg}
      </div>
      <span className="text-center text-[13px] font-medium leading-[1.15] text-[#202020] transition-colors group-hover:text-sky-600 sm:text-[19px]">{label}</span>
    </div>
  );
}

function ModernByDefault() {
  const [activeFormat, setActiveFormat] = useState("Website");
  const [chatStep, setChatStep] = useState(0);

  const formats = [
    { name: "Website", icon: "🌐", tag: "Landing page", desc: "Clean responsive web pages" },
    { name: "Ads", icon: "📣", tag: "Display & Social ads", desc: "High CTR ad creatives" },
    { name: "Post", icon: "📱", tag: "Social media", desc: "Instagram & X square layouts" },
    { name: "Graphic", icon: "🎨", tag: "Editorial & Vector", desc: "Posters, flyers & illustrations" },
    { name: "Marketing", icon: "📊", tag: "Conversion decks", desc: "Pitch slides & one-pagers" },
  ];

  useEffect(() => {
    const t = setInterval(() => setChatStep((s) => (s + 1) % 3), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="how" className="mx-auto max-w-[1040px] px-5 py-12 sm:px-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800">
          ✨ Playful & High-Fidelity
        </span>
        <h2 className="font-lastik mt-3 text-center text-[32px] leading-[1.12] text-[#202020] sm:text-[46px]">
          Modern designs by default.
        </h2>
        <p className="mx-auto mt-3 max-w-[580px] text-center text-[16px] text-slate-600 sm:text-[18px]">
          Generate bespoke layouts with AI, then shape every detail, color, and character in real-time.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Card 1: From prompt to polished design (Lavender Card with Mascot) */}
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-purple-200/70 bg-gradient-to-br from-[#F5F0FF] via-[#F8F5FF] to-[#EDE5FF] p-7 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100 sm:p-9">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-purple-200/70 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-purple-800">
                Instant Creation
              </span>
              {/* Cute purple blob mascot */}
              <div className="animate-mascot-bob">
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="drop-shadow-md">
                  <path
                    d="M20,50 C20,25 35,15 50,15 C65,15 80,25 80,50 C80,75 68,85 50,85 C32,85 20,75 20,50 Z"
                    fill="#9333EA"
                  />
                  {/* Cheeks */}
                  <ellipse cx="32" cy="55" rx="5" ry="3" fill="#C084FC" opacity="0.6" />
                  <ellipse cx="68" cy="55" rx="5" ry="3" fill="#C084FC" opacity="0.6" />
                  {/* Blinking eyes */}
                  <g className="animate-mascot-blink">
                    <circle cx="38" cy="46" r="4.5" fill="#FFFFFF" />
                    <circle cx="40" cy="45" r="1.8" fill="#1E1B4B" />
                    <circle cx="62" cy="46" r="4.5" fill="#FFFFFF" />
                    <circle cx="64" cy="45" r="1.8" fill="#1E1B4B" />
                  </g>
                  {/* Happy Smile */}
                  <path d="M44,56 Q50,63 56,56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>

            <h3 className="font-lastik mt-3 text-[28px] leading-[1.15] text-[#221738] sm:text-[34px]">
              From prompt<br />to polished design.
            </h3>
            <p className="mt-2.5 max-w-sm text-[14px] leading-relaxed text-purple-950/70">
              Describe what you need in plain words. Velt instantly creates balanced typography, visual hierarchy, and production assets.
            </p>
          </div>

          {/* Interactive Micro-UI: Prompt Box transforming to Design Card */}
          <div className="relative mt-8 rounded-2xl border border-purple-200/80 bg-white/90 p-4 shadow-sm backdrop-blur transition-all duration-300 group-hover:border-purple-300">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white">✨</span>
              <span>Prompt:</span>
              <span className="font-mono text-[11px] text-purple-600">"Editorial brand identity for organic tea"</span>
            </div>
            
            <div className="mt-3 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-400">
                <path d="M12 4v16m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-purple-100 bg-[#FAF7F2] p-4 text-slate-800">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-purple-900/60 font-semibold">
                <span>OCHA TEA · KYOTO</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] text-emerald-800">Ready</span>
              </div>
              <p className="font-lastik mt-2 text-lg font-medium leading-tight text-[#2D241E]">
                Stillness in every harvest.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-[#2D241E] px-3 py-1 text-[10px] font-semibold text-white">Explore blends</span>
                <span className="text-[10px] font-medium text-slate-500">Edition 04</span>
              </div>
            </div>
          </div>
        </article>

        {/* Card 2: Edit your design through chat (Soft Cyan Card with Blue Mascot) */}
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-sky-200/70 bg-gradient-to-br from-[#F0F8FF] via-[#F4FAFF] to-[#E6F3FF] p-7 transition-all duration-300 hover:shadow-xl hover:shadow-sky-100 sm:p-9">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-sky-200/70 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sky-800">
                Chat Refinement
              </span>
              {/* Cute blue blob mascot */}
              <div className="animate-mascot-bob" style={{ animationDelay: "0.8s" }}>
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="drop-shadow-md">
                  <path
                    d="M25,45 C20,25 35,15 50,15 C65,15 80,25 75,45 C70,70 65,85 50,85 C35,85 30,70 25,45 Z"
                    fill="#0284C7"
                  />
                  {/* Cheeks */}
                  <ellipse cx="32" cy="52" rx="4" ry="2.5" fill="#38BDF8" opacity="0.7" />
                  <ellipse cx="68" cy="52" rx="4" ry="2.5" fill="#38BDF8" opacity="0.7" />
                  {/* Eyes */}
                  <g className="animate-mascot-blink">
                    <circle cx="38" cy="44" r="4.5" fill="#FFFFFF" />
                    <circle cx="40" cy="44" r="2" fill="#0C4A6E" />
                    <circle cx="62" cy="44" r="4.5" fill="#FFFFFF" />
                    <circle cx="64" cy="44" r="2" fill="#0C4A6E" />
                  </g>
                  {/* Waving hand */}
                  <path d="M75,55 C85,50 88,40 85,35" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" className="animate-mascot-wave" />
                  {/* Cute curved mouth */}
                  <path d="M46,55 Q50,60 54,55" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>

            <h3 className="font-lastik mt-3 text-[28px] leading-[1.15] text-[#0C3247] sm:text-[34px]">
              Edit your design<br />through chat.
            </h3>
            <p className="mt-2.5 max-w-sm text-[14px] leading-relaxed text-sky-950/70">
              Direct the AI like a senior art director. Tweak typography, shift color accents, or restructure layouts with simple feedback.
            </p>
          </div>

          {/* Interactive Chat Bubble Sequence */}
          <div className="relative mt-8 space-y-2.5 rounded-2xl border border-sky-200/80 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className={`transition-all duration-300 ${chatStep >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-sky-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm">
                  "Make the headline bolder and add warm ceramic accents"
                </div>
              </div>
            </div>

            <div className={`transition-all duration-300 ${chatStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] text-white font-bold">V</div>
                <div className="rounded-2xl rounded-tl-sm border border-sky-200 bg-white px-4 py-2.5 text-[13px] text-slate-800 shadow-sm">
                  Done! Switched to Fraunces Serif and terracotta color palette.
                </div>
              </div>
            </div>

            <div className={`transition-all duration-300 ${chatStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-sky-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm">
                  "Now adapt this as an Instagram story card"
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Card 3: Designs that adapt to every format (Warm Sand Full Width Bento Card) */}
        <article className="group relative overflow-hidden rounded-[28px] border border-amber-200/70 bg-gradient-to-br from-[#FCF9F3] via-[#FAF6ED] to-[#F3ECE0] p-7 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100 md:col-span-2 sm:p-9">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-amber-200/70 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-900">
                Multi-Format Engine
              </span>
              <h3 className="font-lastik mt-3 text-[28px] leading-[1.15] text-[#2F2418] sm:text-[36px]">
                Designs that adapt to every format.
              </h3>
              <p className="mt-2 max-w-md text-[14px] text-amber-950/70">
                One prompt powers websites, mobile apps, social posts, posters, and pitch decks with coherent brand logic.
              </p>
            </div>

            {/* Interactive Format Pills */}
            <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
              {formats.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFormat(f.name)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                    activeFormat === f.name
                      ? "bg-amber-900 text-white shadow-sm"
                      : "bg-white/80 text-amber-900/80 ring-1 ring-amber-200 hover:bg-white"
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Central Node / Hub visualization */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-200/80 bg-white/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Canvas</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                  {activeFormat}
                </span>
              </div>
              <p className="font-lastik mt-2 text-xl font-medium text-slate-900">
                {activeFormat === "Website" && "Responsive Landing Hero"}
                {activeFormat === "Ads" && "High-Conversion Banner"}
                {activeFormat === "Post" && "Instagram Carousel 1:1"}
                {activeFormat === "Graphic" && "Swiss Modernist Poster"}
                {activeFormat === "Marketing" && "Investor Deck Slide"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formats.find((f) => f.name === activeFormat)?.desc}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-white/90 p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Adaptive Layout</div>
              <p className="font-lastik mt-2 text-xl font-medium text-slate-900">Smart Breakpoints</p>
              <p className="mt-1 text-xs text-slate-500">
                Reflows fluidly from 320px mobile viewports up to 4K ultra-wide monitors.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-white/90 p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Export & Share</div>
              <p className="font-lastik mt-2 text-xl font-medium text-slate-900">Instant Code & Asset</p>
              <p className="mt-1 text-xs text-slate-500">
                Export to clean Tailwind React components or download high-res PNG/SVG.
              </p>
            </div>
          </div>
        </article>

        {/* Card 4: Made to convert (Mint Green Card with Mascot & Conversion Chart) */}
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-emerald-200/70 bg-gradient-to-br from-[#F0FBF5] via-[#F4FCF8] to-[#E5F7EE] p-7 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100 sm:p-9">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-emerald-200/70 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                Conversion Focus
              </span>
              {/* Cute emerald blob mascot */}
              <div className="animate-mascot-bob" style={{ animationDelay: "1.4s" }}>
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="drop-shadow-md">
                  <path
                    d="M30,30 C15,45 15,65 30,80 C50,90 70,85 80,70 C90,50 85,30 65,20 C50,15 38,20 30,30 Z"
                    fill="#059669"
                  />
                  {/* Cheeks */}
                  <ellipse cx="38" cy="56" rx="4" ry="2.5" fill="#6EE7B7" opacity="0.6" />
                  <ellipse cx="68" cy="54" rx="4" ry="2.5" fill="#6EE7B7" opacity="0.6" />
                  {/* Eyes */}
                  <g className="animate-mascot-blink">
                    <circle cx="44" cy="46" r="4.5" fill="#FFFFFF" />
                    <circle cx="46" cy="45" r="2" fill="#064E3B" />
                    <circle cx="64" cy="44" r="4.5" fill="#FFFFFF" />
                    <circle cx="66" cy="43" r="2" fill="#064E3B" />
                  </g>
                  {/* Big smile */}
                  <path d="M48,58 Q56,66 64,57" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>

            <h3 className="font-lastik mt-3 text-[28px] leading-[1.15] text-[#0A3D2D] sm:text-[34px]">
              Made to convert,<br />not just look nice.
            </h3>
            <p className="mt-2.5 max-w-sm text-[14px] leading-relaxed text-emerald-950/70">
              Clear visual hierarchy, strategic CTAs, and scannable sections that guide users effortlessly to the next step.
            </p>
          </div>

          {/* Micro-UI: Interactive Conversion Graph & Stat Badge */}
          <div className="mt-8 rounded-2xl border border-emerald-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Visitor Engagement</span>
                <div className="mt-1 text-2xl font-bold text-slate-900">+34.8%</div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                ↗ Top 5%
              </span>
            </div>

            {/* Sparkline Bar Visualization */}
            <div className="mt-4 flex items-end gap-2 h-16 pt-2">
              {[35, 48, 42, 60, 55, 78, 92, 100].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar">
                  <div
                    className="w-full rounded-t-md bg-emerald-500/80 transition-all duration-300 group-hover/bar:bg-emerald-600"
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>Week 1</span>
              <span>After Velt Redesign</span>
            </div>
          </div>
        </article>

        {/* Card 5: Keep everything on-brand (Soft Violet Card with Brand Palette) */}
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-rose-200/70 bg-gradient-to-br from-[#FFF5F5] via-[#FFF9F9] to-[#FFEFEF] p-7 transition-all duration-300 hover:shadow-xl hover:shadow-rose-100 sm:p-9">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-rose-200/70 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                Design System
              </span>
              {/* Cute rose blob mascot */}
              <div className="animate-mascot-bob" style={{ animationDelay: "2s" }}>
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="drop-shadow-md">
                  <path
                    d="M25,50 C25,25 40,20 55,20 C70,20 85,30 80,60 C75,80 60,85 45,85 C30,85 25,75 25,50 Z"
                    fill="#E11D48"
                  />
                  {/* Cheeks */}
                  <ellipse cx="38" cy="55" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.7" />
                  <ellipse cx="68" cy="55" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.7" />
                  {/* Eyes with wink */}
                  <g className="animate-mascot-blink">
                    <circle cx="44" cy="46" r="4.5" fill="#FFFFFF" />
                    <circle cx="46" cy="45" r="2" fill="#4C0519" />
                    {/* Winking right eye */}
                    <path d="M62,47 Q67,42 72,47" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </g>
                  {/* Smile */}
                  <path d="M48,60 Q54,66 62,60" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>

            <h3 className="font-lastik mt-3 text-[28px] leading-[1.15] text-[#38111A] sm:text-[34px]">
              Keep everything<br />on-brand.
            </h3>
            <p className="mt-2.5 max-w-sm text-[14px] leading-relaxed text-rose-950/70">
              Lock in your exact typography, border radiuses, and hex codes. Every generated asset will feel inherently yours.
            </p>
          </div>

          {/* Micro-UI: Interactive Swatch & Tokens Stack */}
          <div className="mt-8 rounded-2xl border border-rose-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-900">
              <span>Primary Palette</span>
              <span className="text-[10px] text-slate-400">Tokens synced</span>
            </div>
            
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[
                { hex: "#171411", name: "Ink" },
                { hex: "#C24E1D", name: "Terracotta" },
                { hex: "#0284C7", name: "Sky" },
                { hex: "#059669", name: "Mint" },
                { hex: "#F3EEE4", name: "Linen" },
              ].map((swatch) => (
                <div key={swatch.hex} className="group/swatch text-center">
                  <div
                    className="h-10 w-full rounded-lg shadow-inner ring-1 ring-black/10 transition-transform group-hover/swatch:scale-105"
                    style={{ background: swatch.hex }}
                  />
                  <span className="mt-1 block text-[10px] font-mono text-slate-500">{swatch.name}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Crafted for speed & delight
        </p>
        <h3 className="font-lastik mt-2 text-[30px] text-[#202020] sm:text-[38px]">
          Fast enough to feel playful.
        </h3>
        <p className="mx-auto mt-2.5 max-w-md text-slate-600 text-[15px]">
          Generate, react, refine, and ship while your creative momentum is still high.
        </p>
      </div>
    </section>
  );
}

function Pricing() {
 const [yearly, setYearly] = useState(false);
 const plans = [
 {
 name: "Starter",
 monthly: 9,
 note: "Perfect for getting started.",
 items: ["75 images / month", "Website Design generations", "Graphic Design generations", "Marketing generations & more", "Chat-based refinements"],
 },
 {
 name: "Pro",
 monthly: 25,
 note: "For creators who want more.",
 items: ["200 images / month", "Everything in Starter", "Advanced Reasoning", "Priority rendering queue", "Early access features"],
 },
 {
 name: "Max",
 monthly: 50,
 note: "Built for power users.",
 items: ["400 images / month", "Everything in Pro", "Long-context memory", "Experimental features", "Priority support"],
 },
 ];
 return (
 <section className="mx-auto max-w-[980px] px-5 py-20 sm:px-10">
 <h2 className="font-lastik text-center text-[30px] text-[#2d2d2d] sm:text-[44px]">Plans and Pricing</h2>
 <p className="mx-auto mt-3 max-w-xl text-center text-slate-600 ">
 Flexible plans for generating polished UI, graphics, mockups, and design iterations with a clean workflow.
 </p>
 <div className="mt-6 flex justify-center">
 <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-[13px] font-medium">
 <button onClick={() => setYearly(false)} className={`rounded-full px-4 py-1.5 transition ${!yearly ? "bg-slate-900 text-white " : "text-slate-500 "}`}>
 Monthly
 </button>
 <button onClick={() => setYearly(true)} className={`rounded-full px-4 py-1.5 transition ${yearly ? "bg-slate-900 text-white " : "text-slate-500 "}`}>
 Annually · Save 30%
 </button>
 </div>
 </div>
 <div className="mt-10 grid gap-4 md:grid-cols-3">
 {plans.map((plan, i) => {
 const price = yearly ? Math.round(plan.monthly * 0.7) : plan.monthly;
 return (
 <div
 key={plan.name}
 className={`rounded-[22px] border p-7 transition ${
 i === 1
 ? "border-sky-500/50 bg-slate-900 text-white shadow-[0_10px_30px_rgba(0,140,255,0.15)]"
 : "border-slate-200 bg-white text-slate-900 "
 }`}
 >
 <div className="text-[13px] font-semibold">{plan.name}</div>
 <p className={`mt-1 text-[13px] ${i === 1 ? "text-white/60 " : "text-slate-500 "}`}>{plan.note}</p>
 <div className="mt-5 font-lastik text-[48px] leading-none">
 ${price}
 <span className="text-[16px] opacity-60">/ mo</span>
 </div>
 <Link
 href="/signup"
 className={`mt-6 block rounded-full py-2.5 text-center text-[13px] font-semibold transition ${
 i === 1 ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:opacity-90"
 }`}
 >
 Start Free Trial
 </Link>
 <p className={`mt-3 text-[12px] ${i === 1 ? "text-white/50 " : "text-slate-400 "}`}>
 3-day free trial. Cancel anytime.
 </p>
 <ul className="mt-6 space-y-2 text-[13px]">
 {plan.items.map((item) => (
 <li key={item} className="flex items-start gap-2">
 <Check size={14} className="mt-0.5 shrink-0 text-sky-500" /> {item}
 </li>
 ))}
 </ul>
 </div>
 );
 })}
 </div>
 </section>
 );
}

const FAQS = [
 { q: "What can I make with Velt?", a: "Landing pages, marketing graphics, product visuals, social content, and UI concepts, all from a single prompt." },
 { q: "How do credits work?", a: "Each design generation costs 2 credits. Most other tools and edits cost 1 credit per use." },
 { q: "Can I edit a design after it renders?", a: "Yes — change layouts, colors, copy, style, or format with simple follow-up prompts." },
 { q: "Do I need design experience?", a: "Just describe what you want and Velt handles the design work." },
 { q: "Does it replace a designer?", a: "It helps you explore ideas, create directions, and move faster from concept to execution." },
 { q: "Can I use the designs commercially?", a: "Yes. Everything you create can be used for client work, products, marketing, and commercial projects." },
];

function FAQ() {
 const [open, setOpen] = useState<number | null>(0);
 return (
 <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-10">
 <h2 className="font-lastik text-center text-[30px] text-[#2d2d2d] sm:text-[40px]">Frequently Asked</h2>
 <p className="mt-3 text-center text-slate-500 ">
 A quick look at how Velt works before you start, with answers to the most common things people ask.
 </p>
 <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200 ">
 {FAQS.map((item, i) => (
 <button key={item.q} onClick={() => setOpen(open === i ? null : i)} className="block w-full py-5 text-left">
 <div className="flex items-center justify-between gap-6 text-[16px] font-medium text-slate-900 ">
 {item.q}
 <span className="text-slate-400 ">{open === i ? "–" : "+"}</span>
 </div>
 {open === i ? <p className="mt-3 max-w-xl text-[14px] text-slate-600 ">{item.a}</p> : null}
 </button>
 ))}
 </div>
 <p className="mt-8 text-center text-slate-500 ">
 still curious?{" "}
 <a href="mailto:hello@velt.app" className="text-sky-500 hover:text-sky-400 underline">
 say hello
 </a>
 </p>
 </section>
 );
}

function Closing() {
 return (
 <section className="relative overflow-hidden px-5 pb-20 pt-6">
 <h2 className="cta-heading font-lastik text-center text-[34px] sm:text-[52px]">Make anything you imagine</h2>
 <p className="mt-2 text-center text-slate-500 ">Web Design</p>
 <h3 className="font-lastik mt-10 text-center text-[28px] text-[#2d2d2d] sm:text-[40px]">Make beautiful designs</h3>
 <p className="mx-auto mt-2 max-w-lg text-center text-[14px] text-slate-500 ">
 each design was made from the line beneath it with velt, generated on the first try in seconds.
 </p>
 <div className="marquee-mask mt-8 overflow-hidden">
 <MarqueeRow items={SHOWCASES.slice(0, 4)} />
 <div className="mt-4">
 <LiveMarquee />
 </div>
 </div>
 </section>
 );
}
