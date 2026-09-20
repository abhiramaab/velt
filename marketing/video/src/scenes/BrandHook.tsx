import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../timeline";
import { fontVariables } from "../load-fonts";

/*
  Scene 1 — Kinetic brand hook (0s - 7s)
  Obsidian field, blue radial bloom, pulsing cyan badge pill, then two headline
  lines: a clean sans statement and a serif italic turn.
*/
export function BrandHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const line1In = spring({
    frame: frame - 14,
    fps,
    config: { damping: 22, stiffness: 130 },
  });
  const line2In = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20, stiffness: 110 },
  });
  const subIn = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = (Math.sin((frame / fps) * Math.PI * 2 * 1.1) + 1) / 2;

  return (
    <AbsoluteFill
      style={{
        ...fontVariables,
        background: COLORS.obsidian,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -55%)",
          background: `radial-gradient(circle, rgba(0,139,227,0.15) 0%, rgba(0,139,227,0.06) 38%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          right: "-12%",
          bottom: "-30%",
          background: `radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 120px",
          transform: `translateY(-10px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 999,
            padding: "10px 22px",
            opacity: badgeIn,
            transform: `translateY(${interpolate(badgeIn, [0, 1], [14, 0])}px)`,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: COLORS.skyLight,
              boxShadow: `0 0 ${8 + pulse * 12}px ${2 + pulse * 3}px rgba(0,165,239,${0.5 + pulse * 0.4})`,
            }}
          />
          <span
            style={{
              fontSize: 15,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#9ec9e8",
            }}
          >
            The AI Design Director
          </span>
        </div>

        <h1
          style={{
            margin: "44px 0 0",
            fontSize: 84,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            fontWeight: 500,
            color: "#ffffff",
            opacity: line1In,
            transform: `scale(${interpolate(line1In, [0, 1], [0.95, 1])})`,
          }}
        >
          Don&apos;t start with a blank wireframe.
        </h1>

        <div
          style={{
            marginTop: 6,
            fontSize: 96,
            lineHeight: 1.05,
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            background: `linear-gradient(100deg, ${COLORS.skyGradientFrom} 0%, ${COLORS.skyGradientTo} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: line2In,
            transform: `translateY(${interpolate(line2In, [0, 1], [26, 0])}px)`,
          }}
        >
          Start with taste.
        </div>

        <p
          style={{
            marginTop: 34,
            maxWidth: 760,
            fontSize: 21,
            lineHeight: 1.6,
            color: "rgba(226,232,240,0.72)",
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [16, 0])}px)`,
          }}
        >
          Velt transforms one natural brief into production-ready UI prototypes and
          live code.
        </p>
      </div>
    </AbsoluteFill>
  );
}
