const TYPESAFE_API_URL = "https://api.typesafe.ai/v1/systemone";
const DEFAULT_TYPESAFE_KEY =
  "apikey_2113fa36a81bbfa842f1932abe9e16e3cd19_fd0795140b7ce07bb831588b39f63e77c9ffd9cb930409b656eb051c89788f65";

export interface DesignTriageResult {
  targetDevice?: string;
  themeMode?: string;
  uiStyle?: string;
  layoutType?: string;
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
              dark: "Dark theme, black/deep charcoal background, glowing or high-contrast accents",
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
          layout_type: {
            type: "choice",
            instructions: "What interface structure fits this design?",
            criteria: {
              dashboard: "Metrics, sparklines, tables, sidebar navigation, activity logs",
              landing_page: "Hero banner, features grid, social proof, call to action",
              mobile_flow: "App screen, bottom tab bar, swipe cards, list items",
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
      layoutType: answers.layout_type?.choice,
      confidence: {
        targetDevice: answers.target_device?.confidence,
        themeMode: answers.theme_mode?.confidence,
        uiStyle: answers.ui_style?.confidence,
        layoutType: answers.layout_type?.confidence,
      },
    };
  } catch (err) {
    console.warn("TypeSafe triage skipped due to network or configuration:", err);
    return null;
  }
}
