import React from "react";
import {
  Code2,
  Download,
  MessageSquare,
  Monitor,
  Smartphone,
  Sparkles,
  Tablet,
} from "lucide-react";

/*
  These chrome pieces reproduce Velt's real studio shell (Sidebar + StudioHome
  header + Editor header) using the same class names and tokens defined in
  frontend/src/app/globals.css. They are not approximations of the brand — they
  are the brand's own utility classes rendered at video scale.
*/

export function VeltWordmark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <VeltGlyph />
      <span
        className="font-display text-[22px] leading-none tracking-tight"
        style={{ color: light ? "#ffffff" : "var(--color-ink)" }}
      >
        Velt
      </span>
      <span className="rounded-full border border-line px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
        Studio
      </span>
    </div>
  );
}

export function VeltGlyph({ size = 26 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[8px]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #00a5ef 0%, #0084cc 100%)",
        boxShadow: "0 6px 16px -6px rgba(0,139,227,0.7)",
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4.5 L12 20 L20 4.5"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const SIDEBAR_ITEMS = [
  { label: "Studio", icon: Sparkles, active: true },
  { label: "Drafts", icon: MessageSquare, active: false },
  { label: "Export", icon: Code2, active: false },
];

export function StudioSidebar() {
  return (
    <aside className="hidden w-[64px] shrink-0 flex-col items-center gap-1 border-r border-line bg-paper-2 py-4 lg:flex">
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex w-[48px] flex-col items-center gap-1 rounded-xl py-2"
            style={
              item.active
                ? { background: "var(--color-ink)", color: "var(--color-paper)" }
                : { color: "var(--color-muted)" }
            }
          >
            <Icon size={17} strokeWidth={1.9} />
            <span className="text-[8px] font-medium uppercase tracking-[0.08em]">
              {item.label}
            </span>
          </div>
        );
      })}
    </aside>
  );
}

export function CreditBadge({ credits = 40 }: { credits?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full border border-line bg-paper-2 px-3 py-1.5 text-[12px] text-muted">
        {credits} credits
      </span>
      <span
        className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium"
        style={{ color: "var(--color-paper)" }}
      >
        <Sparkles size={12} />
        Pro Studio
      </span>
    </div>
  );
}

export function DeviceSwitcher({
  device = "desktop",
}: {
  device?: "desktop" | "tablet" | "mobile";
}) {
  const items = [
    ["desktop", Monitor],
    ["tablet", Tablet],
    ["mobile", Smartphone],
  ] as const;
  return (
    <div className="flex rounded-full border border-line p-1">
      {items.map(([key, Icon]) => (
        <div
          key={key}
          className="rounded-full p-1.5"
          style={
            device === key
              ? { background: "var(--color-ink)", color: "var(--color-paper)" }
              : { color: "var(--color-muted)" }
          }
        >
          <Icon size={14} />
        </div>
      ))}
    </div>
  );
}

export function ExportCodeButton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium"
      style={{ color: "var(--color-paper)" }}
    >
      <Code2 size={13} />
      <span>{compact ? "Code" : "Export Code"}</span>
    </div>
  );
}

export function ExportJsonButton() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted">
      <Download size={13} />
      <span>JSON</span>
    </div>
  );
}

/*
  The real editor canvas wrapper. Mirrors the .frame-shadow + rounded-[24px]
  frame and the dotted grid backdrop used in Editor.tsx.
*/
export function EditorCanvasBackdrop({
  children,
  scale,
  width = 1280,
  height,
}: {
  children: React.ReactNode;
  scale: number;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className="flex flex-1 items-start justify-center bg-[linear-gradient(#d8d0c4_1px,transparent_1px),linear-gradient(90deg,#d8d0c4_1px,transparent_1px)] bg-[size:28px_28px] p-8"
      style={{ width: "100%", height: "100%" }}
    >
      <div
        className="frame-shadow overflow-hidden rounded-[24px] border border-line bg-paper"
        style={{ width: width * scale, height, flexShrink: 0 }}
      >
        <div
          className="origin-top-left"
          style={{ width, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
