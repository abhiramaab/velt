export type Theme = {
  bg: string;
  fg: string;
  muted: string;
  line: string;
  accent: string;
  accentFg: string;
  surface: string;
  fontDisplay: "serif" | "sans" | string;
  radius: string;
  mood?: string;
  heroVisual?: string;
};

export type Nav = {
  logo: string;
  links: string[];
  cta: string;
};

export type Section = {
  kind: string;
  [key: string]: unknown;
};

export type DesignDoc = {
  format: string;
  name: string;
  tagline?: string;
  prompt?: string;
  theme: Theme;
  nav?: Nav;
  sections: Section[];
};

export const FORMATS = [
  { id: "website", label: "Web Design", group: "Web", blurb: "A full site with hero, sections, and a close." },
  { id: "landing", label: "Landing Page", group: "Web", blurb: "One offer, one page, composed to convert." },
  { id: "ecommerce", label: "Shop", group: "Web", blurb: "A storefront with a point of view." },
  { id: "app", label: "App Design", group: "Product", blurb: "Mobile screens you can click through before you build." },
  { id: "dashboard", label: "Dashboard", group: "Product", blurb: "An admin that already knows where the numbers go." },
  { id: "facebook", label: "Facebook Ad", group: "Marketing", blurb: "A feed ad with headline, visual, and a real CTA." },
  { id: "instagram", label: "Instagram Post", group: "Marketing", blurb: "A square built to stop the thumb." },
  { id: "story", label: "Story", group: "Marketing", blurb: "Full-bleed 9:16 with a sticker CTA." },
  { id: "youtube", label: "YouTube Thumbnail", group: "Marketing", blurb: "High-contrast 16:9 made to earn the click." },
  { id: "banner", label: "Display Banner", group: "Marketing", blurb: "A wide ad for web, IAB, and headers." },
  { id: "email", label: "Email", group: "Marketing", blurb: "A campaign letter with a hero and one ask." },
  { id: "pitch", label: "Pitch Deck", group: "Marketing", blurb: "A slide that holds a story, not a wall of type." },
  { id: "poster", label: "Poster", group: "Brand", blurb: "Print-ready type and geometry from a single line." },
  { id: "brand", label: "Brand Kit", group: "Brand", blurb: "Name, mark, palette, and a voice to start from." },
] as const;

export const SAMPLE_PROMPTS = [
  "A quiet ceramic studio in Kyoto. Wabi-sabi, paper, warm clay.",
  "SaaS landing page for a writing app used by novelists. Literary, no neon.",
  "Neighborhood bakery mobile app. Playful but not childish.",
  "Facebook ad for a limited restock of wool coats. Warm, not shouty.",
  "Instagram post for a Saturday pastry drop. Butter, type, no clipart.",
  "YouTube thumbnail for a 12-minute studio tour. Bold type, one face of the kiln.",
];
