# Velt Launch Video (Remotion)

A 50-second, high-conversion product launch video for Velt — the AI Design Director.
Every product screen is rendered **1:1 from the real Velt codebase**, not recreated by hand.

- 1920×1080 · 30 fps · 1500 frames (50s)
- Composition id: `VeltLaunch`

## How it stays authentic

| What | Source of truth |
| --- | --- |
| Prototype UI | `frontend/src/components/renderer/PrototypeRenderer.tsx` (imported directly) |
| Sample drafts (AURELI / LUMEN / Kama) | `frontend/src/lib/samples.ts` |
| Design tokens, studio helpers | `frontend/src/app/globals.css` |
| Pricing | `frontend/src/app/pricing/page.tsx` |
| Fonts | `EB Garamond` + `Instrument Sans` (same families as `next/font` in `layout.tsx`) |

### Font aliasing
Velt's real `PrototypeRenderer` asks for `var(--font-fraunces)` / `var(--font-figtree)`.
`src/styles/global.css` aliases those names to the actual Velt typefaces
(`--font-lastik` = EB Garamond, `--font-instrument` = Instrument Sans) so the
renderer resolves to the same fonts the live app uses.

## Path aliases
`@/*` resolves to `/home/abh1ram/Projects/velt/frontend/src/*`. Because Remotion
eval()s `remotion.config.ts` from `@remotion/cli/dist`, paths are resolved from
`process.cwd()` (not `__dirname`).

## Commands

```bash
npm install

# interactive preview
npm run studio

# verify a single frame
npx remotion still VeltLaunch out/check.png --frame=360 --browser-executable=/usr/bin/chromium

# final render
npx remotion render VeltLaunch out/velt_launch.mp4 --concurrency=4 --browser-executable=/usr/bin/chromium
```

> On this machine Remotion's headless-shell download is unreliable; the system
> Chromium is used via `--browser-executable=/usr/bin/chromium` (or set
> `REMOTION_BROWSER`).

## Scene timeline

| Scene | Frames | Time | Content |
| --- | --- | --- | --- |
| 1 Brand hook | 0–210 | 0–7s | Obsidian + blue bloom, badge, "Don't start with a blank wireframe. / Start with taste." |
| 2 Studio composer | 210–510 | 7–17s | Real `/studio` screen, format pills, typing, Compose click |
| 3 Editor canvas | 510–960 | 17–32s | Real `/studio/[id]` editor with AURELI rendered, camera drift/scroll |
| 4 Multi-format morph | 960–1260 | 32–42s | LUMEN noir editorial → crossfade → Kama Kyoto atelier |
| 5 Pricing & outro | 1260–1500 | 42–50s | Real pricing cards ($6/$19/$26) + "Start Free at velt.cloud" |

## Structure

```
src/
  index.ts            # registerRoot + global.css
  Root.tsx            # composition registration
  VeltLaunch.tsx      # scene sequencing + crossfades
  timeline.ts         # frame boundaries, colors
  load-fonts.ts       # EB Garamond / Instrument Sans
  velt-data.ts        # imports SAMPLES + PLANS
  image-src.ts        # rewrites image paths through staticFile()
  components/Chrome.tsx
  scenes/*.tsx
  styles/global.css
```
