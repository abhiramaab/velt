import type { DesignDoc } from "./design";

/**
 * Compiles a Velt DesignDoc AST directly into a standalone, production-ready HTML5 + Tailwind CSS bundle.
 * This runs entirely client-side or server-side with 0 extra token cost.
 * The output can be uploaded to Shopify (custom liquid/section), WordPress (Custom HTML block),
 * Wix (Embed HTML code), or hosted on any web server / GitHub Pages.
 */
export function generateExportBundle(doc: DesignDoc): string {
  const theme = doc.theme || {
    bg: "#0d0f12",
    fg: "#f2f4f8",
    muted: "#8a93a5",
    line: "#202530",
    accent: "#38bdf8",
    accentFg: "#0d0f12",
    surface: "#14171f",
    fontDisplay: "sans",
    radius: "16px",
  };

  const isSerif = theme.fontDisplay === "serif";
  const fontFamily = isSerif
    ? "'Fraunces', Georgia, serif"
    : "'Figtree', system-ui, -apple-system, sans-serif";

  const navHtml = doc.nav
    ? `
  <header style="border-bottom: 1px solid ${theme.line}; padding: 18px 32px; display: flex; align-items: center; justify-content: space-between;">
    <div style="font-weight: 700; font-size: 1.25rem; color: ${theme.fg};">${escapeHtml(doc.nav.logo || doc.name)}</div>
    ${
      doc.nav.links && doc.nav.links.length > 0
        ? `<nav style="display: flex; gap: 24px; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; color: ${theme.muted};">
      ${doc.nav.links.map((link) => `<a href="#" style="color: inherit; text-decoration: none;">${escapeHtml(link)}</a>`).join("")}
    </nav>`
        : ""
    }
    ${
      doc.nav.cta
        ? `<a href="#action" style="background: ${theme.accent}; color: ${theme.accentFg}; padding: 8px 18px; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; text-decoration: none;">${escapeHtml(doc.nav.cta)}</a>`
        : ""
    }
  </header>`
    : "";

  const sectionsHtml = (doc.sections || []).map((sec, i) => compileSection(sec, theme, i)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(doc.name || "Velt Exported Design")}</title>
  <meta name="description" content="${escapeHtml(doc.tagline || doc.prompt || "Created with Velt.cloud")}" />
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: ${theme.bg};
      --fg: ${theme.fg};
      --muted: ${theme.muted};
      --line: ${theme.line};
      --accent: ${theme.accent};
      --accent-fg: ${theme.accentFg};
      --surface: ${theme.surface};
      --radius: ${theme.radius || "16px"};
    }
    body {
      background-color: var(--bg);
      color: var(--fg);
      font-family: ${fontFamily};
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body class="min-h-screen">
  ${navHtml}
  <main>
${sectionsHtml}
  </main>
  <footer style="border-top: 1px solid ${theme.line}; padding: 32px; text-align: center; font-size: 0.8rem; color: ${theme.muted};">
    <p>© ${new Date().getFullYear()} ${escapeHtml(doc.name || "Brand")}. Crafted with precision. Compatible with Shopify, WordPress, and Wix.</p>
  </footer>
</body>
</html>`;
}

function compileSection(section: any, theme: any, index: number): string {
  const kind = section.kind || "generic";
  const title = section.title || section.headline || section.heading || "";
  const subtitle = section.subtitle || section.tagline || section.subheading || "";
  const body = section.body || section.description || section.text || "";

  switch (kind) {
    case "hero":
    case "hero_visual":
      return `
    <section class="relative px-6 py-20 lg:py-32 max-w-6xl mx-auto text-center">
      ${subtitle ? `<div class="inline-block mb-4 px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase" style="background: ${theme.surface}; color: ${theme.accent}; border: 1px solid ${theme.line};">${escapeHtml(subtitle)}</div>` : ""}
      <h1 class="text-4xl sm:text-6xl font-bold tracking-tight mb-6" style="color: ${theme.fg};">${escapeHtml(title || "Design that commands attention")}</h1>
      ${body ? `<p class="text-lg sm:text-xl max-w-2xl mx-auto mb-8" style="color: ${theme.muted};">${escapeHtml(body)}</p>` : ""}
      ${section.cta ? `<div class="flex items-center justify-center gap-4"><a href="#start" class="px-8 py-3.5 rounded-full font-semibold transition hover:opacity-90 shadow-lg" style="background: ${theme.accent}; color: ${theme.accentFg};">${escapeHtml(section.cta)}</a></div>` : ""}
    </section>`;

    case "ecommerce_hero":
    case "shop_grid":
    case "products": {
      const items = section.products || section.items || [];
      const itemCards = items.map((it: any) => `
        <div class="rounded-2xl p-4 flex flex-col justify-between" style="background: ${theme.surface}; border: 1px solid ${theme.line};">
          <div class="aspect-square w-full rounded-xl mb-4 flex items-center justify-center text-3xl font-semibold" style="background: ${theme.bg}; color: ${theme.accent};">
            ${escapeHtml(it.icon || "✦")}
          </div>
          <div>
            <div class="text-xs uppercase tracking-wider mb-1" style="color: ${theme.muted};">${escapeHtml(it.category || "Collection")}</div>
            <h3 class="font-bold text-base mb-2" style="color: ${theme.fg};">${escapeHtml(it.title || it.name || "Signature Item")}</h3>
            <div class="flex items-center justify-between mt-3 pt-3" style="border-top: 1px solid ${theme.line};">
              <span class="font-mono font-bold" style="color: ${theme.accent};">${escapeHtml(it.price || "$120")}</span>
              <button class="px-3 py-1 text-xs rounded-full font-medium" style="background: ${theme.accent}; color: ${theme.accentFg};">Add</button>
            </div>
          </div>
        </div>
      `).join("");

      return `
    <section class="px-6 py-16 max-w-6xl mx-auto">
      <div class="flex items-baseline justify-between mb-8 pb-4" style="border-bottom: 1px solid ${theme.line};">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold" style="color: ${theme.fg};">${escapeHtml(title || "Curated Collection")}</h2>
          ${subtitle ? `<p class="text-sm mt-1" style="color: ${theme.muted};">${escapeHtml(subtitle)}</p>` : ""}
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${itemCards || `<p style="color: ${theme.muted};">Products showcase</p>`}
      </div>
    </section>`;
    }

    case "trading_chart":
    case "crypto_dashboard":
    case "analytics": {
      const stats = section.stats || section.metrics || [
        { label: "Volume 24h", value: "$42.8M", change: "+14.2%" },
        { label: "Index Price", value: "$94,320.50", change: "+3.8%" },
        { label: "Open Interest", value: "$182.1M", change: "-0.4%" },
      ];
      return `
    <section class="px-6 py-12 max-w-6xl mx-auto">
      <div class="p-6 rounded-2xl mb-6" style="background: ${theme.surface}; border: 1px solid ${theme.line};">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold font-mono" style="color: ${theme.fg};">${escapeHtml(title || "MARKET OVERVIEW // REALTIME")}</h2>
            <p class="text-xs font-mono" style="color: ${theme.muted};">${escapeHtml(subtitle || "Live Terminal Feed")}</p>
          </div>
          <div class="flex gap-2 font-mono text-xs">
            <span class="px-3 py-1 rounded" style="background: #10b98122; color: #10b981;">LIVE 240ms</span>
            <span class="px-3 py-1 rounded" style="background: ${theme.bg}; color: ${theme.muted};">ORDERBOOK ACTIVE</span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${stats.map((s: any) => `
            <div class="p-4 rounded-xl" style="background: ${theme.bg}; border: 1px solid ${theme.line};">
              <div class="text-xs uppercase tracking-wider mb-1 font-mono" style="color: ${theme.muted};">${escapeHtml(s.label)}</div>
              <div class="text-xl font-bold font-mono" style="color: ${theme.fg};">${escapeHtml(s.value)}</div>
              ${s.change ? `<div class="text-xs font-mono mt-1 ${s.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}">${escapeHtml(s.change)}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    </section>`;
    }

    case "grid":
    case "features": {
      const items = section.items || section.features || [];
      return `
    <section class="px-6 py-16 max-w-6xl mx-auto">
      ${title ? `<h2 class="text-2xl sm:text-3xl font-bold text-center mb-4" style="color: ${theme.fg};">${escapeHtml(title)}</h2>` : ""}
      ${subtitle ? `<p class="text-center max-w-xl mx-auto mb-12" style="color: ${theme.muted};">${escapeHtml(subtitle)}</p>` : ""}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${items.map((it: any) => `
          <div class="p-6 rounded-2xl" style="background: ${theme.surface}; border: 1px solid ${theme.line};">
            <h3 class="font-bold text-lg mb-2" style="color: ${theme.fg};">${escapeHtml(it.title || it.heading || "Feature")}</h3>
            <p class="text-sm leading-relaxed" style="color: ${theme.muted};">${escapeHtml(it.body || it.description || "")}</p>
          </div>
        `).join("")}
      </div>
    </section>`;
    }

    default:
      return `
    <section class="px-6 py-12 max-w-6xl mx-auto">
      <div class="p-8 rounded-2xl" style="background: ${theme.surface}; border: 1px solid ${theme.line};">
        ${title ? `<h2 class="text-2xl font-bold mb-3" style="color: ${theme.fg};">${escapeHtml(title)}</h2>` : ""}
        ${subtitle ? `<p class="text-sm uppercase tracking-wider mb-4" style="color: ${theme.accent};">${escapeHtml(subtitle)}</p>` : ""}
        ${body ? `<p class="text-base leading-relaxed" style="color: ${theme.muted};">${escapeHtml(body)}</p>` : ""}
      </div>
    </section>`;
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
