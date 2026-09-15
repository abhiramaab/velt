"use client";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import Link from "next/link";

const CARDS = [
  { src: "/showcases/s1.jpg", name: "Lumen Fashion", prompt: "a quiet luxury fashion house, cream and silk" },
  { src: "/showcases/s2.jpg", name: "Studio Culture", prompt: "dark creative studio site for an art direction team" },
  { src: "/showcases/s3.jpg", name: "Atelier Bühler", prompt: "swiss architecture landing page, one red accent" },
  { src: "/showcases/s4.jpg", name: "Coast Stay", prompt: "coastal hotel with long lunches and tiled floors" },
  { src: "/showcases/s5.jpg", name: "Halo Skin", prompt: "soft skincare brand, blush and cream" },
  { src: "/showcases/s6.jpg", name: "Field Portfolio", prompt: "editorial portfolio for a fashion photographer" },
  { src: "/showcases/s7.jpg", name: "Agency Posters", prompt: "agency poster series, bold type and color blocks" },
  { src: "/showcases/s8.jpg", name: "Quill", prompt: "writing app landing page, literary not neon" },
];

export default function ShowcasePage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1080px] px-6 pb-20 pt-32">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-sky-600">Showcases</p>
        <h1 className="font-lastik mt-3 max-w-3xl text-5xl leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
          Each design was made from the line beneath it.
        </h1>
        <p className="mt-5 max-w-xl text-slate-500">
          Generated on the first try in seconds. Hover, steal the feeling, then write your own sentence.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CARDS.map((card) => (
            <Link key={card.src} href="/signup" className="group block">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img src={card.src} alt={card.name} className="block w-full transition duration-500 group-hover:scale-[1.02]" />
              </div>
              <h2 className="font-lastik mt-4 text-2xl text-slate-900">{card.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{card.prompt}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
