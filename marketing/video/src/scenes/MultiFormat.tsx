import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
import { StudioSidebar } from "../components/Chrome";
import { LUMEN_DOC, KAMA_DOC } from "../velt-data";
import { withStaticImages } from "../image-src";
import { fontVariables } from "../load-fonts";

/*
  Scene 4 — Multi-format morph (32s - 42s)
  Proves Velt adapts taste instantly: LUMEN (noir editorial) crossfades to Kama
  (Kyoto washi atelier). Both rendered by the real <PrototypeRenderer>.
  Scene-local frames: 0..300
*/
const LUMEN = withStaticImages(LUMEN_DOC);
const KAMA = withStaticImages(KAMA_DOC);
const FRAME_WIDTH = 1280;

const CROSSFADE_START = 150;
const CROSSFADE_END = 195;

export function MultiFormat() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topBarIn = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });
  const scale = 0.9;

  const fade = interpolate(frame, [CROSSFADE_START, CROSSFADE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lumentPan = interpolate(frame, [0, 150], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kamaPan = interpolate(frame, [CROSSFADE_START, 300], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        ...fontVariables,
        background: "var(--color-paper)",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <StudioSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Live prototype status strip */}
        <div
          className="flex items-center justify-between border-b border-line px-8 py-4"
          style={{
            opacity: topBarIn,
            transform: `translateY(${interpolate(topBarIn, [0, 1], [-14, 0])}px)`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3.5 py-1.5 text-[12px] text-muted"
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: "var(--color-accent)",
                  boxShadow: "0 0 0 3px rgba(0,165,239,0.18)",
                }}
              />
              Live prototype
            </span>
            <span className="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium" style={{ color: "var(--color-paper)" }}>
              Standalone Code · Tailwind + HTML
            </span>
          </div>
          <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
            {fade < 0.5 ? "LUMEN · editorial" : "Kama · atelier"}
          </span>
        </div>

        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            backgroundImage:
              "linear-gradient(#d8d0c4 1px, transparent 1px), linear-gradient(90deg, #d8d0c4 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          {/* LUMEN */}
          <PrototypeCanvas opacity={1 - fade} translateY={lumentPan} scale={scale}>
            <PrototypeRenderer doc={LUMEN} device="desktop" />
          </PrototypeCanvas>

          {/* Kama */}
          <PrototypeCanvas opacity={fade} translateY={kamaPan} scale={scale} absolute>
            <PrototypeRenderer doc={KAMA} device="desktop" />
          </PrototypeCanvas>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function PrototypeCanvas({
  children,
  opacity,
  translateY,
  scale,
  absolute = false,
}: {
  children: React.ReactNode;
  opacity: number;
  translateY: number;
  scale: number;
  absolute?: boolean;
}) {
  return (
    <div
      className="frame-shadow"
      style={{
        position: absolute ? "absolute" : "relative",
        marginTop: 28,
        width: FRAME_WIDTH * scale,
        height: "calc(100% - 28px)",
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: 24,
        border: "1px solid var(--color-line)",
        background: "var(--color-paper)",
        opacity,
        zIndex: absolute ? 5 : 1,
      }}
    >
      <div
        style={{
          width: FRAME_WIDTH,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
