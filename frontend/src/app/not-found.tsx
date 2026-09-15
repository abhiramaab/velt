import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo className="text-[22px]" />
      <h1 className="font-lastik mt-8 text-5xl text-slate-900">This page was never composed.</h1>
      <p className="mt-3 text-slate-500">The route doesn’t exist. The studio does.</p>
      <Link href="/" className="mt-8 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white">
        Back to Velt
      </Link>
    </main>
  );
}
