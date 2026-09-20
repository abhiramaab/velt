"use client";

import { useState } from "react";
import { ArrowUpRight, Terminal, Sparkles, Layers, ShieldCheck, Cpu, Zap, Activity, Globe } from "lucide-react";

export interface ShowcaseItem {
  id: string;
  name: string;
  category: "Tech & SaaS" | "Mobile Apps" | "AI & Cloud" | "Commerce & Studio";
  prompt: string;
  tagline: string;
  theme: {
    bg: string;
    accent: string;
    badge: string;
  };
  deviceType: "desktop" | "mobile";
  stats: { label: string; value: string }[];
  previewKind: "cloud_mesh" | "mobile_fintech" | "agent_platform" | "cyber_defense" | "mobile_wellness" | "architecture_glass";
}

export const SHOWCASE_DATA: ShowcaseItem[] = [
  {
    id: "sentinel-cloud",
    name: "Sentinel Mesh",
    category: "AI & Cloud",
    prompt: "Zero-trust autonomous cloud security mesh with real-time attack graph and edge isolation",
    tagline: "Security that never sleeps across 42 global regions.",
    theme: {
      bg: "#F8FAFC",
      accent: "#0284C7",
      badge: "Edge Security · 99.999%",
    },
    deviceType: "desktop",
    stats: [
      { label: "P99 LATENCY", value: "1.4ms" },
      { label: "ACTIVE REGIONS", value: "42" },
      { label: "THREATS MITIGATED", value: "1.2B/day" },
    ],
    previewKind: "cyber_defense",
  },
  {
    id: "aurai-mobile",
    name: "Aurai Wellness",
    category: "Mobile Apps",
    prompt: "Mindful bio-feedback companion app with calm biometric tracking and circadian pacing",
    tagline: "Your calm is always within. Tuned to your body in real time.",
    theme: {
      bg: "#FAF9F5",
      accent: "#E06D53",
      badge: "Biometric 3.0",
    },
    deviceType: "mobile",
    stats: [
      { label: "DAILY STREAK", value: "24 days" },
      { label: "RESTING HR", value: "62 bpm" },
      { label: "BIO-RECOVERY", value: "94%" },
    ],
    previewKind: "mobile_wellness",
  },
  {
    id: "neon-logic",
    name: "NeonLogic Engine",
    category: "Tech & SaaS",
    prompt: "Agentic model compiler for multi-step reasoning workflows with instant WASM streaming",
    tagline: "Generate anything. Instantly. Code at the speed of thought.",
    theme: {
      bg: "#F8F9FA",
      accent: "#10B981",
      badge: "WASM Runtime · v3.2",
    },
    deviceType: "desktop",
    stats: [
      { label: "THROUGHPUT", value: "85k tok/s" },
      { label: "COMPILER EFFICIENCY", value: "98.4%" },
      { label: "GLOBAL POPS", value: "118" },
    ],
    previewKind: "agent_platform",
  },
  {
    id: "aurelia-estates",
    name: "Aurelia Monograph",
    category: "Commerce & Studio",
    prompt: "High-end monolithic architecture studio with alpine glass pavilions and cantilevered stone",
    tagline: "The Glass House. Spatial restorations designed in dialogue with light.",
    theme: {
      bg: "#F7F5F0",
      accent: "#B45309",
      badge: "Alpine Monograph // 2026",
    },
    deviceType: "desktop",
    stats: [
      { label: "BUILT MONOGRAPHS", value: "34" },
      { label: "CANTONS", value: "04" },
      { label: "DESIGN AWARDS", value: "16" },
    ],
    previewKind: "architecture_glass",
  },
  {
    id: "pulse-finance",
    name: "Pulse Mobile Bank",
    category: "Mobile Apps",
    prompt: "High-yield liquid treasury card app with instant settlement and multi-currency vault",
    tagline: "Liquid capital at 5.2% APY. Zero FX fees anywhere on earth.",
    theme: {
      bg: "#F4F7FB",
      accent: "#2563EB",
      badge: "Direct Yield Card",
    },
    deviceType: "mobile",
    stats: [
      { label: "PORTFOLIO YIELD", value: "5.24%" },
      { label: "INSTANT SETTLE", value: "< 200ms" },
      { label: "INSURED UP TO", value: "$2.5M" },
    ],
    previewKind: "mobile_fintech",
  },
  {
    id: "strata-cloud",
    name: "Strata Intelligence",
    category: "AI & Cloud",
    prompt: "Autonomous enterprise search & synthesis engine over enterprise vector repositories",
    tagline: "Layers hold deep time. Query 50M enterprise docs with sub-second accuracy.",
    theme: {
      bg: "#FBFBFC",
      accent: "#6366F1",
      badge: "Vector Mesh v4",
    },
    deviceType: "desktop",
    stats: [
      { label: "INGESTION VELOCITY", value: "140k docs/s" },
      { label: "P95 RECALL", value: "99.8%" },
      { label: "INDEX LATENCY", value: "12ms" },
    ],
    previewKind: "cloud_mesh",
  },
];

export function AnimatedMockupCard({ item }: { item: ShowcaseItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      {/* Visual Canvas Area */}
      <div 
        className="relative flex h-[340px] sm:h-[380px] w-full items-center justify-center overflow-hidden rounded-[22px] border border-slate-100 p-4 transition-colors duration-500"
        style={{ backgroundColor: item.theme.bg }}
      >
        {/* Ambient Subtle Grid & Radial Glow */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Ambient Accent Light */}
        <div 
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ backgroundColor: item.theme.accent }}
        />

        {/* Render Device Shell */}
        {item.deviceType === "mobile" ? (
          /* Mobile iPhone Frame */
          <div className="relative z-10 w-[240px] shrink-0 rounded-[40px] border-[6px] border-slate-900 bg-white p-2.5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]">
            {/* Dynamic Island */}
            <div className="mx-auto mb-3 h-4 w-20 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-slate-700 mr-2" />
              <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Mobile Screen Content */}
            <div className="rounded-[28px] bg-slate-50 p-3.5 text-slate-900">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span>9:41</span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-1.5 rounded-full bg-emerald-500" /> 5G
                </span>
              </div>

              {item.previewKind === "mobile_wellness" ? (
                <div className="mt-4 space-y-3">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-800">
                    Circadian Flow
                  </span>
                  <div className="font-lastik text-lg leading-tight text-slate-900">
                    Your calm is always within.
                  </div>
                  <div className="relative flex items-center justify-center py-4">
                    <div className="relative flex size-24 items-center justify-center rounded-full border-4 border-amber-300/40 bg-white shadow-inner">
                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-800">62</div>
                        <div className="text-[9px] text-slate-400">RESTING HR</div>
                      </div>
                      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-amber-500" style={{ animationDuration: "4s" }} />
                    </div>
                  </div>
                  <div className="flex justify-between rounded-xl bg-white p-2 text-[10px] font-medium border border-slate-100 shadow-xs">
                    <span className="text-slate-500">Recovery</span>
                    <span className="text-emerald-600 font-bold">94% Optimal</span>
                  </div>
                </div>
              ) : (
                /* Mobile Fintech */
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-semibold text-blue-800">
                      Treasury Card
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">+5.2% APY</span>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-3 text-white shadow-md">
                    <div className="text-[9px] text-slate-400">Total Liquid Capital</div>
                    <div className="mt-1 font-mono text-base font-bold tracking-tight">$84,290.45</div>
                    <div className="mt-2 flex justify-between text-[8px] text-slate-400">
                      <span>•••• 8821</span>
                      <span className="text-emerald-400">Active</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>Recent Yield</span>
                      <span className="font-semibold text-slate-900">+$12.40 today</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-4/5 rounded-full bg-blue-600 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Desktop Browser Window Mockup */
          <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
            {/* Window Titlebar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 bg-slate-50/80">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-red-400" />
                <div className="size-2 rounded-full bg-amber-400" />
                <div className="size-2 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                <span className="size-1 rounded-full bg-emerald-500" />
                {item.id}.velt.cloud
              </div>
              <div className="w-6" />
            </div>

            {/* Desktop Screen Content */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  {item.theme.badge}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
                </span>
              </div>

              <h4 className="font-lastik mt-3 text-lg leading-snug text-slate-900">
                {item.tagline}
              </h4>

              {/* Dynamic Interactive Element in card */}
              {item.previewKind === "cyber_defense" || item.previewKind === "agent_platform" ? (
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px] text-slate-300 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 text-[9px] text-slate-500">
                    <Terminal size={11} className="text-emerald-400" />
                    <span>velt-runtime --live-stream</span>
                  </div>
                  <div className="mt-1.5 space-y-1 text-[10px]">
                    <div className="text-emerald-400 flex items-center gap-1.5">
                      <span>✓</span> Edge worker provisioned in 4ms
                    </div>
                    <div className="text-sky-300 flex items-center gap-1.5">
                      <span>⚡</span> Global mesh sync active (42 POPs)
                    </div>
                  </div>
                </div>
              ) : (
                /* Glass Monograph Bento */
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <div className="text-[10px] font-semibold text-slate-500">Natural Mass</div>
                    <div className="mt-1 font-serif text-sm font-bold text-slate-900">Cantilever IV</div>
                    <div className="text-[9px] text-slate-400">Küssnacht · 2026</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <div className="text-[10px] font-semibold text-slate-500">Light Rhythm</div>
                    <div className="mt-1 font-serif text-sm font-bold text-slate-900">Alpine Pavilion</div>
                    <div className="text-[9px] text-slate-400">Engadin Valley</div>
                  </div>
                </div>
              )}

              {/* Micro stats strip */}
              <div className="mt-3 grid grid-cols-3 border-t border-slate-100 pt-2 text-center">
                {item.stats.map((st, i) => (
                  <div key={i}>
                    <div className="text-[9px] text-slate-400 font-medium">{st.label}</div>
                    <div className="text-[11px] font-bold text-slate-800">{st.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {item.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-slate-900 transition-colors">
            Generate Similar <ArrowUpRight size={14} />
          </span>
        </div>
        <h3 className="font-lastik mt-1 text-xl text-slate-900">
          {item.name}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
          "{item.prompt}"
        </p>
      </div>
    </div>
  );
}
