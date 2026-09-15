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
 <header className="fixed left-0 right-0 top-0 z-50 flex flex-col items-center px-4 pt-4 sm:px-8 sm:pt-6">
 <nav
 className={`flex w-full max-w-[890px] items-center justify-between gap-3 rounded-full border px-5 py-2.5 shadow-[0_12px_40px_rgba(0,80,160,0.16)] backdrop-blur-xl transition-[background-color,border-color,color] duration-500 sm:px-7 sm:py-3.5 ${
 onSky
 ? "border-white/30 bg-white/20 text-white shadow-[0_10px_35px_rgba(0,60,130,0.18)]"
 : theme === "dark"
 ? "border-white/10 bg-[#141a2c]/85 text-white"
 : "border-black/10 bg-white/90 text-slate-900"
 }`}
 >
 <Link href="/" className={`font-lastik text-[21px] tracking-[-0.02em] transition-opacity hover:opacity-90 sm:text-[23px] ${inverse ? "text-white" : "text-slate-900"}`}>
 velt
 </Link>
 <div className={`hidden items-center justify-center gap-6 text-[14px] font-medium sm:flex lg:gap-8 lg:text-[15px] ${inverse ? "text-white/90" : "text-slate-700"}`}>
 <Link href="/#how" className="transition-opacity hover:opacity-100 hover:text-white">
 How it works
 </Link>
 <Link href="/showcase" className="transition-opacity hover:opacity-100 hover:text-white">
 Showcases
 </Link>
 <Link href="/pricing" className="transition-opacity hover:opacity-100 hover:text-white">
 Pricing
 </Link>
 <Link href={signedIn ? "/studio" : "/login"} className="transition-opacity hover:opacity-100 hover:text-white">
 {signedIn ? "Studio" : "Login"}
 </Link>
 </div>
 <div className="flex items-center gap-3">
 <Link
 href={signedIn ? "/studio" : "/signup"}
 className="rounded-full bg-white px-5 py-2 text-[13.5px] font-semibold tracking-tight text-[#008be3] shadow-sm transition-all hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] sm:px-6 sm:py-2.5 sm:text-[14.5px]"
 >
 Get started
 </Link>
 </div>
 </nav>
 </header>
 );
}
