"use client";

import { useEffect, useRef, useState } from "react";
import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
import type { DesignDoc } from "@/lib/design";

type Device = "browser" | "phone";

/**
 * Renders a *real* Velt design document (via the production PrototypeRenderer)
 * scaled to fit within a device frame. This is not a screenshot or mockup —
 * it is the live rendering engine output.
 */
export function DemoCanvas({
  doc,
  baseWidth,
  device = "browser",
  maxHeight,
}: {
  doc: DesignDoc;
  baseWidth: number;
  device?: Device;
  maxHeight?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const avail = outer.clientWidth;
      if (avail > 0) setScale(avail / baseWidth);
      setInnerHeight(inner.scrollHeight);
    };

    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    const mo = new MutationObserver(measure);
    mo.observe(inner, { childList: true, subtree: true });
    window.addEventListener("load", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("load", measure);
    };
  }, [baseWidth, doc]);

  const phone = device === "phone";
  const chrome = device === "browser" ? 41 : 0;
  const contentHeight = maxHeight
    ? maxHeight
    : Math.min(innerHeight, 12000) * scale;

  return (
    <div
      ref={outerRef}
      className={`demo-frame ${phone ? "demo-frame-phone" : "demo-frame-browser"}`}
      style={{ height: innerHeight ? `${contentHeight + chrome}px` : undefined }}
    >
      {device === "browser" ? (
        <div className="flex items-center gap-1.5 border-b border-[#e3e0d9] bg-[#f7f6f3] px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 hidden flex-1 truncate rounded-md bg-white px-3 py-1 text-[10.5px] text-[#9a968e] sm:block">
            velt.app — {doc.name}
          </span>
        </div>
      ) : null}

      <div className="relative overflow-hidden" style={{ height: innerHeight ? `${contentHeight}px` : undefined }}>
        <div
          ref={innerRef}
          className="demo-canvas"
          style={{
            width: baseWidth,
            transform: `scale(${scale})`,
            opacity: scale ? 1 : 0,
          }}
        >
          <PrototypeRenderer doc={doc} />
        </div>
      </div>
    </div>
  );
}
