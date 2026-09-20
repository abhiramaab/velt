export const FPS = 30;
export const TOTAL_FRAMES = 1500; // 50s

/*
  Scene boundaries straight from the brief (30fps, absolute frames).
*/
export const SCENES = {
  brandHook: { from: 0, to: 210 }, // 0s - 7s
  studioComposer: { from: 210, to: 510 }, // 7s - 17s
  editorCanvas: { from: 510, to: 960 }, // 17s - 32s
  multiFormat: { from: 960, to: 1260 }, // 32s - 42s
  pricingOutro: { from: 1260, to: 1500 }, // 42s - 50s
} as const;

export const SCENE_DURATION = {
  brandHook: SCENES.brandHook.to - SCENES.brandHook.from,
  studioComposer: SCENES.studioComposer.to - SCENES.studioComposer.from,
  editorCanvas: SCENES.editorCanvas.to - SCENES.editorCanvas.from,
  multiFormat: SCENES.multiFormat.to - SCENES.multiFormat.from,
  pricingOutro: SCENES.pricingOutro.to - SCENES.pricingOutro.from,
};

export const COLORS = {
  obsidian: "#07090e",
  brandBlue: "#008be3",
  skyLight: "#00a5ef",
  skyGradientFrom: "#00a5ef",
  skyGradientTo: "#60a5fa",
} as const;
