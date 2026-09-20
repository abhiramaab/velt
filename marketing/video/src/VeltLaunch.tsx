import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BrandHook } from "./scenes/BrandHook";
import { StudioComposer } from "./scenes/StudioComposer";
import { EditorCanvas } from "./scenes/EditorCanvas";
import { MultiFormat } from "./scenes/MultiFormat";
import { PricingOutro } from "./scenes/PricingOutro";
import { FPS, SCENES, TOTAL_FRAMES } from "./timeline";

export const VELT_LAUNCH_FPS = FPS;
export const VELT_LAUNCH_DURATION = TOTAL_FRAMES;

/*
  VeltLaunch — 50s, 1500 frames @ 30fps, 1920x1080.
  Five scenes laid end-to-end with gentle crossfades between the product screens.
*/
export function VeltLaunch() {
  return (
    <AbsoluteFill style={{ background: "#07090e" }}>
      <Scene sequence={SCENES.brandHook}>
        <BrandHook />
      </Scene>

      <Scene sequence={SCENES.studioComposer} fadeIn>
        <StudioComposer />
      </Scene>

      <Scene sequence={SCENES.editorCanvas} fadeIn>
        <EditorCanvas />
      </Scene>

      <Scene sequence={SCENES.multiFormat} fadeIn>
        <MultiFormat />
      </Scene>

      <Scene sequence={SCENES.pricingOutro} fadeIn>
        <PricingOutro />
      </Scene>
    </AbsoluteFill>
  );
}

function Scene({
  sequence,
  children,
  fadeIn = false,
}: {
  sequence: { from: number; to: number };
  children: React.ReactNode;
  fadeIn?: boolean;
}) {
  return (
    <Sequence from={sequence.from} durationInFrames={sequence.to - sequence.from} premountFor={30}>
      {fadeIn ? <FadeIn duration={sequence.to - sequence.from}>{children}</FadeIn> : children}
    </Sequence>
  );
}

function FadeIn({ duration, children }: { duration: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [duration - 8, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  void fps;
  return <AbsoluteFill style={{ opacity: Math.min(opacity, fadeOut) }}>{children}</AbsoluteFill>;
}
