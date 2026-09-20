import { SAMPLES } from "@/lib/samples";
import type { DesignDoc } from "@/lib/design";

function requireSample(name: string): DesignDoc {
  const found = SAMPLES.find((s) => s.name === name);
  if (!found) {
    throw new Error(`Velt sample "${name}" not found in samples.ts`);
  }
  return found;
}

/*
  The video recreates the exact drafts a user would generate in Velt Studio.
  These are imported straight from the real sample library — nothing is
  hand-drawn or approximated.
*/
export const AURELI_DOC = requireSample("AURELI");
export const LUMEN_DOC = requireSample("LUMEN");
export const KAMA_DOC = requireSample("Kama");

/*
  Scene 2 prompt — the natural-language brief typed into the studio composer.
  Matches the architecture sample used for the live editor canvas.
*/
export const STUDIO_PROMPT =
  "Monolithic concrete architecture in Zurich. Alpine pavilions, high contrast, Volume IX.";

/*
  Pricing is lifted 1:1 from frontend/src/app/pricing/page.tsx.
*/
export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthly: 6,
    note: "Perfect for getting started.",
    items: [
      "85 images / month",
      "Website Design generations",
      "Graphic Design generations",
      "Chat-based refinements",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 19,
    note: "For creators who want more.",
    items: [
      "250 images / month",
      "Everything in Starter",
      "Advanced Reasoning",
      "Priority rendering queue",
    ],
  },
  {
    id: "max",
    name: "Max",
    monthly: 26,
    note: "Built for power users.",
    items: [
      "450 images / month",
      "Everything in Pro",
      "Long-context memory",
      "Priority support",
    ],
  },
] as const;
