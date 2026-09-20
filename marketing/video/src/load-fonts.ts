import type { CSSProperties } from "react";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadInstrumentSans } from "@remotion/google-fonts/InstrumentSans";

/*
  Load the exact two Velt typefaces. Velt uses next/font in the app, which we
  cannot use inside Remotion, so we fetch the same families from Google Fonts and
  expose them under the CSS variable names the real components expect.

  - EB Garamond    -> --font-lastik      (display / serif, .font-display)
                      also aliased to --font-fraunces for <PrototypeRenderer>
  - Instrument Sans -> --font-instrument (UI sans, --font-sans)
                      also aliased to --font-figtree for <PrototypeRenderer>
*/
export const { fontFamily: lastikFamily } = loadEBGaramond("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const { fontFamily: lastikItalicFamily } = loadEBGaramond("italic", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const { fontFamily: instrumentFamily } = loadInstrumentSans("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const serifStack = `${lastikFamily}, "EB Garamond", "Times New Roman", Times, serif`;
const sansStack = `${instrumentFamily}, ui-sans-serif, system-ui, sans-serif`;

export const fontVariables = {
  "--font-lastik": serifStack,
  "--font-instrument": sansStack,
  "--font-geist-sans": sansStack,
  "--font-fraunces": serifStack,
  "--font-figtree": sansStack,
  fontFamily: sansStack,
} as CSSProperties;
