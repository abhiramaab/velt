import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CreditBadge, StudioSidebar, VeltWordmark } from "../components/Chrome";
import { STUDIO_PROMPT } from "../velt-data";
import { fontVariables } from "../load-fonts";

/*
  Scene 2 — Authentic Velt Studio composer (7s - 17s)
  Reproduces frontend/src/app/studio/page.tsx: the warm paper composer card, the
  format pills, a realistic typing animation, and a click on the real accent
  Compose button.
  Scene-local frames: 0..300
*/
const TYPING_START = 40;
const TYPING_END = 170;
const CLICK_FRAME = 205;

/*
  The exact pill row the brief calls out: Web Design active, then Landing Page,
  App Design, Dashboard, Poster. Labels match FORMATS in lib/design.ts.
*/
const PILLS = [
  { label: "Web Design", active: true },
  { label: "Landing Page", active: false },
  { label: "App Design", active: false },
  { label: "Dashboard", active: false },
  { label: "Poster", active: false },
] as const;

export function StudioComposer() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typedCount = Math.round(
    interpolate(frame, [TYPING_START, TYPING_END], [0, STUDIO_PROMPT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typed = STUDIO_PROMPT.slice(0, typedCount);
  const caretOn = frame < TYPING_START || Math.floor(frame / 16) % 2 === 0;

  const cardIn = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });

  const clickedAt = frame - CLICK_FRAME;
  const press = spring({
    frame: clickedAt,
    fps,
    config: { damping: 14, stiffness: 220 },
  });
  const buttonScale = clickedAt < 0 ? 1 : interpolate(press, [0, 0.4, 1], [1, 0.94, 1], {
    extrapolateRight: "clamp",
  });
  const ripple = interpolate(clickedAt, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(clickedAt, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        ...fontVariables,
        background: "var(--color-paper)",
        flexDirection: "row",
      }}
    >
      <StudioSidebar />

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Real studio top bar */}
        <div className="flex items-center justify-between border-b border-line px-8 py-4">
          <VeltWordmark />
          <CreditBadge credits={40} />
        </div>

        <div
          className="mx-auto w-full"
          style={{ maxWidth: 980, padding: "66px 40px 0" }}
        >
          <p className="text-[13px] uppercase tracking-[0.22em] text-muted">
            New composition
          </p>
          <h1
            className="font-display"
            style={{
              marginTop: 10,
              fontSize: 52,
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              opacity: cardIn,
            }}
          >
            What are we making?
          </h1>

          <div
            className="prompt-ring"
            style={{
              marginTop: 28,
              borderRadius: 28,
              border: "1px solid var(--color-line)",
              background: "var(--color-paper-2)",
              padding: 22,
              opacity: cardIn,
              transform: `translateY(${interpolate(cardIn, [0, 1], [22, 0])}px)`,
              boxShadow: "0 30px 70px -50px rgba(15,23,42,0.45)",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {PILLS.map((f) => (
                <span
                  key={f.label}
                  style={{
                    borderRadius: 999,
                    padding: "7px 16px",
                    fontSize: 13,
                    fontWeight: f.active ? 600 : 400,
                    background: f.active ? "var(--color-ink)" : "transparent",
                    color: f.active ? "var(--color-paper)" : "var(--color-muted)",
                    border: f.active ? "1px solid var(--color-ink)" : "1px solid var(--color-line)",
                  }}
                >
                  {f.label}
                </span>
              ))}
            </div>

            <div
              style={{
                minHeight: 116,
                fontSize: 20,
                lineHeight: 1.55,
                color: "var(--color-ink)",
                fontFamily: "var(--font-instrument)",
              }}
            >
              {typed}
              <span
                style={{
                  display: "inline-block",
                  width: 2.5,
                  height: 22,
                  marginLeft: 2,
                  verticalAlign: "middle",
                  background: "var(--color-accent)",
                  opacity: caretOn ? 1 : 0,
                }}
              />
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 14, color: "var(--color-muted)" }}>
                40 credits · 2 to compose
              </span>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 999,
                    padding: "12px 30px",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#fff",
                    background: "var(--color-accent)",
                    boxShadow: `0 0 ${glow * 34}px ${glow * 6}px rgba(0,165,239,${glow * 0.45})`,
                    transform: `scale(${buttonScale})`,
                    overflow: "hidden",
                  }}
                >
                  Compose
                  {ripple > 0 && ripple < 1 && (
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 260,
                        height: 260,
                        marginLeft: -130,
                        marginTop: -130,
                        borderRadius: 999,
                        border: "2px solid rgba(255,255,255,0.85)",
                        opacity: 1 - ripple,
                        transform: `scale(${0.1 + ripple * 1.15})`,
                      }}
                    />
                  )}
                </div>
                {/* cursor */}
                <Cursor frame={frame} clickFrame={CLICK_FRAME} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            {["A quiet ceramic studio in Kyoto", "SaaS landing page for a writing app", "Neighborhood bakery mobile app"].map(
              (s) => (
                <span
                  key={s}
                  style={{
                    borderRadius: 999,
                    border: "1px solid var(--color-line)",
                    padding: "7px 16px",
                    fontSize: 13,
                    color: "var(--color-muted)",
                  }}
                >
                  {s}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Cursor({ frame, clickFrame }: { frame: number; clickFrame: number }) {
  const startX = 420;
  const startY = 120;
  const targetX = 118;
  const targetY = 40;
  const t = interpolate(frame, [clickFrame - 46, clickFrame - 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = 1 - Math.pow(1 - t, 3);
  const x = interpolate(ease, [0, 1], [startX, targetX]);
  const y = interpolate(ease, [0, 1], [startY, targetY]);
  const clicked = frame >= clickFrame;
  const clickPulse = clicked ? interpolate(frame - clickFrame, [0, 6, 14], [1, 0.82, 1], { extrapolateRight: "clamp" }) : 1;

  return (
    <svg
      width={26}
      height={30}
      viewBox="0 0 26 30"
      style={{
        position: "absolute",
        left: x,
        top: y,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
        transform: `scale(${clickPulse})`,
        transformOrigin: "top left",
      }}
    >
      <path
        d="M4 2 L4 23 L10.2 17.4 L14 26.5 L17.8 24.8 L13.9 15.9 L21.5 15.6 Z"
        fill="#0f172b"
        stroke="#ffffff"
        strokeWidth="1.4"
      />
    </svg>
  );
}
