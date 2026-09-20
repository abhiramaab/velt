import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, Sparkles } from "lucide-react";
import { PLANS } from "../velt-data";
import { COLORS } from "../timeline";
import { VeltGlyph } from "../components/Chrome";
import { fontVariables } from "../load-fonts";

/*
  Scene 5 — Pricing wedge & launch outro (42s - 50s)
  Real pricing cards from frontend/src/app/pricing/page.tsx ($6/$19/$26 at
  85/250/450 images per month). Pro is the middle card. Final CTA pill.
  Scene-local frames: 0..240
*/
export function PricingOutro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconIn = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.7 },
  });
  const headingIn = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 120 } });
  const ctaIn = spring({ frame: frame - 70, fps, config: { damping: 16, stiffness: 120 } });

  return (
    <AbsoluteFill
      style={{
        ...fontVariables,
        background: "#0b1018",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1000,
          top: "-20%",
          background:
            "radial-gradient(ellipse at center, rgba(0,139,227,0.20) 0%, transparent 62%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            transform: `translateY(${interpolate(iconIn, [0, 1], [-40, 0])}px) scale(${interpolate(
              iconIn,
              [0, 0.6, 1],
              [0.6, 1.12, 1]
            )})`,
          }}
        >
          <VeltGlyph size={72} />
        </div>

        <h2
          style={{
            margin: "26px 0 0",
            fontSize: 46,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            fontFamily: "var(--font-fraunces)",
            opacity: headingIn,
            transform: `translateY(${interpolate(headingIn, [0, 1], [20, 0])}px)`,
          }}
        >
          Taste, on a subscription.
        </h2>
        <p
          style={{
            marginTop: 12,
            fontSize: 18,
            color: "rgba(226,232,240,0.62)",
            opacity: headingIn,
          }}
        >
          Every plan includes full generation, chat refinement, and standalone code export.
        </p>

        <div style={{ marginTop: 44, display: "flex", gap: 20 }}>
          {PLANS.map((plan, i) => {
            const cardIn = spring({
              frame: frame - (34 + i * 8),
              fps,
              config: { damping: 18, stiffness: 130 },
            });
            const highlighted = i === 1;
            return (
              <div
                key={plan.id}
                style={{
                  width: 320,
                  borderRadius: 22,
                  border: highlighted
                    ? "1px solid rgba(0,165,239,0.9)"
                    : "1px solid rgba(255,255,255,0.10)",
                  background: highlighted
                    ? "linear-gradient(180deg, rgba(0,139,227,0.16) 0%, rgba(15,23,42,0.9) 60%)"
                    : "rgba(255,255,255,0.035)",
                  padding: 28,
                  opacity: cardIn,
                  transform: `translateY(${interpolate(cardIn, [0, 1], [34, 0])}px)`,
                  boxShadow: highlighted
                    ? "0 30px 70px -30px rgba(0,139,227,0.7)"
                    : "0 24px 60px -40px rgba(0,0,0,0.8)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{plan.name}</span>
                  {highlighted && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        borderRadius: 999,
                        background: "rgba(0,165,239,0.22)",
                        color: "#7cc7f7",
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      <Sparkles size={12} /> Popular
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 56,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: "#fff",
                    fontFamily: "var(--font-fraunces)",
                  }}
                >
                  ${plan.monthly}
                  <span style={{ fontSize: 18, opacity: 0.55, fontFamily: "var(--font-instrument)" }}>
                    {" "}
                    / mo
                  </span>
                </div>
                <p style={{ marginTop: 12, fontSize: 14, color: "rgba(226,232,240,0.55)" }}>
                  {plan.note}
                </p>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 9 }}>
                  {plan.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        fontSize: 14,
                        color: "rgba(226,232,240,0.82)",
                      }}
                    >
                      <Check size={14} color="#00a5ef" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 46,
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderRadius: 999,
            padding: "18px 44px",
            fontSize: 22,
            fontWeight: 600,
            color: "#fff",
            background: `linear-gradient(100deg, ${COLORS.skyGradientFrom} 0%, ${COLORS.brandBlue} 100%)`,
            boxShadow: "0 24px 60px -22px rgba(0,165,239,0.85)",
            opacity: ctaIn,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [18, 0])}px)`,
          }}
        >
          Start Free at velt.cloud
          <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.85 }}>
            · 40 credits included
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
