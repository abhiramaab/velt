"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Logo } from "./Logo";
import { getToken } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export function Nav({ overHero = false }: { overHero?: boolean }) {
 const { theme, toggle } = useTheme();
 const [signedIn, setSignedIn] = useState(false);
 const [scrolled, setScrolled] = useState(false);

 useEffect(() => {
 setSignedIn(Boolean(getToken()));
 if (!overHero) return;
 const onScroll = () => setScrolled(window.scrollY > 40);
 onScroll();
 window.addEventListener("scroll", onScroll, { passive: true });
 return () => window.removeEventListener("scroll", onScroll);
 }, [overHero]);

 const onSky = overHero && !scrolled;
 const inverse = onSky || theme === "dark";

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${
      onSky
        ? "border-b border-transparent bg-transparent backdrop-blur-none"
        : "border-b border-white/10 bg-[#0a0c10]/95 backdrop-blur-md"
    }`}>
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo + Primary Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/20">
              <span className="font-lastik text-lg font-bold text-slate-950">V</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-[13px] font-medium text-slate-300 md:flex lg:gap-6">
            <Link
              href="/studio"
              className="flex items-center gap-1.5 font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              <span>Build</span>
            </Link>

            <Link
              href="/studio?format=website"
              className="transition hover:text-white"
            >
              Website
            </Link>

            <Link
              href="/studio?format=app"
              className="transition hover:text-white"
            >
              Mobile App
            </Link>

            <Link
              href="/studio?format=ecommerce"
              className="transition hover:text-white"
            >
              E-Commerce Store
            </Link>

            <Link
              href="/showcase"
              className="flex items-center gap-1.5 transition hover:text-white"
            >
              <span>Showcases</span>
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                NEW
              </span>
            </Link>

            <Link
              href="/pricing"
              className="transition hover:text-white"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right Controls: Trial Badge, Login, and CTA */}
        <div className="flex items-center gap-3">
          {/* Trial / Credits Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>2-Day Free Trial</span>
          </div>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          {/* Login / Studio link */}
          <Link
            href={signedIn ? "/studio" : "/login"}
            className="text-xs sm:text-[13px] font-medium text-slate-200 transition hover:text-white px-3 py-1.5"
          >
            {signedIn ? "Studio" : "Login"}
          </Link>

          {/* Get Started Button */}
          <Link
            href={signedIn ? "/studio" : "/signup"}
            className="flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-xs sm:text-[13px] font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
