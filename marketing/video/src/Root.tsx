import { Composition } from "remotion";
import { VeltLaunch, VELT_LAUNCH_DURATION, VELT_LAUNCH_FPS } from "./VeltLaunch";

export function RemotionRoot() {
  return (
    <Composition
      id="VeltLaunch"
      component={VeltLaunch}
      durationInFrames={VELT_LAUNCH_DURATION}
      fps={VELT_LAUNCH_FPS}
      width={1920}
      height={1080}
    />
  );
}
