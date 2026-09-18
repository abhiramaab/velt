import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
 return (
 <footer className="border-t border-slate-200 bg-white ">
 <div className="mx-auto flex max-w-[980px] flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
 <div>
 <Logo className="text-[22px] text-slate-900 " />
 <p className="mt-3 max-w-xs text-sm text-slate-500 ">
 Describe what you want, and we handle the rest.
 </p>
 </div>
 <div className="flex gap-10 text-sm font-medium text-slate-600 ">
 <div className="flex flex-col gap-2">
 <Link href="/#how" className="transition hover:text-slate-900 :text-white">How it works</Link>
 <Link href="/#features" className="transition hover:text-slate-900 :text-white">Features</Link>
 <Link href="/tools" className="transition hover:text-slate-900 :text-white">Tools</Link>
 <Link href="/showcase" className="transition hover:text-slate-900 :text-white">Showcases</Link>
 <Link href="/pricing" className="transition hover:text-slate-900 :text-white">Pricing</Link>
 </div>
 <div className="flex flex-col gap-2">
 <Link href="/login" className="transition hover:text-slate-900 :text-white">Login</Link>
 <Link href="/signup" className="transition hover:text-slate-900 :text-white">Get started</Link>
 <Link href="/studio" className="transition hover:text-slate-900 :text-white">Studio</Link>
 </div>
 </div>
 </div>
 <div className="mx-auto flex max-w-[980px] items-center justify-between px-6 pb-8 text-xs text-slate-400">
 <span>© {new Date().getFullYear()} Velt</span>
 <span>Make beautiful designs.</span>
 </div>
 </footer>
 );
}
