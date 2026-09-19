"use client";

import { useEffect, useState } from "react";

interface Petal {
  id: number;
  originX: number; // percentage from tree left (0 to 100% of tree box)
  originY: number; // percentage from tree top (0 to 100% of tree box)
  driftX: number;  // horizontal drift distance in px
  fallY: number;   // vertical fall distance in px
  size: number;
  duration: number;
  delay: number;
  swayDur: number;
  opacity: number;
  rotation: number;
}

export function SakuraPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate petals locked strictly to the tree canopy
    const generated: Petal[] = Array.from({ length: 22 }, (_, i) => {
      // Canopy covers ~15% to 85% width of the tree container, and 5% to 65% height
      const originX = 20 + ((i * 13) % 65);
      const originY = 8 + ((i * 17) % 55);
      const driftX = 35 + ((i * 19) % 110); // gentle natural drift rightwards
      const fallY = 160 + ((i * 23) % 240); // fall down past trunk towards grass

      return {
        id: i,
        originX,
        originY,
        driftX,
        fallY,
        size: 7 + (i % 3) * 2, // 7px - 11px
        duration: 5.5 + (i % 4) * 1.2, // 5.5s - 9.1s
        delay: -(i * 0.4),
        swayDur: 2.2 + (i % 3) * 0.5,
        opacity: 0.85 + ((i % 3) * 0.05),
        rotation: (i * 53) % 360,
      };
    });
    setPetals(generated);
  }, []);

  return (
    <div
      className="pointer-events-none absolute z-[4] hidden overflow-visible select-none sm:block"
      aria-hidden="true"
      style={{
        /* Exact bounding box of the tree canopy in the desktop hero
           (blossoms measured at ~10-18% width, ~40-58% height) */
        left: "6%",
        top: "34%",
        width: "260px",
        height: "340px",
      }}
    >
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <linearGradient id="sakuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff5f8" />
            <stop offset="50%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal-from-tree absolute"
          style={{
            left: `${p.originX}%`,
            top: `${p.originY}%`,
            animation: `petalFallNatural ${p.duration}s cubic-bezier(0.33, 1, 0.68, 1) ${p.delay}s infinite`,
            ["--drift-x" as string]: `${p.driftX}px`,
            ["--fall-y" as string]: `${p.fallY}px`,
          }}
        >
          <svg
            viewBox="0 0 30 30"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `petalFlutterNatural ${p.swayDur}s ease-in-out infinite alternate`,
              transform: `rotate(${p.rotation}deg)`,
              filter: "drop-shadow(0 1px 2px rgba(244,114,182,0.35))",
            }}
          >
            <path
              d="M15 3 C10 6 5 14 7 21 C9 26 21 26 23 21 C25 14 20 6 15 3 Z"
              fill="url(#sakuraGrad)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
