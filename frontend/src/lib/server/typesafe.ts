const TYPESAFE_API_URL = "https://api.typesafe.ai/v1/systemone";
const DEFAULT_TYPESAFE_KEY =
  "apikey_2113fa36a81bbfa842f1932abe9e16e3cd19_fd0795140b7ce07bb831588b39f63e77c9ffd9cb930409b656eb051c89788f65";

export interface DesignTriageResult {
  targetDevice?: string;
  themeMode?: string;
  uiStyle?: string;
  domainContext?: string;
  layoutArchetype?: string;
  heroComposition?: string;
  confidence?: Record<string, number>;
}

export async function triageDesignPrompt(prompt: string): Promise<DesignTriageResult | null> {
  const apiKey = process.env.TYPESAFE_API_KEY || DEFAULT_TYPESAFE_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(TYPESAFE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "jev-latest",
        state: { user_prompt: prompt },
        questions: {
          target_device: {
            type: "choice",
            instructions: "What target canvas format fits this prompt best?",
            criteria: {
              desktop: "Large desktop web app, portfolio, or SaaS dashboard",
              mobile: "Handheld smartphone app screen",
              tablet: "Tablet-sized interface",
            },
          },
          theme_mode: {
            type: "choice",
            instructions: "What color mode does the user want?",
            criteria: {
              dark: "Dark theme, pitch black or deep carbon/charcoal background, glowing neon or crisp light accents",
              light: "Light theme, clean paper or crisp white background",
            },
          },
          ui_style: {
            type: "choice",
            instructions: "What visual aesthetic best matches this prompt?",
            criteria: {
              cyberpunk_or_tech: "High-tech, neon accents, dark futuristic or crypto aesthetic",
              minimal_clean: "Whitespace-heavy, clean typography, Apple / Linear style minimalism",
              corporate_formal: "Traditional enterprise, trusted slate/blue, fintech/banking",
              editorial_luxury: "Serif typography, monograph, architecture or high fashion",
              brutalist_bold: "Heavy black borders, high-contrast, large typography, stark raw grid",
            },
          },
          domain_context: {
            type: "choice",
            instructions: "What exact industry or product domain is this interface built for?",
            criteria: {
              crypto_trading: "Crypto exchange, trading terminal, orderbook, candlestick charts, live pairs",
              ecommerce_store: "Online store, shop, merchant portal, products sold, revenue, orders",
              developer_devops: "API latency, cluster nodes, telemetry, logs, git commits, CI/CD pipelines",
              saas_analytics: "B2B SaaS, MRR, churn rate, subscriptions, active user cohorts, user growth",
              fashion_architecture: "High fashion, luxury studio, architectural monograph, atelier, interior",
              cultural_music_event: "Concert, festival, exhibition, film, club event, DJ set",
              culinary_restaurant: "Artisan bakery, coffee roaster, seasonal dining, bespoke winery",
            },
          },
          layout_archetype: {
            type: "choice",
            instructions: "What high-level visual structure should govern this entire document?",
            criteria: {
              editorial_monograph: "Full-bleed cover hero, monograph gallery, architectural grid, minimal text",
              conversion_landing: "Headline with CTA, bento feature cards, testimonial wall, transparent pricing tiers",
              interactive_terminal: "Live chart telemetry, orderbook or live execution feed, metric badges",
              product_catalog: "Hero showcase, interactive product grid, order status, cart/checkout triggers",
              swiss_poster: "Large display typography, brutalist geometric grid, venue/date meta badges",
              mobile_app_flow: "Header bar, interactive action chips, live list cards, bottom tab bar",
            },
          },
          hero_composition: {
            type: "choice",
            instructions: "How should the hero / header section be arranged?",
            criteria: {
              editorial_cover: "Grand full-bleed magazine cover with large typography over visual/gradient",
              split_balanced: "Left-aligned copy with CTA button, right-aligned interactive graphic or mockups",
              centered_minimal: "Centered high-impact headline, refined subtext, single prominent CTA",
              bento_grid: "Modular bento box arrangement with key metrics and preview badges",
            },
          },
        },
      }),
    });

    if (!res.ok) {
      console.warn("TypeSafe triage warning:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const answers = data.answers || {};

    return {
      targetDevice: answers.target_device?.choice,
      themeMode: answers.theme_mode?.choice,
      uiStyle: answers.ui_style?.choice,
      domainContext: answers.domain_context?.choice,
      layoutArchetype: answers.layout_archetype?.choice,
      heroComposition: answers.hero_composition?.choice,
      confidence: {
        targetDevice: answers.target_device?.confidence,
        themeMode: answers.theme_mode?.confidence,
        uiStyle: answers.ui_style?.confidence,
        domainContext: answers.domain_context?.confidence,
        layoutArchetype: answers.layout_archetype?.confidence,
        heroComposition: answers.hero_composition?.confidence,
      },
    };
  } catch (err) {
    console.warn("TypeSafe triage skipped due to network or configuration:", err);
    return null;
  }
}
