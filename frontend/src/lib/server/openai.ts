import type { DesignDoc } from "../design";
import { SAMPLES } from "../samples";
import { triageDesignPrompt } from "./typesafe";

export function getApiKey(): string {
  return (process.env.OPENAI_API_KEY || "").trim();
}

const SYSTEM_PROMPT = `
You are Velt's design director — the same caliber of output as shipper.now, v0, and Linear's marketing sites.
You translate user prompts into original, production-grade UI prototypes and layouts represented as clean JSON.
Never copy a known trademarked brand. Invent a fitting, poetic brand name if not specified.

QUALITY BAR (non-negotiable):
- Every result must look like a real, shipped product designed by a senior product designer — not a wireframe, not a moodboard, not lorem-ipsum filler.
- Write specific, human, domain-accurate copy. Real product names, real feature names, real prices, real metrics, real place names. NEVER "Feature One", "Lorem ipsum", "Your headline here", "Company", or generic placeholder text.
- Commit to ONE coherent art direction: a deliberate palette (background, ink, one restrained accent), a consistent type voice (serif for editorial/luxury/food; sans for SaaS/product/tech), and a consistent corner radius and spacing rhythm. Everything must feel like one brand system.
- High contrast and legible hierarchy. Headlines are short and confident (3–7 words). Body copy is one or two tight sentences. No walls of text.
- Use real domain vocabulary: a fintech dashboard talks in bps, APR, settlement; a bakery app talks in sourdough, proofing, the morning pull; an architecture studio talks in materials, light, mass.
- NO hardcoded or stock imagery. Never output image URLs. Visual interest comes from layout, type, color, geometry, and data — the renderer draws everything from the structure you provide.
- Vary structure between prompts. Two prompts should never produce the same section skeleton, the same hero, or the same palette. Adapt the archetype to the domain.

Return ONLY a valid JSON object matching this schema:
{
  "format": "website|landing|app|dashboard|poster|social|brand|ecommerce",
  "name": "Brand Name",
  "tagline": "Short evocative sentence",
  "theme": {
    "bg": "#hex (page background, e.g. #FAF7F2, #101216, #F5F3EF)",
    "fg": "#hex (primary text, high contrast with bg)",
    "muted": "#hex (secondary text)",
    "line": "#hex (border lines)",
    "accent": "#hex (punchy brand highlight color)",
    "accentFg": "#hex (text on accent)",
    "surface": "#hex (card/container surface)",
    "fontDisplay": "serif|sans",
    "radius": "0px|8px|16px|24px",
    "mood": "warm|minimal|editorial|noir|citrus|coastal|swiss|cyber",
    "heroVisual": "ui-mockup|device-mockup|architecture|swiss|waveform|audio-card|product|gradient|grid|bento"
  },
  "nav": {
    "logo": "Brand Name",
    "links": ["About", "Features", "Pricing", "Contact"],
    "cta": "Primary Action"
  },
  "sections": [
    // Include 4 to 6 relevant, varied sections matching the requested format:
    // For WEBSITE / LANDING (CHOOSE DIVERSE LAYOUT ARCHETYPES! DO NOT DEFAULT TO THE SAME TEMPLATE!):
    // Archetype A: Developer / Agentic / Cloud Tech (like shipper.now, Modal, Vercel, Linear):
    // - {"kind": "terminal_hero", "kicker": "v2.4 Production Ready", "headline": "...", "sub": "...", "cta": "Deploy in 60s", "secondary": "Read Docs", "command": "npx shipper deploy --prod", "logs": ["✓ Provisioned isolated micro-VM", "✓ Edge routing active across 38 regions"]}
    // - {"kind": "tech_bento", "title": "...", "cards": [{"title": "Sub-millisecond Global Mesh", "subtitle": "...", "tag": "Network", "highlight": "< 1ms"}, {"title": "State Persistence", "subtitle": "...", "tag": "Storage", "highlight": "Zero Drift"}]}
    // - {"kind": "architecture_flow", "kicker": "Pipeline", "title": "Autonomous Execution Stream", "steps": [{"title": "Event Ingest", "desc": "...", "metric": "4ms"}, {"title": "Agent Sandbox", "desc": "...", "metric": "99.99%"}, {"title": "Mesh Distribution", "desc": "...", "metric": "Global"}]}
    // Archetype B: Editorial / Luxury / Studio / Fashion:
    // - {"kind": "hero", "layout": "editorial-cover", "kicker": "...", "headline": "...", "sub": "...", "cta": "...", "secondary": "...", "visual": "editorial"}
    // - {"kind": "stats", "items": [{"value": "...", "label": "..."}]}
    // - {"kind": "gallery", "title": "...", "subtitle": "...", "layout": "grid-2|grid-3", "items": [{"title": "...", "tag": "...", "meta": "2026", "caption": "..."}]}
    // Archetype C: Conversion / SaaS / Product:
    // - {"kind": "hero", "layout": "split|centered", "kicker": "...", "headline": "...", "sub": "...", "cta": "...", "visual": "bento|gradient|grid|product"}
    // - {"kind": "features", "layout": "cards|minimal-cols", "title": "...", "items": [{"title": "...", "body": "..."}]}
    // - {"kind": "pricing", "title": "...", "plans": [{"name": "...", "price": "...", "period": "/mo", "features": ["..."]}]}
    // - {"kind": "testimonials", "title": "...", "items": [{"quote": "...", "name": "...", "role": "..."}]}
    // - {"kind": "cta", "headline": "...", "body": "...", "cta": "..."}
    // - {"kind": "footer", "copy": "...", "links": ["Docs", "GitHub", "Twitter", "Security"]}

    // For POSTER / FLYER:
    // - {"kind": "poster", "layout": "swiss|brutalist|techno|minimal", "kicker": "...", "title": "...", "subtitle": "...", "meta": "...", "place": "...", "lineup": ["Artist A", "Artist B", "Artist C"]}

    // For APP:
    // - {"kind": "appbar", "title": "...", "subtitle": "..."}
    // - {"kind": "actions", "items": [{"label": "...", "hint": "..."}]}
    // - {"kind": "list", "title": "...", "items": [{"title": "...", "sub": "...", "meta": "..."}]}
    // - {"kind": "tabbar", "active": 0, "tabs": ["Home", "Activity", "Profile"]}

    // For DASHBOARD:
    // - Common Nav: {"kind": "dashnav", "brand": "...", "links": ["Trade", "Markets", "Portfolio"] or ["Orders", "Inventory", "Analytics"]}
    // - For TRADING / CRYPTO / FINTECH:
    //   * {"kind": "trading_terminal", "pair": "BTC/USDT", "price": "$67,420.50", "change": "+4.85%", "high": "$68,120.00", "low": "$64,890.00", "volume": "1.42B", "candles": [{"open": 64, "close": 68, "high": 70, "low": 63}, ...]}
    //   * {"kind": "order_book", "asks": [{"price": "67,480.00", "amount": "1.42", "total": "95.8k"}], "bids": [{"price": "67,410.00", "amount": "1.12", "total": "75.4k"}]}
    //   * {"kind": "kpis", "items": [{"label": "24H VOLUME", "value": "$1.42B", "delta": "+12.4%"}, {"label": "OPEN INTEREST", "value": "$420.8M", "delta": "+5.2%"}]}
    // - For E-COMMERCE / STORE ADMIN:
    //   * {"kind": "bento_analytics", "cards": [{"title": "Net Revenue", "metric": "$84,200", "detail": "+24% vs last week", "tag": "Sales"}, {"title": "Conversion Rate", "metric": "3.8%", "detail": "Top tier traffic", "tag": "Funnel"}]}
    //   * {"kind": "products_grid", "title": "Top Selling Products", "items": [{"name": "Product Name", "category": "Category", "sales": "1,420", "revenue": "$85,200", "stock": "In Stock (84)", "trend": "+24%"}]}
    //   * {"kind": "table", "title": "Recent Customer Orders", "headers": ["Order ID", "Customer", "Items", "Total", "Status"], "rows": [["#1094", "Elena Vance", "2x Wool Coat", "$340", "Paid"]]}
    // - For B2B SAAS / TELEMETRY:
    //   * {"kind": "bento_analytics", "cards": [{"title": "MRR", "metric": "$48.2k", "detail": "+14% MoM", "tag": "Revenue"}, {"title": "P99 Latency", "metric": "14ms", "detail": "Edge optimal", "tag": "Infra"}]}
    //   * {"kind": "chart", "title": "Traffic & Ingestion Velocity", "caption": "Live event stream across 4 global regions", "series": [32, 45, 58, 62, 75, 89, 94, 110, 105, 128]}
    //   * {"kind": "table", "title": "Audit Log & Access Events", "headers": ["Actor", "Resource", "IP Address", "Status"], "rows": [["api-gateway", "/v1/auth", "10.0.4.12", "Success"]]}

    // For BRAND KIT:
    // - {"kind": "brandmark", "mark": "Single letter or geometric glyph", "name": "..."}
    // - {"kind": "palette", "colors": [{"name": "Paper", "hex": "#..."}, {"name": "Ink", "hex": "#..."}, {"name": "Accent", "hex": "#..."}]}
    // - {"kind": "type", "display": "Fraunces Serif", "body": "Figtree Sans"}
  ]
}
- STRICT THEME MANDATE: LIGHT THEME ONLY!
  * Every generated design MUST be in a crisp, ultra-clean LIGHT THEME (#FFFFFF, #FAFAFA, #F8F9FA, #F6F4F0, or #F0F0F0 page background).
  * Absolutely NO dark theme backgrounds (#000000, #0a0a0a, #111111).
  * Typography must be deep, sharp ink (#0F172A, #111827, #171411, or #18181B) with refined muted subtexts (#64748B, #6B7280) and subtle hairline borders (#E2E8F0, #E5E7EB, #E2DDD6).
  * High-end tech pages (like shipper.now, linear.app, stripe) achieve their punch through crisp glass cards, vibrant electric pill badges, and interactive gradient accents ON CRISP WHITE/LIGHT CANVASES.
- FOR DEVELOPER/AI/CLOUD/INFRASTRUCTURE PROMPTS:
  * MUST USE terminal_hero, tech_bento, and architecture_flow with light canvas and dark terminal preview/cards!
  * DO NOT use the generic 'ui-mockup' browser frame or 'gallery' cards for developer infrastructure!
- FOR EDITORIAL/FASHION/CERAMICS:
  * Lead with editorial-cover hero and gallery monographs.
- FOR APPS:
  * Use mobile headers, interactive action chips, and bottom tab bar.

FINAL QUALITY CHECK before returning (verify every point):
1. Every string is real, specific, domain-correct copy. Zero lorem ipsum, zero "Feature One", zero "Company".
2. One coherent palette and type voice across the whole document. Accent is restrained.
3. Headlines are 3–7 confident words. Body copy is 1–2 tight sentences.
4. No "image" fields and no external URLs anywhere.
5. The section skeleton and hero are unique to this prompt — not the same as the last output.
6. The result would look credible as a real shipped product at shipper.now / v0 quality.
`;

export async function generateWithOpenAI(prompt: string, format: string, imageUrl?: string, referenceUrl?: string): Promise<DesignDoc> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing OpenAI API Key");
  }

  // If a reference URL is provided, fetch its title, meta, and key text
  let siteContext = "";
  if (referenceUrl && referenceUrl.trim()) {
    try {
      let targetUrl = referenceUrl.trim();
      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        targetUrl = "https://" + targetUrl;
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const siteRes = await fetch(targetUrl, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; VeltDesignBot/1.0)" },
      });
      clearTimeout(timeout);
      if (siteRes.ok) {
        const html = await siteRes.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        const title = titleMatch ? titleMatch[1].trim() : "";
        const desc = metaDescMatch ? metaDescMatch[1].trim() : "";
        // Extract top headings
        const h1s = Array.from(html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)).map((m) => m[1].trim()).slice(0, 3);
        const h2s = Array.from(html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)).map((m) => m[1].trim()).slice(0, 4);

        siteContext = `\n[LIVE REFERENCE SITE ANALYZED: ${targetUrl}]
- Page Title: ${title}
- Meta Description: ${desc}
- Primary Headings: ${[...h1s, ...h2s].join(" | ")}
- Design Archetype Note: If the reference is shipper.now / Linear / modern developer tech, generate a pitch-dark, high-velocity developer platform with bold headline, bento cards, monospace micro-badges, and extreme polish.
- Strictly mirror the sophistication, aesthetic genre, section types, and tone of ${targetUrl} while keeping the brand name original.\n`;
      }
    } catch (e) {
      console.warn("Could not fetch reference URL directly, using URL string hint:", e);
      siteContext = `\n[REFERENCE SITE HINT: ${referenceUrl}]
- Strictly design a website whose visual caliber, typography, layout rhythm, and aesthetic match ${referenceUrl} (e.g. if shipper.now, create a cutting-edge dark agentic/developer deployment platform).\n`;
    }
  }

  // Fast triage via TypeSafe AI
  const triage = await triageDesignPrompt(prompt);
  let userInstruction = `Format: ${format}\nPrompt: ${prompt}\n`;
  if (triage) {
    userInstruction += `\n[System One Triage Directives]:
- Target Canvas: ${triage.targetDevice || "desktop"}
- Theme Mode: ${triage.themeMode || "automatic"}
- Visual Aesthetic: ${triage.uiStyle || "balanced"}
- Domain Context: ${triage.domainContext || "custom"}
- Layout Archetype: ${triage.layoutArchetype || "custom"}
- Hero Composition: ${triage.heroComposition || "editorial-cover"}
Respect these triage directives strictly in the theme colors, typography, hero layout, and section choices! Never output generic filler.\n`;
  }

  if (siteContext) {
    userInstruction += siteContext;
  }

  if (imageUrl) {
    userInstruction += `\n[REFERENCE IMAGE ATTACHED - STRICT DISCOVERY & FAITHFULNESS]:
1. DISCOVER THE TRUE MEDIUM:
   - Carefully examine what the image actually is.
   - If it is dark tech infrastructure, AI software, developer tooling, or terminal -> KEEP IT PITCH DARK (#000000 or deep carbon/noir), sleek, with neon/white typography, geometric/minimalist aesthetics, high-contrast buttons, and tech/infrastructure vocabulary!
   - If it is an ad poster, event flyer, graphic print, or promo -> format MUST be "poster" or "social". DO NOT make an ecommerce or irrelevant site if the image is tech infrastructure or a poster!
   - Never turn a dark AI/cloud/developer tool into a light ecommerce clothing store like "LuxeCart".
2. EXTRACT THE EXACT VISUAL DNA:
   - Background: match the reference image background exactly (e.g. if the image is black/dark, theme.bg MUST be black/dark like #000000 or #0a0a0a).
   - Accents and text: match the reference lighting, typography style, and button styling.
   - Hero and composition: mimic the visual weight, layout arrangement, and focal point seen in the reference image.
`;
  }

  userInstruction += `Compose a stunning, structurally unique design document JSON.`;

  let userContent: any = userInstruction;
  if (imageUrl) {
    userContent = [
      { type: "text", text: userInstruction },
      { type: "image_url", image_url: { url: imageUrl.trim() } },
    ];
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: userContent,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenAI API error:", res.status, errText);
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI engine");

    const cleaned = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: DesignDoc;
    try {
      parsed = JSON.parse(cleaned) as DesignDoc;
    } catch {
      throw new Error("AI returned malformed JSON structure.");
    }

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error("Invalid design document generated by AI");
    }

    parsed.format = format;
    parsed.prompt = prompt;
    return parsed;
  } catch (err: any) {
    console.error("OpenAI generation failure, using fallback design:", err);
    // If OpenAI fails or times out, provide a clean fallback design doc rather than crashing the user UI
    const fb = fallbackDesign(prompt, format);
    return fb;
  }
}

export async function refineWithOpenAI(currentDoc: DesignDoc, message: string): Promise<DesignDoc> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing OpenAI API Key");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}
You are an expert AI design director. You are revising or completely reimagining a design document based on user feedback.
IMPORTANT RULES FOR REFINEMENT:
- If the user asks for a "different design", "change design", "redesign", or specifies a new theme/vibe/layout, DO NOT just return the same sections or layout. Radically change the palette, typography, visual hierarchy, section arrangements, and components!
- For Dashboards: Support diverse dashboard architectures (e.g. dark telemetry with live sparklines, light minimalist analytics, sidebar nav vs top nav, activity feeds, modular bento cards, status badges).
- Always return a complete, valid DesignDoc JSON adhering strictly to the schema.`,
        },
        {
          role: "user",
          content: `Current Design:\n${JSON.stringify(currentDoc)}\n\nUser Revision Request:\n${message}\n\nDeliver the revised DesignDoc JSON.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenAI refine error:", res.status, errText);
    throw new Error(`OpenAI refine error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI engine");

  const parsed = JSON.parse(content) as DesignDoc;
  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid refined design document generated by AI");
  }

  return parsed;
}

function fallbackDesign(prompt: string, format: string): DesignDoc {
  // Find closest sample or adapt SAMPLES[0]
  const sample = SAMPLES.find((s) => s.format === format) || SAMPLES[0];
  const name = prompt.split(" ")[0].replace(/[^a-zA-Z]/g, "") || sample.name;
  return {
    ...sample,
    format,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    prompt,
    tagline: prompt,
  };
}
