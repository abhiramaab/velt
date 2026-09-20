package com.velt.generate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LayoutService {
    private final ObjectMapper mapper;
    private final XaiClient xai;

    public LayoutService(ObjectMapper mapper, XaiClient xai) {
        this.mapper = mapper;
        this.xai = xai;
    }

    public JsonNode generate(String prompt, String format) {
        return generate(prompt, format, null);
    }

    public JsonNode generate(String prompt, String format, String imageUrl) {
        String fmt = normalizeFormat(format);
        String userMessage;
        if (imageUrl != null && !imageUrl.isBlank()) {
            userMessage = """
                    Reference Image Attached.
                    IMPORTANT DISCOVERY TASK:
                    1. First, examine the attached reference image carefully to discover what medium/type it actually is:
                       - If it is an ad poster, event flyer, graphic print, or promo graphic -> format MUST be "poster" or "social" / "facebook" / "instagram". DO NOT design a website if the reference is a poster or print ad!
                       - If it is a web page, SaaS landing page, or site mockup -> format should be "website" or "landing".
                       - If it is a mobile application screen -> format should be "app".
                       - If it is an admin dashboard or analytics table -> format should be "dashboard".
                       - Only override this discovery if the user's explicit requested format was NOT "website" (e.g. if user specifically picked something else).
                    2. Extract the visual DNA from the reference:
                       - Dominant background, text, muted, surface, and accent hex colors.
                       - Typography feel (serif vs sans, high contrast vs understated).
                       - Spacing, border radius, rhythm, and layout structure.
                    3. Compose an original design document honoring the reference's composition type and palette.

                    Requested/Default Format: %s
                    Prompt: %s
                    Return a complete design document JSON.
                    """.formatted(fmt, prompt);
        } else {
            userMessage = """
                    Format: %s
                    Prompt: %s
                    Return a complete design document JSON.
                    """.formatted(fmt, prompt);
        }

        Optional<JsonNode> llm = xai.completeWithVisionJson(systemPrompt(), userMessage, imageUrl);
        if (llm.isPresent() && llm.get().has("sections")) {
            ObjectNode node = (ObjectNode) llm.get();
            // If the LLM discovered a specific medium like poster or app from the reference image, honor it
            String detectedFormat = node.has("format") && !node.get("format").asText().isBlank()
                    ? normalizeFormat(node.get("format").asText())
                    : fmt;
            node.put("format", detectedFormat);
            if (!node.has("name")) {
                node.put("name", brandName(prompt));
            }
            return node;
        }
        return mapper.valueToTree(heuristic(prompt, fmt));
    }

    @SuppressWarnings("unchecked")
    public JsonNode refine(JsonNode current, String message) {
        Optional<JsonNode> llm = xai.completeJson(
                systemPrompt() + " You are revising an existing design. Keep the same schema. Apply the user's request with taste.",
                "Current design JSON:\n" + current.toString() + "\n\nUser request:\n" + message
        );
        if (llm.isPresent() && llm.get().has("sections")) {
            return llm.get();
        }
        Map<String, Object> doc = mapper.convertValue(current, Map.class);
        applyHeuristicRefine(doc, message);
        return mapper.valueToTree(doc);
    }

    public String describeChange(String message) {
        String m = message.toLowerCase(Locale.ROOT);
        if (m.contains("dark")) return "Shifted the palette into a quieter night register.";
        if (m.contains("light") || m.contains("brighter")) return "Opened the palette and let more paper show through.";
        if (m.contains("testimonial")) return "Added a proof section so the page earns a little more trust.";
        if (m.contains("pricing")) return "Laid in a pricing band under the offer.";
        if (m.contains("swiss") || m.contains("minimal")) return "Tightened the grid. Less decoration, more type.";
        if (m.contains("headline")) return "Rewrote the headline so it sits better in the hero.";
        if (m.contains("green") || m.contains("sage")) return "Moved the accent toward moss and garden.";
        if (m.contains("luxury") || m.contains("gold")) return "Warmed the metals and slowed the type.";
        return "Adjusted layout, type, and color to match what you asked.";
    }

    @SuppressWarnings("unchecked")
    private void applyHeuristicRefine(Map<String, Object> doc, String message) {
        String m = message.toLowerCase(Locale.ROOT);
        Map<String, Object> theme = (Map<String, Object>) doc.getOrDefault("theme", new LinkedHashMap<>());
        List<Map<String, Object>> sections = (List<Map<String, Object>>) doc.getOrDefault("sections", new ArrayList<>());

        if (m.contains("dark") || m.contains("noir")) {
            theme.putAll(themeNamed("noir"));
        } else if (m.contains("swiss") || m.contains("minimal")) {
            theme.putAll(themeNamed("grid"));
        } else if (m.contains("green") || m.contains("sage") || m.contains("garden")) {
            theme.putAll(themeNamed("meadow"));
        } else if (m.contains("luxury") || m.contains("gold") || m.contains("quiet")) {
            theme.putAll(themeNamed("linen"));
        } else if (m.contains("playful") || m.contains("bright") || m.contains("citrus")) {
            theme.putAll(themeNamed("citrus"));
        } else if (m.contains("light") || m.contains("brighter")) {
            theme.putAll(themeNamed("halo"));
        }

        if (m.contains("round")) theme.put("radius", "28px");
        if (m.contains("sharp") || m.contains("square")) theme.put("radius", "2px");
        if (m.contains("serif")) theme.put("fontDisplay", "serif");
        if (m.contains("sans")) theme.put("fontDisplay", "sans");

        if (m.contains("headline") || m.contains("title")) {
            for (Map<String, Object> section : sections) {
                if ("hero".equals(section.get("kind")) || "poster".equals(section.get("kind"))) {
                    String headline = String.valueOf(section.getOrDefault("headline", section.getOrDefault("title", "")));
                    String key = "poster".equals(section.get("kind")) ? "title" : "headline";
                    if (m.contains("shorter") || m.contains("short")) {
                        String[] words = headline.split("\\s+");
                        section.put(key, String.join(" ", Arrays.copyOf(words, Math.min(4, words.length))));
                    } else if (m.contains("longer") || m.contains("poetic")) {
                        section.put(key, headline + ", made slowly.");
                    }
                }
            }
        }

        boolean hasTestimonials = sections.stream().anyMatch(s -> "testimonials".equals(s.get("kind")));
        if ((m.contains("testimonial") || m.contains("review") || m.contains("trust")) && !hasTestimonials) {
            sections.add(Math.max(sections.size() - 2, 1), map(
                    "kind", "testimonials",
                    "title", "People who already made the jump",
                    "items", List.of(
                            map("quote", "It finally looks like the thing we described in the brief.", "name", "Mina Cole", "role", "Founder"),
                            map("quote", "We shipped the landing page the same afternoon.", "name", "Owen Park", "role", "Product"),
                            map("quote", "The type and spacing feel considered, not generated.", "name", "Sasha Iyer", "role", "Design lead")
                    )
            ));
        }

        boolean hasPricing = sections.stream().anyMatch(s -> "pricing".equals(s.get("kind")));
        if (m.contains("pricing") && !hasPricing) {
            sections.add(Math.max(sections.size() - 1, 1), map(
                    "kind", "pricing",
                    "title", "Simple on purpose",
                    "plans", List.of(
                            map("name", "Studio", "price", "$12", "period", "/mo", "features", List.of("40 designs", "Chat refine", "Export PNG")),
                            map("name", "Atelier", "price", "$29", "period", "/mo", "features", List.of("Unlimited drafts", "Priority queue", "Brand kit")),
                            map("name", "House", "price", "$59", "period", "/mo", "features", List.of("Seats for 5", "Shared library", "Private styles"))
                    )
            ));
        }

        doc.put("theme", theme);
        doc.put("sections", sections);
    }

    private Map<String, Object> heuristic(String prompt, String format) {
        String name = brandName(prompt);
        Map<String, Object> theme = pickTheme(prompt);
        String tagline = tagline(prompt, name);
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("format", format);
        doc.put("name", name);
        doc.put("tagline", tagline);
        doc.put("prompt", prompt);
        doc.put("theme", theme);
        doc.put("nav", map(
                "logo", name,
                "links", navLinks(format),
                "cta", ctaLabel(format)
        ));
        doc.put("sections", sectionsFor(format, prompt, name, tagline, theme));
        return doc;
    }

    private List<Map<String, Object>> sectionsFor(String format, String prompt, String name, String tagline, Map<String, Object> theme) {
        return switch (format) {
            case "poster" -> List.of(poster(prompt, name, tagline));
            case "social" -> List.of(social(prompt, name, tagline));
            case "facebook" -> List.of(facebookAd(prompt, name, tagline));
            case "instagram" -> List.of(instagram(prompt, name, tagline));
            case "story" -> List.of(story(prompt, name, tagline));
            case "youtube" -> List.of(youtube(prompt, name, tagline));
            case "banner" -> List.of(banner(prompt, name, tagline));
            case "email" -> email(prompt, name, tagline);
            case "pitch" -> List.of(pitch(prompt, name, tagline));
            case "app" -> app(prompt, name, tagline);
            case "dashboard" -> dashboard(prompt, name);
            case "brand" -> brand(prompt, name, tagline, theme);
            default -> website(prompt, name, tagline, format);
        };
    }

    private List<Map<String, Object>> website(String prompt, String name, String tagline, String format) {
        String headline = headline(prompt, name);
        String sub = subhead(prompt);
        List<Map<String, Object>> sections = new ArrayList<>();
        sections.add(map(
                "kind", "hero",
                "kicker", kicker(prompt, format),
                "headline", headline,
                "sub", sub,
                "cta", ctaLabel(format),
                "secondary", "See the work",
                "visual", visualFor(prompt)
        ));
        sections.add(map(
                "kind", "stats",
                "items", List.of(
                        map("value", "12k", "label", "Pieces shipped"),
                        map("value", "4.9", "label", "Quiet rating"),
                        map("value", "38", "label", "Cities"),
                        map("value", "2s", "label", "From prompt")
                )
        ));
        sections.add(map(
                "kind", "features",
                "title", "Built the way a studio would build it",
                "items", features(prompt, format)
        ));
        if ("ecommerce".equals(format) || containsAny(prompt, "shop", "store", "product", "buy")) {
            sections.add(map(
                    "kind", "gallery",
                    "title", "From the bench this week",
                    "items", List.of("One", "Two", "Three", "Four")
            ));
        }
        sections.add(map(
                "kind", "testimonials",
                "title", "Kept by people with taste",
                "items", List.of(
                        map("quote", "Looks like we hired a studio. We didn't.", "name", "Elena Voss", "role", "Brand"),
                        map("quote", "The first draft was already on-strategy.", "name", "Jules Hart", "role", "Founder"),
                        map("quote", "We used it as the real site, not a mock.", "name", "Priya Shah", "role", "Marketing")
                )
        ));
        if ("landing".equals(format) || containsAny(prompt, "price", "plan", "saas", "subscribe")) {
            sections.add(map(
                    "kind", "pricing",
                    "title", "Start wherever you are",
                    "plans", List.of(
                            map("name", "Guest", "price", "$0", "period", "", "features", List.of("3 drafts", "Watermark-free", "Chat refine")),
                            map("name", "Studio", "price", "$19", "period", "/mo", "features", List.of("120 drafts", "Brand kit", "Priority")),
                            map("name", "House", "price", "$49", "period", "/mo", "features", List.of("Unlimited", "Seats", "Private styles"))
                    )
            ));
        }
        sections.add(map(
                "kind", "cta",
                "headline", "Make the next one even quieter.",
                "sub", "Describe the feeling. Velt will find the layout.",
                "cta", "Start a draft"
        ));
        sections.add(map(
                "kind", "footer",
                "brand", name,
                "note", tagline,
                "links", List.of("Work", "Studio", "Notes", "Contact")
        ));
        return sections;
    }

    private Map<String, Object> poster(String prompt, String name, String tagline) {
        return map(
                "kind", "poster",
                "kicker", kicker(prompt, "poster"),
                "title", posterTitle(prompt, name),
                "subtitle", tagline,
                "meta", posterMeta(prompt),
                "place", placeFrom(prompt),
                "visual", visualFor(prompt)
        );
    }

    private Map<String, Object> social(String prompt, String name, String tagline) {
        return map(
                "kind", "social",
                "kicker", name.toUpperCase(Locale.ROOT),
                "title", posterTitle(prompt, name),
                "subtitle", tagline,
                "cta", "See the drop"
        );
    }

    private Map<String, Object> facebookAd(String prompt, String name, String tagline) {
        return map(
                "kind", "facebook",
                "page", name,
                "sponsored", "Sponsored",
                "primary", tagline,
                "headline", headline(prompt, name),
                "description", "Limited run. Ships this week.",
                "cta", "Shop now",
                "url", name.toLowerCase(Locale.ROOT).replace(" ", "") + ".com"
        );
    }

    private Map<String, Object> instagram(String prompt, String name, String tagline) {
        return map(
                "kind", "instagram",
                "handle", name,
                "title", posterTitle(prompt, name),
                "caption", tagline,
                "likes", "2,418",
                "cta", "Shop"
        );
    }

    private Map<String, Object> story(String prompt, String name, String tagline) {
        return map(
                "kind", "story",
                "handle", name,
                "title", shortHeadline(prompt, name),
                "subtitle", tagline,
                "cta", "Swipe up"
        );
    }

    private Map<String, Object> youtube(String prompt, String name, String tagline) {
        return map(
                "kind", "youtube",
                "kicker", name.toUpperCase(Locale.ROOT),
                "title", posterTitle(prompt, name),
                "subtitle", "WATCH",
                "duration", "12:04"
        );
    }

    private Map<String, Object> banner(String prompt, String name, String tagline) {
        return map(
                "kind", "banner",
                "brand", name,
                "headline", shortHeadline(prompt, name),
                "sub", tagline,
                "cta", "Shop the drop"
        );
    }

    private List<Map<String, Object>> email(String prompt, String name, String tagline) {
        return List.of(
                map("kind", "email",
                        "brand", name,
                        "preheader", tagline,
                        "headline", headline(prompt, name),
                        "body", subhead(prompt),
                        "cta", "Open the studio")
        );
    }

    private Map<String, Object> pitch(String prompt, String name, String tagline) {
        return map(
                "kind", "pitch",
                "kicker", name,
                "title", headline(prompt, name),
                "subtitle", tagline,
                "points", List.of("The offer, said once.", "Proof that it already works.", "The ask, without a paragraph.")
        );
    }

    private List<Map<String, Object>> app(String prompt, String name, String tagline) {
        return List.of(
                map("kind", "appbar", "title", name, "subtitle", "Today"),
                map(
                        "kind", "hero",
                        "kicker", "Good evening",
                        "headline", shortHeadline(prompt, name),
                        "sub", tagline,
                        "cta", "Continue",
                        "secondary", "Browse",
                        "visual", "product"
                ),
                map(
                        "kind", "actions",
                        "items", List.of(
                                map("label", "Pay", "icon", "arrow"),
                                map("label", "Save", "icon", "plus"),
                                map("label", "Split", "icon", "grid"),
                                map("label", "More", "icon", "dots")
                        )
                ),
                map(
                        "kind", "list",
                        "title", "Recent",
                        "items", List.of(
                                map("title", "Atelier restock", "meta", "Today · $48"),
                                map("title", "Studio lights", "meta", "Yesterday · $120"),
                                map("title", "Paper mill", "meta", "Mon · $32"),
                                map("title", "Copper hardware", "meta", "Sun · $18")
                        )
                ),
                map(
                        "kind", "tabbar",
                        "items", List.of("Home", "Activity", "Wallet", "You")
                )
        );
    }

    private List<Map<String, Object>> dashboard(String prompt, String name) {
        return List.of(
                map("kind", "dashnav", "brand", name, "links", List.of("Overview", "Work", "People", "Billing")),
                map(
                        "kind", "kpis",
                        "items", List.of(
                                map("label", "Revenue", "value", "$48.2k", "delta", "+12%"),
                                map("label", "Active", "value", "1,284", "delta", "+4%"),
                                map("label", "NPS", "value", "72", "delta", "+6"),
                                map("label", "Churn", "value", "1.1%", "delta", "-0.3")
                        )
                ),
                map("kind", "chart", "title", "The last thirty days", "caption", "A quiet climb. No spikes, no tricks."),
                map(
                        "kind", "table",
                        "title", "Latest drafts",
                        "rows", List.of(
                                List.of("Kyoto ceramics", "Landing", "Ready"),
                                List.of("North bank", "Dashboard", "Review"),
                                List.of("Halo restock", "Poster", "Ready"),
                                List.of("Field notes", "App", "Draft")
                        )
                )
        );
    }

    private List<Map<String, Object>> brand(String prompt, String name, String tagline, Map<String, Object> theme) {
        return List.of(
                map(
                        "kind", "brandmark",
                        "name", name,
                        "tagline", tagline,
                        "mark", name.substring(0, 1).toUpperCase(Locale.ROOT)
                ),
                map(
                        "kind", "palette",
                        "title", "Color that belongs to " + name,
                        "swatches", List.of(theme.get("bg"), theme.get("fg"), theme.get("accent"), theme.get("surface"), theme.get("muted"))
                ),
                map(
                        "kind", "type",
                        "title", "The voice on the page",
                        "display", theme.get("fontDisplay"),
                        "sample", headline(prompt, name)
                ),
                map(
                        "kind", "features",
                        "title", "How it should feel",
                        "items", features(prompt, "brand")
                )
        );
    }

    private String systemPrompt() {
        return """
                You are Velt's design director. Produce original, tasteful UI designs as JSON.
                Never copy a known brand, product, or website. Invent a new name if needed.
                Schema:
                {
                  "format": "website|landing|app|dashboard|poster|social|brand|ecommerce",
                  "name": "Brand",
                  "tagline": "short",
                  "theme": {
                    "bg": "#hex", "fg": "#hex", "muted": "#hex", "line": "#hex",
                    "accent": "#hex", "accentFg": "#hex", "surface": "#hex",
                    "fontDisplay": "serif|sans", "radius": "px", "mood": "word",
                    "heroVisual": "editorial|product|gradient|grid"
                  },
                  "nav": { "logo": "", "links": ["",""], "cta": "" },
                  "sections": [ { "kind": "hero|stats|features|gallery|testimonials|pricing|cta|footer|poster|social|appbar|actions|list|tabbar|dashnav|kpis|chart|table|brandmark|palette|type", ... } ]
                }
                Hero needs kicker, headline, sub, cta, secondary, visual.
                Features items: {title, body}. Testimonials: {quote, name, role}.
                Pricing plans: {name, price, period, features[]}.
                Keep copy short, specific, and human. No lorem ipsum. No emojis.
                """;
    }

    public static String normalizeFormat(String format) {
        if (format == null || format.isBlank()) return "website";
        String f = format.trim().toLowerCase(Locale.ROOT);
        return switch (f) {
            case "site", "web", "website" -> "website";
            case "landing", "landing-page" -> "landing";
            case "app", "mobile" -> "app";
            case "dashboard", "admin" -> "dashboard";
            case "poster", "flyer" -> "poster";
            case "social", "post" -> "social";
            case "instagram", "ig", "ig-post" -> "instagram";
            case "facebook", "fb", "fb-ad", "facebook-ad" -> "facebook";
            case "story", "ig-story", "reel" -> "story";
            case "youtube", "yt", "thumbnail", "youtube-thumbnail" -> "youtube";
            case "banner", "display", "ad-banner" -> "banner";
            case "email", "newsletter" -> "email";
            case "pitch", "deck", "slides", "pitch-deck" -> "pitch";
            case "brand", "logo" -> "brand";
            case "ecommerce", "shop", "store" -> "ecommerce";
            default -> f;
        };
    }

    private Map<String, Object> pickTheme(String prompt) {
        String p = prompt.toLowerCase(Locale.ROOT);
        if (containsAny(p, "dark", "night", "noir", "black")) return themeNamed("noir");
        if (containsAny(p, "swiss", "grid", "brutal", "minimal")) return themeNamed("grid");
        if (containsAny(p, "green", "garden", "organic", "forest", "tea")) return themeNamed("meadow");
        if (containsAny(p, "food", "restaurant", "kitchen", "ramen", "wine")) return themeNamed("nori");
        if (containsAny(p, "saas", "software", "ai", "product", "startup")) return themeNamed("lumen");
        if (containsAny(p, "travel", "coast", "sea", "hotel", "island")) return themeNamed("drift");
        if (containsAny(p, "spa", "beauty", "skin", "wellness", "soft")) return themeNamed("halo");
        if (containsAny(p, "playful", "kids", "bright", "fun", "juice")) return themeNamed("citrus");
        if (containsAny(p, "luxury", "quiet", "ceramic", "fashion", "atelier")) return themeNamed("linen");
        if (containsAny(p, "finance", "bank", "ledger", "capital")) return themeNamed("quartz");
        String[] names = {"linen", "meadow", "halo", "nori", "drift", "lumen"};
        return themeNamed(names[Math.abs(prompt.hashCode()) % names.length]);
    }

    private Map<String, Object> themeNamed(String name) {
        return switch (name) {
            case "noir" -> theme("#12110F", "#F4EFE6", "#B3A99A", "#2A2723", "#D8A15A", "#12110F", "#1C1A17", "serif", "10px", "night", "editorial");
            case "grid" -> theme("#F6F4F0", "#111111", "#5C5C5C", "#111111", "#C1121F", "#FFFFFF", "#FFFFFF", "sans", "0px", "swiss", "grid");
            case "meadow" -> theme("#F3F1E7", "#1C2418", "#5C6B52", "#D5D3C4", "#3E5C3A", "#F3F1E7", "#FFFEF8", "serif", "18px", "garden", "editorial");
            case "nori" -> theme("#F6EFE4", "#241C16", "#7A6554", "#E4D4C2", "#C4451C", "#FFF8F0", "#FFF9F1", "serif", "12px", "kitchen", "product");
            case "lumen" -> theme("#F7F7F5", "#141414", "#6B6B6B", "#E6E6E1", "#1F4BFF", "#FFFFFF", "#FFFFFF", "sans", "16px", "product", "product");
            case "drift" -> theme("#EEF3F2", "#17333A", "#5E7A80", "#D5E1E0", "#2A6F73", "#F4FFFE", "#FFFFFF", "serif", "22px", "coast", "gradient");
            case "halo" -> theme("#F8F1EA", "#3A2A28", "#8A7068", "#E8D8CE", "#C46B5A", "#FFF7F2", "#FFF9F5", "serif", "28px", "soft", "gradient");
            case "citrus" -> theme("#FFF6E8", "#2A1C0F", "#8A6A3A", "#F0D9B0", "#E4572E", "#FFF6E8", "#FFFFFF", "sans", "24px", "bright", "grid");
            case "quartz" -> theme("#F4F1EC", "#1B1A17", "#6E6A62", "#E2DCD3", "#8A6A3A", "#F4F1EC", "#FFFdf8", "sans", "8px", "ledger", "product");
            default -> theme("#F3EEE4", "#171411", "#7A7268", "#D8D0C4", "#C24E1D", "#FFF7F0", "#FFFBF5", "serif", "16px", "atelier", "editorial");
        };
    }

    private Map<String, Object> theme(
            String bg, String fg, String muted, String line, String accent, String accentFg,
            String surface, String fontDisplay, String radius, String mood, String heroVisual
    ) {
        return map(
                "bg", bg, "fg", fg, "muted", muted, "line", line,
                "accent", accent, "accentFg", accentFg, "surface", surface,
                "fontDisplay", fontDisplay, "radius", radius, "mood", mood, "heroVisual", heroVisual
        );
    }

    String brandName(String prompt) {
        String cleaned = prompt.replaceAll("[^A-Za-z0-9\\s]", " ").trim();
        String[] words = cleaned.split("\\s+");
        List<String> interesting = new ArrayList<>();
        for (String word : words) {
            if (word.length() >= 4 && !STOP.contains(word.toLowerCase(Locale.ROOT))) {
                interesting.add(capitalize(word));
            }
        }
        if (!interesting.isEmpty() && interesting.get(0).length() <= 12) {
            return interesting.get(0);
        }
        String[] bank = {"Vellum", "Kama", "Lumen", "Nori", "Field", "Halo", "Drift", "Atelier", "Quill", "Sora", "Mira", "Copper"};
        return bank[Math.abs(prompt.hashCode()) % bank.length];
    }

    private String headline(String prompt, String name) {
        String p = prompt.toLowerCase(Locale.ROOT);
        if (containsAny(p, "ceramic", "pottery", "clay")) return "Clay, fire, and the pause between.";
        if (containsAny(p, "fashion", "atelier", "garment")) return "Clothes that keep their voice.";
        if (containsAny(p, "saas", "software", "app for")) return "Software that stays out of the way.";
        if (containsAny(p, "travel", "hotel", "stay")) return "Stay somewhere that remembers you.";
        if (containsAny(p, "food", "restaurant")) return "A table, a season, a long lunch.";
        if (containsAny(p, "wellness", "spa", "skin")) return "Slow care. Visible calm.";
        if (containsAny(p, "finance", "bank")) return "Money, made legible.";
        if (containsAny(p, "portfolio", "studio")) return "Work, shown without shouting.";
        String[] templates = {
                name + " is a quieter kind of beautiful.",
                "Made for people who notice.",
                "From a sentence to something you can ship.",
                "The studio you open in a tab."
        };
        return templates[Math.abs(prompt.hashCode()) % templates.length];
    }

    private String shortHeadline(String prompt, String name) {
        String h = headline(prompt, name);
        String[] parts = h.split(" ");
        return String.join(" ", Arrays.copyOf(parts, Math.min(4, parts.length)));
    }

    private String posterTitle(String prompt, String name) {
        if (containsAny(prompt, "concert", "jazz", "music")) return "Night set";
        if (containsAny(prompt, "talk", "lecture", "conference")) return "In conversation";
        if (containsAny(prompt, "sale", "drop")) return "The drop";
        return name;
    }

    private String posterMeta(String prompt) {
        if (containsAny(prompt, "tonight", "friday", "saturday")) return "Doors at 8";
        return "Limited print · Studio edition";
    }

    private String placeFrom(String prompt) {
        String p = prompt.toLowerCase(Locale.ROOT);
        if (p.contains("kyoto")) return "Kyoto";
        if (p.contains("paris")) return "Paris";
        if (p.contains("lisbon")) return "Lisbon";
        if (p.contains("oslo")) return "Oslo";
        if (p.contains("new york") || p.contains("nyc")) return "New York";
        return "The hall";
    }

    private String tagline(String prompt, String name) {
        String trimmed = prompt.trim();
        if (trimmed.length() > 90) {
            return trimmed.substring(0, 86).trim() + "…";
        }
        if (trimmed.length() > 24) return capitalize(trimmed);
        return name + " — designed from a single line of intent.";
    }

    private String subhead(String prompt) {
        String t = prompt.trim();
        if (t.length() < 40) {
            return "A complete layout, not a template. Type, color, and rhythm composed to match the feeling you described.";
        }
        if (t.length() > 180) return t.substring(0, 176) + "…";
        return t;
    }

    private String kicker(String prompt, String format) {
        if ("poster".equals(format)) return "Studio print";
        if ("landing".equals(format)) return "New offer";
        if (containsAny(prompt, "aw", "collection", "season")) return "New season";
        return "Velt draft";
    }

    private String ctaLabel(String format) {
        return switch (format) {
            case "ecommerce" -> "Shop the bench";
            case "app" -> "Get the app";
            case "landing" -> "Start free";
            default -> "Enter the studio";
        };
    }

    private List<String> navLinks(String format) {
        return switch (format) {
            case "ecommerce" -> List.of("Shop", "Stories", "Atelier");
            case "landing" -> List.of("Product", "Customers", "Pricing");
            default -> List.of("Work", "Approach", "Notes");
        };
    }

    private String visualFor(String prompt) {
        if (containsAny(prompt, "swiss", "grid", "poster")) return "grid";
        if (containsAny(prompt, "saas", "app", "dashboard", "product")) return "product";
        if (containsAny(prompt, "soft", "spa", "sunset", "coast")) return "gradient";
        return "editorial";
    }

    private List<Map<String, Object>> features(String prompt, String format) {
        if ("brand".equals(format)) {
            return List.of(
                    map("title", "Voice", "body", "Short sentences. Warm nouns. No slogans that could belong to anyone."),
                    map("title", "Material", "body", "Paper, metal, and a single loud color used like a stamp."),
                    map("title", "Pace", "body", "Layouts that breathe. If a section is quiet, leave it quiet.")
            );
        }
        if (containsAny(prompt, "saas", "software")) {
            return List.of(
                    map("title", "Write it once", "body", "Describe the product in a sentence. The page finds its own hierarchy."),
                    map("title", "Edit in conversation", "body", "Ask for a darker hero or a shorter headline. The layout moves, the taste stays."),
                    map("title", "Ship the draft", "body", "What you see is a real composition, not a moodboard of other people's sites.")
            );
        }
        return List.of(
                map("title", "Type with a spine", "body", "Display faces that feel chosen, body copy that actually reads."),
                map("title", "Color with a reason", "body", "One accent, a paper ground, and enough contrast to hold in sunlight."),
                map("title", "Space that works", "body", "Margins, rhythm, and a grid you can feel even if you never see it.")
        );
    }

    private static boolean containsAny(String haystack, String... needles) {
        String h = haystack.toLowerCase(Locale.ROOT);
        for (String n : needles) {
            if (h.contains(n)) return true;
        }
        return false;
    }

    private static String capitalize(String word) {
        if (word == null || word.isBlank()) return word;
        return word.substring(0, 1).toUpperCase(Locale.ROOT) + word.substring(1);
    }

    private static Map<String, Object> map(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i + 1 < kv.length; i += 2) {
            m.put((String) kv[i], kv[i + 1]);
        }
        return m;
    }

    private static final Set<String> STOP = Set.of(
            "a", "an", "the", "for", "and", "with", "from", "that", "this", "page", "website",
            "landing", "app", "mobile", "design", "make", "create", "about", "like", "want",
            "need", "please", "just", "something", "site", "dark", "light", "modern", "clean"
    );
}
