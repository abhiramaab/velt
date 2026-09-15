import type { DesignDoc } from "./design";

const linen = {
  bg: "#F3EEE4",
  fg: "#171411",
  muted: "#7A7268",
  line: "#D8D0C4",
  accent: "#C24E1D",
  accentFg: "#FFF7F0",
  surface: "#FFFBF5",
  fontDisplay: "serif",
  radius: "16px",
  mood: "atelier",
  heroVisual: "editorial",
};

export const SAMPLES: DesignDoc[] = [
  {
    format: "website",
    name: "Kama",
    tagline: "Clay, fire, and the pause between.",
    theme: { ...linen, accent: "#9C4A2B", heroVisual: "editorial" },
    nav: { logo: "Kama", links: ["Kiln", "Forms", "Visit"], cta: "Order" },
    sections: [
      { kind: "hero", kicker: "Kyoto · by appointment", headline: "Clay, fire, and the pause between.", sub: "A ceramic studio for bowls you keep using. Quiet glazes, uneven rims, paper-wrapped shipping.", cta: "See the kiln", secondary: "Visit", visual: "editorial" },
      { kind: "stats", items: [{ value: "40", label: "Firing days" }, { value: "12", label: "Glazes" }, { value: "1", label: "Studio" }, { value: "∞", label: "Tea" }] },
      { kind: "features", title: "Made slowly, on purpose", items: [{ title: "Wheel", body: "Every bowl is thrown by hand in a room that faces the garden." }, { title: "Fire", body: "Wood kiln, three times a season. Nothing rushed through gas." }, { title: "Use", body: "Designed for daily rice, not a shelf." }] },
    ],
  },
  {
    format: "landing",
    name: "Quill",
    tagline: "A writing room that doesn't look like software.",
    theme: { bg: "#F7F7F5", fg: "#141414", muted: "#6B6B6B", line: "#E6E6E1", accent: "#1F4BFF", accentFg: "#FFFFFF", surface: "#FFFFFF", fontDisplay: "sans", radius: "16px", heroVisual: "product" },
    nav: { logo: "Quill", links: ["Product", "Writers", "Pricing"], cta: "Start" },
    sections: [
      { kind: "hero", kicker: "For novelists", headline: "Software that stays out of the way.", sub: "A writing app with chapter maps, versioned drafts, and a page that looks like paper.", cta: "Start a manuscript", secondary: "See a chapter", visual: "product" },
      { kind: "stats", items: [{ value: "48k", label: "Chapters" }, { value: "2.1m", label: "Words kept" }, { value: "14", label: "Day streak" }, { value: "0", label: "Ads" }] },
    ],
  },
  {
    format: "app",
    name: "Loaf",
    tagline: "Morning bread, without a line.",
    theme: { bg: "#F6EFE4", fg: "#241C16", muted: "#7A6554", line: "#E4D4C2", accent: "#C4451C", accentFg: "#FFF8F0", surface: "#FFF9F1", fontDisplay: "serif", radius: "18px", heroVisual: "product" },
    sections: [
      { kind: "appbar", title: "Loaf", subtitle: "Good morning" },
      { kind: "hero", kicker: "Warm now", headline: "Sesame country loaf.", sub: "Pulled at 7:10. Two left.", cta: "Reserve", secondary: "Menu", visual: "product" },
      { kind: "actions", items: [{ label: "Order" }, { label: "Stamps" }, { label: "Hours" }, { label: "Walk" }] },
      { kind: "list", title: "Today", items: [{ title: "Butter croissant", meta: "12 left" }, { title: "Olive focaccia", meta: "Warm" }, { title: "Rye slice", meta: "By the loaf" }] },
      { kind: "tabbar", items: ["Home", "Order", "Card", "You"] },
    ],
  },
  {
    format: "poster",
    name: "Oslo Hall",
    tagline: "Architecture after winter.",
    theme: { bg: "#F6F4F0", fg: "#111111", muted: "#5C5C5C", line: "#111111", accent: "#C1121F", accentFg: "#FFFFFF", surface: "#FFFFFF", fontDisplay: "sans", radius: "0px", heroVisual: "grid" },
    sections: [
      { kind: "poster", kicker: "Lecture 04", title: "After winter", subtitle: "A talk on rooms that hold the cold without becoming it.", meta: "Thu 19:00", place: "Oslo" },
    ],
  },
  {
    format: "website",
    name: "Salt",
    tagline: "A hotel that keeps the windows open.",
    theme: { bg: "#EEF3F2", fg: "#17333A", muted: "#5E7A80", line: "#D5E1E0", accent: "#2A6F73", accentFg: "#F4FFFE", surface: "#FFFFFF", fontDisplay: "serif", radius: "22px", heroVisual: "gradient" },
    nav: { logo: "Salt", links: ["Rooms", "Table", "Harbor"], cta: "Stay" },
    sections: [
      { kind: "hero", kicker: "Lisbon coast", headline: "Stay somewhere that remembers you.", sub: "Tiled floors, long lunches, a desk that faces the water.", cta: "See rooms", secondary: "The table", visual: "gradient" },
      { kind: "features", title: "Salt air, tiled floors", items: [{ title: "Rooms", body: "Eleven, all with shutters that actually work." }, { title: "Table", body: "Lunch until it's dark. Fish from the morning boat." }, { title: "Harbor", body: "A five minute walk, if you don't stop for coffee." }] },
    ],
  },
  {
    format: "dashboard",
    name: "House",
    tagline: "The atelier, in numbers.",
    theme: { bg: "#F4F1EC", fg: "#1B1A17", muted: "#6E6A62", line: "#E2DCD3", accent: "#8A6A3A", accentFg: "#F4F1EC", surface: "#FFFdf8", fontDisplay: "sans", radius: "8px", heroVisual: "product" },
    sections: [
      { kind: "dashnav", brand: "House", links: ["Overview", "Atelier", "People", "Ledger"] },
      { kind: "kpis", items: [{ label: "Revenue", value: "$48.2k", delta: "+12%" }, { label: "Orders", value: "284", delta: "+4%" }, { label: "NPS", value: "72", delta: "+6" }, { label: "Returns", value: "1.1%", delta: "-0.3" }] },
      { kind: "chart", title: "The last thirty days", caption: "A quiet climb. No spikes." },
    ],
  },
  {
    format: "website",
    name: "Halo",
    tagline: "Slow care. Visible calm.",
    theme: { bg: "#F8F1EA", fg: "#3A2A28", muted: "#8A7068", line: "#E8D8CE", accent: "#C46B5A", accentFg: "#FFF7F2", surface: "#FFF9F5", fontDisplay: "serif", radius: "28px", heroVisual: "gradient" },
    nav: { logo: "Halo", links: ["Rituals", "Oils", "Rooms"], cta: "Book" },
    sections: [
      { kind: "hero", kicker: "Skin studio", headline: "Slow care. Visible calm.", sub: "Facials and oils for people who already drink enough water.", cta: "Book a room", secondary: "The oils", visual: "gradient" },
      { kind: "stats", items: [{ value: "90m", label: "A sitting" }, { value: "11", label: "Oils" }, { value: "3", label: "Rooms" }, { value: "0", label: "Hard sell" }] },
    ],
  },
  {
    format: "poster",
    name: "Night Set",
    tagline: "Brass, late, no photos.",
    theme: { bg: "#12110F", fg: "#F4EFE6", muted: "#B3A99A", line: "#2A2723", accent: "#D8A15A", accentFg: "#12110F", surface: "#1C1A17", fontDisplay: "serif", radius: "10px", heroVisual: "editorial" },
    sections: [
      { kind: "poster", kicker: "Live", title: "Night set", subtitle: "A small room. A long brass line. No photographs.", meta: "Doors at 9", place: "The hall" },
    ],
  },
  {
    format: "ecommerce",
    name: "Field",
    tagline: "Wool, linen, and the good buttons.",
    theme: { ...linen, accent: "#2F5D4A", accentFg: "#F3F1E7", heroVisual: "editorial" },
    nav: { logo: "Field", links: ["Wool", "Linen", "Mending"], cta: "Shop" },
    sections: [
      { kind: "hero", kicker: "AW26", headline: "Clothes that keep their voice.", sub: "Knitwear and linen from a mill that still names its sheep.", cta: "Shop the bench", secondary: "Mending", visual: "editorial" },
      { kind: "gallery", title: "From the mill this week", items: ["Wool", "Linen", "Horn", "Mend"] },
    ],
  },
  {
    format: "brand",
    name: "Vellum",
    tagline: "Paper with a memory.",
    theme: { ...linen },
    sections: [
      { kind: "brandmark", name: "Vellum", tagline: "Paper with a memory.", mark: "V" },
      { kind: "palette", title: "Color that belongs to Vellum", swatches: ["#F3EEE4", "#171411", "#C24E1D", "#FFFBF5", "#7A7268"] },
      { kind: "type", title: "The voice on the page", display: "serif", sample: "A quieter kind of beautiful." },
    ],
  },
  {
    format: "social",
    name: "Drift",
    tagline: "Open water. Closed laptop.",
    theme: { bg: "#EEF3F2", fg: "#17333A", muted: "#5E7A80", line: "#D5E1E0", accent: "#2A6F73", accentFg: "#F4FFFE", surface: "#FFFFFF", fontDisplay: "serif", radius: "22px" },
    sections: [
      { kind: "social", kicker: "DRIFT", title: "Leave the tab open somewhere else.", subtitle: "Week-long swims off a quiet coast.", cta: "Book a berth" },
    ],
  },
  {
    format: "website",
    name: "Nori",
    tagline: "A table, a season, a long lunch.",
    theme: { bg: "#F6EFE4", fg: "#241C16", muted: "#7A6554", line: "#E4D4C2", accent: "#C4451C", accentFg: "#FFF8F0", surface: "#FFF9F1", fontDisplay: "serif", radius: "12px", heroVisual: "product" },
    nav: { logo: "Nori", links: ["Menu", "Wine", "Night"], cta: "Reserve" },
    sections: [
      { kind: "hero", kicker: "Counter seating", headline: "A table, a season, a long lunch.", sub: "Twelve seats. Fish from the morning market. A wine list that fits on one page.", cta: "Reserve", secondary: "Tonight's fish", visual: "product" },
    ],
  },
];
