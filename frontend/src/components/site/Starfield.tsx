"use client";

const STARS = Array.from({ length: 96 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 19 + 7) % 62}%`,
  size: i % 11 === 0 ? 2.4 : i % 5 === 0 ? 1.6 : 1,
  delay: `${(i % 10) * 0.35}s`,
  dur: `${2.2 + (i % 6) * 0.55}s`,
  opacity: i % 4 === 0 ? 0.95 : 0.55,
}));

export function Starfield() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star-twinkle absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: s.dur,
            boxShadow: s.size > 1.5 ? "0 0 6px 1px rgba(255,255,255,0.7)" : "none",
          }}
        />
      ))}
      <span className="shooting-star" style={{ top: "22%", left: "48%", animationDelay: "9s" }} />
      <span className="comet" />
    </div>
  );
}
