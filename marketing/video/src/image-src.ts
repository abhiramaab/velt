import { staticFile } from "remotion";
import type { DesignDoc } from "@/lib/design";

/*
  Velt docs reference images as web paths, e.g. "/showcases/s3.jpg". Inside
  Remotion those must be resolved through staticFile() so the headless Chromium
  renderer can find them in the served public directory. We deep-clone the doc
  and rewrite every image-bearing field, leaving the original samples untouched.
*/
function resolve(src: unknown): unknown {
  if (typeof src !== "string") return src;
  if (src.startsWith("/")) return staticFile(src.slice(1));
  return src;
}

export function withStaticImages(doc: DesignDoc): DesignDoc {
  return {
    ...doc,
    sections: doc.sections.map((section) => {
      const next: Record<string, unknown> = { ...section };
      if ("image" in next) next.image = resolve(next.image);
      if (Array.isArray(next.items)) {
        next.items = (next.items as unknown[]).map((item) => {
          if (item && typeof item === "object" && "image" in (item as object)) {
            return { ...(item as object), image: resolve((item as { image: unknown }).image) };
          }
          return item;
        });
      }
      return next as (typeof doc.sections)[number];
    }),
  };
}
