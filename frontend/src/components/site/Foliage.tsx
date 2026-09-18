"use client";

import { useEffect, useState } from "react";

interface Leaf {
  id: number;
  left: number;
  drift: number;
  fall: number;
  size: number;
  duration: number;
  delay: number;
  flutter: number;
  opacity: number;
  rotate: number;
  hue: number;
}

const GREENS = ["#4f7a3a", "#6b9a4e", "#8fb56a", "#3f6b34", "#a7c47e"];

export function Foliage() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const generated: Leaf[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: 4 + ((i * 37) % 92),
      drift: 40 + ((i * 29) % 150) * (i % 2 === 0 ? 1 : -1),
      fall: 60 + ((i * 41) % 55),
      size: 14 + (i % 4) * 6,
      duration: 9 + (i % 5) * 1.8,
      delay: -(i * 0.7),
      flutter: 2.8 + (i % 4) * 0.6,
      opacity: 0.55 + (i % 3) * 0.12,
      rotate: (i * 71) % 360,
      hue: i % GREENS.length,
    }));
    setLeaves(generated);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden select-none" aria-hidden="true">
      {leaves.map((l) => (
        <div
          key={l.id}
          className="leaf-fall"
          style={{
            left: `${l.left}%`,
            top: "-40px",
            animation: `leafFall ${l.duration}s cubic-bezier(0.33, 1, 0.68, 1) ${l.delay}s infinite`,
            ["--leaf-drift" as string]: `${l.drift}px`,
            ["--leaf-fall" as string]: `${l.fall}vh`,
            ["--leaf-spin" as string]: `${l.rotate}deg`,
          }}
        >
          <svg
            viewBox="0 0 32 32"
            className="leaf-flutter"
            style={{
              width: `${l.size}px`,
              height: `${l.size}px`,
              opacity: l.opacity,
              animationDuration: `${l.flutter}s`,
              filter: "drop-shadow(0 2px 3px rgba(20, 50, 20, 0.28))",
            }}
          >
            <path
              d="M16 3 C8 7 4 15 6 23 C9 29 23 29 26 23 C28 15 24 7 16 3 Z"
              fill={GREENS[l.hue]}
            />
            <path
              d="M16 5 L16 26"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
