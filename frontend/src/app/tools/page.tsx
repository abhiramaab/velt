import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FORMATS } from "@/lib/design";

export const metadata = {
  title: "Tools — Velt",
  description: "Purpose-built generators for websites, apps, posters, and brand.",
};

export default function ToolsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[980px] px-6 pb-20 pt-32">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-sky-600">Tools</p>
        <h1 className="font-lastik mt-3 max-w-3xl text-5xl leading-[1.08] text-slate-900 md:text-6xl">
          AI design tools for every format
        </h1>
        <p className="mt-5 max-w-xl text-slate-500">
          Purpose-built generators for websites, landing pages, app UI, posters, and more — each one turning a single
          prompt into a finished design.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FORMATS.map((f) => (
            <Link
              key={f.id}
              href={`/signup?format=${f.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm"
            >
              <h2 className="font-lastik text-2xl text-slate-900">{f.label}</h2>
              <p className="mt-2 text-sm text-slate-500">{f.blurb}</p>
              <span className="mt-5 inline-block text-sm font-medium text-sky-600">Read more →</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
