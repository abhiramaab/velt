import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";
import type { WebpackConfiguration } from "@remotion/bundler";

/*
  Resolve paths from the project root. NOTE: Remotion eval()s this config after
  bundling it, so __dirname points at @remotion/cli/dist — not this file. The CLI
  chdir()s to the project root before eval, so process.cwd() is reliable here.
*/
const PROJECT_ROOT = process.cwd();
const FRONTEND_SRC = path.resolve(PROJECT_ROOT, "../../frontend/src");
const FRONTEND_PUBLIC = path.resolve(PROJECT_ROOT, "../../frontend/public");

const POSTCSS_LOADER = path.resolve(
  PROJECT_ROOT,
  "node_modules/postcss-loader/dist/cjs.js"
);

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPublicDir(FRONTEND_PUBLIC);
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(4);

if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}

Config.overrideWebpackConfig((current) => {
  const withTailwind = enableTailwind(current);

  const existingAlias = withTailwind.resolve?.alias;
  const alias: Record<string, string | false | string[]> = {
    ...(typeof existingAlias === "object" && existingAlias !== null
      ? (existingAlias as Record<string, string | false | string[]>)
      : {}),
    // Let `@/foo` resolve to the real Velt frontend source tree.
    "@": FRONTEND_SRC,
  };

  const resolve: WebpackConfiguration["resolve"] = {
    ...(withTailwind.resolve ?? {}),
    alias,
    modules: [
      path.resolve(PROJECT_ROOT, "node_modules"),
      "node_modules",
      ...((withTailwind.resolve?.modules as string[]) ?? []),
    ],
    extensions: [
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
      ...((withTailwind.resolve?.extensions as string[]) ?? []),
    ],
  };

  /*
    Build the CSS rule ourselves and pass the Tailwind v4 PostCSS plugin
    inline. postcss-loader's config-file auto-discovery is unreliable here
    (the plugin silently no-ops), so we inject the plugin options directly.
  */
  const cssRule = {
    test: /\.css$/i,
    use: [
      require.resolve("style-loader"),
      require.resolve("css-loader"),
      {
        loader: POSTCSS_LOADER,
        options: {
          postcssOptions: {
            plugins: [require.resolve("@tailwindcss/postcss")],
          },
        },
      },
    ],
  };

  const nonCssRules = (withTailwind.module?.rules ?? []).filter((rule) => {
    const test = rule && typeof rule === "object" && "test" in rule ? (rule as { test?: RegExp }).test : undefined;
    return !(test && test.toString().includes("css"));
  });

  const module = {
    ...withTailwind.module,
    rules: [...nonCssRules, cssRule],
  };

  return {
    ...withTailwind,
    module,
    resolve,
  };
});
