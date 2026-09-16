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
import { getToken } from "@/lib/api";
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

 function go() {
 const text = prompt.trim() || "A quiet ceramic studio in Kyoto, wabi-sabi, paper and warm clay";
 const q = `?prompt=${encodeURIComponent(text)}&format=${format.id}`;
 window.location.href = getToken() ? `/studio${q}` : `/signup${q}`;
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
 const [tab, setTab] = useState(0);
 const [chat, setChat] = useState(0);
 const tabs = ["Website", "Ads", "Post", "Graphic", "Marketing"];
 const tabImgs = ["/showcases/s1.jpg", "/showcases/s7.jpg", "/showcases/s6.jpg", "/showcases/s3.jpg", "/showcases/s8.jpg"];

 useEffect(() => {
 const t = setInterval(() => setChat((c) => (c + 1) % 3), 2800);
 return () => clearInterval(t);
 }, []);

 return (
 <section id="how" className="mx-auto max-w-[980px] px-5 py-8 sm:px-10">
 <h2 className="font-lastik text-center text-[30px] leading-[1.15] text-[#2d2d2d] sm:text-[44px]">
 Modern designs by default.
 </h2>
 <p className="mx-auto mt-4 max-w-[560px] text-center text-[16px] text-slate-600 sm:text-[19px]">
 Make modern, conversion-ready visuals instantly, then refine every color, layout, and message through chat.
 </p>

 <div className="mt-14 grid gap-5 md:grid-cols-2">
 <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-[#F7F8FA] p-6 sm:p-8">
 <h3 className="font-lastik text-[28px] leading-tight text-[#1a1a1a] sm:text-[34px]">
 From prompt
 <br />
 to polished design
 </h3>
 <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-slate-600 ">
 Describe what you need in your own words and watch your idea come to life instantly with the right audience,
 offer, and mood.
 </p>
 <img src="/showcases/s1.jpg" alt="" className="mt-6 rounded-xl border border-slate-200 " />
 </article>

 <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-[#F7F8FA] p-6 sm:p-8">
 <h3 className="font-lastik text-[28px] leading-tight text-[#1a1a1a] sm:text-[34px]">
 Edit your design
 <br />
 through chat.
 </h3>
 <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-slate-600 ">
 Ask to write a headline, change a layout, update a button, or turn the same idea into marketing assets.
 </p>
 <div className="mt-6 space-y-3">
 {chat >= 0 ? (
 <div className="flex justify-end">
 <div className="max-w-[85%] rounded-2xl bg-slate-900 px-4 py-3 text-[13px] text-white ">
 Add some trust badges under the headline
 </div>
 </div>
 ) : null}
 {chat >= 1 ? (
 <div className="flex justify-start">
 <div className="max-w-[85%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-700 ">
 Done! Added trust badges to build more credibility.
 </div>
 </div>
 ) : null}
 {chat >= 2 ? (
 <div className="flex justify-end">
 <div className="max-w-[85%] rounded-2xl bg-slate-900 px-4 py-3 text-[13px] text-white ">
 Make the hero a little warmer.
 </div>
 </div>
 ) : null}
 </div>
 </article>

 <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-[#F7F8FA] p-6 sm:p-8 md:col-span-2">
 <h3 className="font-lastik text-[28px] leading-tight text-[#1a1a1a] sm:text-[34px]">
 Designs that adapt
 <br />
 to every format.
 </h3>
 <p className="mt-3 max-w-md text-[14px] text-slate-600 ">
 Go from a simple prompt to ready-to-share assets built for web, mobile, and more.
 </p>
 <div className="mt-5 flex flex-wrap gap-2">
 {tabs.map((t, i) => (
 <button
 key={t}
 onClick={() => setTab(i)}
 className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
 tab === i
 ? "bg-slate-900 text-white "
 : "bg-white text-slate-600 ring-1 ring-slate-200 hover:"
 }`}
 >
 {t}
 </button>
 ))}
 </div>
 <img src={tabImgs[tab]} alt="" className="mt-5 max-h-[420px] w-full rounded-xl border border-slate-200 object-cover object-top" />
 </article>

 <article className="overflow-hidden rounded-[22px] bg-[#111] p-6 text-white sm:p-8">
 <h3 className="font-lastik text-[28px] leading-tight sm:text-[34px]">
 Made to convert,
 <br />
 not just look nice.
 </h3>
 <p className="mt-3 max-w-sm text-[14px] text-white/70 ">
 Smart visual hierarchy, sharper messaging, and layouts that guide people to the next click.
 </p>
 <img src="/showcases/s8.jpg" alt="" className="mt-6 rounded-xl opacity-95" />
 </article>

 <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-[#F7F8FA] p-6 sm:p-8">
 <h3 className="font-lastik text-[28px] leading-tight text-[#1a1a1a] sm:text-[34px]">
 Keep everything
 <br />
 on-brand.
 </h3>
 <p className="mt-3 max-w-sm text-[14px] text-slate-600 ">
 Bring in your colors and assets so every generated design feels like it belongs to you.
 </p>
 <div className="mt-8 flex h-24 overflow-hidden rounded-2xl">
 {["#F3EEE4", "#171411", "#00A5EF", "#2F5D4A", "#C4A574"].map((c) => (
 <div key={c} className="flex-1" style={{ background: c }} />
 ))}
 </div>
 </article>
 </div>

 <p className="mt-10 text-center text-[13px] font-medium uppercase tracking-[0.18em] text-slate-400 ">
 buttery workflow
 </p>
 <h3 className="font-lastik mt-2 text-center text-[28px] text-[#2d2d2d] sm:text-[36px]">
 Fast enough to feel playful.
 </h3>
 <p className="mx-auto mt-3 max-w-md text-center text-slate-600 ">
 Generate, react, refine, and ship while your idea still feels exciting.
 </p>
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
