import type { DesignDoc } from "../design";
import { SAMPLES } from "../samples";

const DEFAULT_KEY =
  "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";

export function getApiKey(): string {
  return (process.env.OPENAI_API_KEY || DEFAULT_KEY).trim();
}

const SYSTEM_PROMPT = `
You are Velt's design director (like Figma's "Make Designs" AI).
You translate user prompts into original, tasteful UI prototypes and layouts represented as clean JSON.
Never copy a known trademarked brand. Invent a fitting, poetic brand name if not specified.

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
    "mood": "warm|minimal|editorial|noir|citrus|coastal|swiss",
    "heroVisual": "editorial|product|gradient|grid"
  },
  "nav": {
    "logo": "Brand Name",
    "links": ["About", "Work", "Pricing", "Contact"],
    "cta": "Primary Action"
  },
  "sections": [
    // Include 4 to 6 relevant sections matching the requested format:
    // For WEBSITE / LANDING / PORTFOLIO:
    // - {"kind": "hero", "kicker": "...", "headline": "...", "sub": "...", "cta": "...", "secondary": "...", "visual": "editorial|product|gradient|grid"}
    // - {"kind": "features", "title": "...", "items": [{"title": "...", "body": "..."}]}
    // - {"kind": "gallery", "title": "Selected Works", "items": [{"caption": "...", "tag": "..."}]}
    // - {"kind": "testimonials", "title": "...", "items": [{"quote": "...", "name": "...", "role": "..."}]}
    // - {"kind": "pricing", "title": "...", "plans": [{"name": "Starter", "price": "$19", "period": "/mo", "features": ["..."]}]}
    // - {"kind": "cta", "headline": "...", "body": "...", "cta": "..."}
    // - {"kind": "footer", "copy": "...", "links": ["Privacy", "Terms", "Twitter"]}

    // For POSTER / FLYER:
    // - {"kind": "poster", "kicker": "...", "title": "...", "sub": "...", "meta": "...", "year": "2026", "place": "..."}

    // For APP:
    // - {"kind": "appbar", "title": "...", "subtitle": "..."}
    // - {"kind": "actions", "items": [{"label": "...", "hint": "..."}]}
    // - {"kind": "list", "title": "...", "items": [{"title": "...", "sub": "...", "meta": "..."}]}
    // - {"kind": "tabbar", "active": 0, "tabs": ["Home", "Activity", "Profile"]}

    // For DASHBOARD:
    // - {"kind": "dashnav", "brand": "...", "user": "..."}
    // - {"kind": "kpis", "items": [{"label": "MRR", "value": "$42.8k", "delta": "+14%"}, {"label": "Active Users", "value": "3,420", "delta": "+8%"}]}
    // - {"kind": "chart", "title": "Growth", "series": [12, 19, 15, 27, 34, 45, 52]}
    // - {"kind": "table", "title": "Recent Orders", "headers": ["Customer", "Status", "Amount"], "rows": [["Acme Corp", "Paid", "$1,200"]]}

    // For BRAND KIT:
    // - {"kind": "brandmark", "mark": "Single letter or geometric glyph", "name": "..."}
    // - {"kind": "palette", "colors": [{"name": "Paper", "hex": "#..."}, {"name": "Ink", "hex": "#..."}, {"name": "Accent", "hex": "#..."}]}
    // - {"kind": "type", "display": "Fraunces Serif", "body": "Figtree Sans"}
  ]
}
Always ensure high color contrast, tasteful typography, and specific human copy without filler or emojis.
`;

export async function generateWithOpenAI(prompt: string, format: string): Promise<DesignDoc> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return fallbackDesign(prompt, format);
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Format: ${format}\nPrompt: ${prompt}\nCompose an original, stunning design document JSON.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error:", res.status, await res.text());
      return fallbackDesign(prompt, format);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallbackDesign(prompt, format);

    const parsed = JSON.parse(content) as DesignDoc;
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      return fallbackDesign(prompt, format);
    }

    parsed.format = format;
    parsed.prompt = prompt;
    return parsed;
  } catch (err) {
    console.error("OpenAI generation failed:", err);
    return fallbackDesign(prompt, format);
  }
}

export async function refineWithOpenAI(currentDoc: DesignDoc, message: string): Promise<DesignDoc> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return currentDoc;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `${SYSTEM_PROMPT}\nYou are revising an existing design document. Keep the schema intact. Apply the user's refinement tastefully to the palette, copy, or sections.`,
          },
          {
            role: "user",
            content: `Current Design JSON:\n${JSON.stringify(currentDoc)}\n\nUser request:\n${message}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("OpenAI refine error:", res.status, await res.text());
      return currentDoc;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return currentDoc;

    const parsed = JSON.parse(content) as DesignDoc;
    if (!parsed.sections) return currentDoc;
    return parsed;
  } catch (err) {
    console.error("OpenAI refine failed:", err);
    return currentDoc;
  }
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
