"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
import type { DesignDoc } from "@/lib/design";

export type DeviceKind = "desktop" | "tablet" | "mobile" | "poster" | "square";

const NATURAL_WIDTH: Record<DeviceKind, number> = {
  desktop: 1440,
  tablet: 900,
  mobile: 402,
  poster: 720,
  square: 720,
};

export function deviceFor(doc: DesignDoc): DeviceKind {
  switch (doc.format) {
    case "app":
    case "story":
      return "mobile";
    case "poster":
    case "brand":
    case "social":
    case "instagram":
      return "square";
    case "dashboard":
      return "desktop";
    default:
      return "desktop";
  }
}

/**
 * Scales a fixed-width PrototypeRenderer so it always fits exactly inside its
 * own box. The outer box is `overflow-hidden` + `isolate` (its own stacking
 * context) so a mockup can never bleed over sibling content. Scaling is driven
 * by a ResizeObserver on the box, never by hardcoded magic scale numbers.
 */
export function ScaledMockup({
  doc,
  device,
  className = "",
  chrome = false,
  maxScale = 1,
  fit = "height",
}: {
  doc: DesignDoc;
  device?: DeviceKind;
  className?: string;
  chrome?: boolean;
  maxScale?: number;
  /**
   * "height" (default): the box grows to the full scaled height of the design.
   * "width": the box scales to its width only and lets its parent clip the
   * overflow — used for fixed-height preview cards.
   */
  fit?: "height" | "width";
}) {
  const resolved = device ?? deviceFor(doc);
  const natural = NATURAL_WIDTH[resolved];
  const boxRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const available = box.clientWidth;
      if (available <= 0) return;
      const docEl = docRef.current;
      const naturalHeight = docEl ? docEl.scrollHeight : 0;
      const nextScale = Math.min(maxScale, available / natural);
      setScale(nextScale);
      if (fit === "height") {
        setHeight(naturalHeight ? naturalHeight * nextScale : 0);
      } else {
        setHeight(0);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    if (docRef.current) ro.observe(docRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [doc, natural, maxScale, fit]);

  const isPhone = resolved === "mobile";

  return (
    <div
      ref={boxRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={
        fit === "height"
          ? { height: height ? `${height}px` : undefined, aspectRatio: height ? undefined : isPhone ? "402 / 860" : undefined }
          : undefined
      }
    >
      <div
        ref={docRef}
        className="origin-top-left will-change-transform"
        style={{
          width: natural,
          transform: `scale(${scale || 0})`,
          opacity: scale ? 1 : 0,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        {chrome && isPhone ? (
          <div className="relative bg-[#0b0b0c] p-2" style={{ width: natural }}>
            <div className="absolute left-1/2 top-3 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/40" />
            <div className="overflow-hidden rounded-[28px] bg-white">
              <PrototypeRenderer doc={doc} device="mobile" />
            </div>
          </div>
        ) : (
          <PrototypeRenderer doc={doc} device={isPhone ? "mobile" : "desktop"} />
        )}
      </div>
    </div>
  );
}

export function MockupChrome({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper-2 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        {label ? (
          <span className="ml-2 truncate rounded bg-paper px-2 py-0.5 text-[10px] text-muted">
            {label}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
