const TYPESAFE_API_URL = "https://api.typesafe.ai/v1/systemone";
const DEFAULT_TYPESAFE_KEY =
  "apikey_2113fa36a81bbfa842f1932abe9e16e3cd19_fd0795140b7ce07bb831588b39f63e77c9ffd9cb930409b656eb051c89788f65";

export interface DesignTriageResult {
  targetDevice?: string;
  themeMode?: string;
  uiStyle?: string;
  domainContext?: string;
  dashboardVariant?: string;
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
            },
          },
          domain_context: {
            type: "choice",
            instructions: "What exact industry or product domain is this interface built for?",
            criteria: {
              crypto_trading: "Crypto exchange, trading terminal, orderbook, candlestick charts, live pairs",
              ecommerce_store: "Online store, merchant portal, products sold, revenue, orders, fulfilment",
              developer_devops: "API latency, cluster nodes, telemetry, logs, git commits, CI/CD pipelines",
              saas_analytics: "B2B SaaS, MRR, churn rate, subscriptions, active user cohorts, user growth",
              generic_web: "Standard website, landing page, portfolio, or brand showcase",
            },
          },
          dashboard_variant: {
            type: "choice",
            instructions: "If this is an analytical/dashboard interface, what UI architecture is required?",
            criteria: {
              trading_terminal: "Candlestick / depth chart, live order book bids/asks, order entry execution, token pairs",
              ecommerce_admin: "Revenue KPI cards, recent customer orders list, top selling products grid, return rate",
              telemetry_metrics: "System latency, server uptime, CPU/Memory telemetry sparklines, error log stream",
              saas_bento: "MRR / ARR counters, churn sparklines, user acquisition funnel, billing table",
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
      dashboardVariant: answers.dashboard_variant?.choice,
      confidence: {
        targetDevice: answers.target_device?.confidence,
        themeMode: answers.theme_mode?.confidence,
        uiStyle: answers.ui_style?.confidence,
        domainContext: answers.domain_context?.confidence,
        dashboardVariant: answers.dashboard_variant?.confidence,
      },
    };
  } catch (err) {
    console.warn("TypeSafe triage skipped due to network or configuration:", err);
    return null;
  }
}
