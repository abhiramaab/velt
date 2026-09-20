import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PrototypeRenderer } from "@/components/renderer/PrototypeRenderer";
import { StudioSidebar, DeviceSwitcher, ExportCodeButton, ExportJsonButton } from "../components/Chrome";
import { AURELI_DOC } from "../velt-data";
import { withStaticImages } from "../image-src";
import { fontVariables } from "../load-fonts";

/*
  Scene 3 — Live Velt editor canvas (17s - 32s)
  Reproduces frontend/src/components/studio/Editor.tsx with the AURELI sample
  rendered by the real <PrototypeRenderer>. A Screen-Studio style camera drifts
  in (subtle zoom) and scrolls down to reveal the project bento grid.
  Scene-local frames: 0..450
*/
const DOC = withStaticImages(AURELI_DOC);
const FRAME_WIDTH = 1280;

export function EditorCanvas() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerIn = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });

  // Camera drift: zoom 1.0 -> 1.04, then vertical pan to reveal the grid.
  const zoom = interpolate(frame, [0, 420], [1.0, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scrollY = interpolate(frame, [150, 430], [0, -560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Frame scale keeps the 1280px doc inside the 1440px stage.
  const baseScale = 0.92;
  const stageScale = baseScale * zoom;

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
        {/* Editor header — real Editor.tsx markup */}
        <div
          className="flex items-center justify-between gap-3 border-b border-line px-8 py-4"
          style={{
            opacity: headerIn,
            transform: `translateY(${interpolate(headerIn, [0, 1], [-14, 0])}px)`,
          }}
        >
          <div>
            <div
              className="font-display"
              style={{ fontSize: 26, lineHeight: 1, color: "var(--color-ink)" }}
            >
              AURELI
            </div>
            <div
              className="uppercase"
              style={{
                marginTop: 6,
                fontSize: 12,
                letterSpacing: "0.16em",
                color: "var(--color-muted)",
              }}
            >
              website · v1
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DeviceSwitcher device="desktop" />
            <ExportCodeButton />
            <ExportJsonButton />
          </div>
        </div>

        {/* Dot-grid stage with the real rendered prototype */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            backgroundImage:
              "linear-gradient(#d8d0c4 1px, transparent 1px), linear-gradient(90deg, #d8d0c4 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div
            className="frame-shadow"
            style={{
              marginTop: 28,
              width: FRAME_WIDTH * stageScale,
              height: "100%",
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: 24,
              border: "1px solid var(--color-line)",
              background: "var(--color-paper)",
            }}
          >
            <div
              style={{
                width: FRAME_WIDTH,
                transform: `scale(${stageScale}) translateY(${scrollY}px)`,
                transformOrigin: "top center",
              }}
            >
              <PrototypeRenderer doc={DOC} device="desktop" />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
