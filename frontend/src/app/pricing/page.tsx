"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const PLANS = [
  { name: "Starter", monthly: 6, note: "Perfect for getting started.", items: ["75 images / month", "Website Design generations", "Graphic Design generations", "Chat-based refinements"] },
  { name: "Pro", monthly: 14, note: "For creators who want more.", items: ["200 images / month", "Everything in Starter", "Advanced Reasoning", "Priority rendering queue"] },
  { name: "Max", monthly: 49, note: "Built for power users.", items: ["400 images / month", "Everything in Pro", "Long-context memory", "Priority support"] },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[980px] px-6 pb-20 pt-32">
        <h1 className="font-lastik text-5xl text-slate-900 md:text-6xl">Plans and Pricing</h1>
        <p className="mt-4 max-w-xl text-slate-500">
          Flexible plans for generating polished UI, graphics, mockups, and design iterations with a clean workflow.
        </p>
        <div className="mt-8 inline-flex rounded-full border border-slate-200 p-1 text-sm font-medium">
          <button onClick={() => setYearly(false)} className={`rounded-full px-4 py-1.5 ${!yearly ? "bg-slate-900 text-white" : "text-slate-500"}`}>
            Monthly
          </button>
          <button onClick={() => setYearly(true)} className={`rounded-full px-4 py-1.5 ${yearly ? "bg-slate-900 text-white" : "text-slate-500"}`}>
            Annually · Save 30%
          </button>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const price = yearly ? Math.round(plan.monthly * 0.7) : plan.monthly;
            return (
              <div key={plan.name} className={`rounded-[22px] border p-7 ${i === 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}>
                <div className="text-[13px] font-semibold">{plan.name}</div>
                <div className="font-lastik mt-4 text-5xl">
                  ${price}
                  <span className="text-lg opacity-60">/ mo</span>
                </div>
                <p className={`mt-3 text-sm ${i === 1 ? "text-white/70" : "text-slate-500"}`}>{plan.note}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={14} /> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 block rounded-full px-4 py-2.5 text-center text-sm font-semibold ${
                    i === 1 ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
