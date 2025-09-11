"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT =
  "You are EcoMentor, a friendly, encouraging mentor helping students in Punjab learn about the environment. Your goals: 1) Be concise and practical. 2) Offer clear step-by-step tips tailored to school life and home activities in India/Punjab. 3) When users ask about challenges/quizzes, give short guidance and motivational tips, not strict rules. 4) Prefer low-cost and locally available resources. 5) Avoid definitive claims that require external verification; instead, suggest how to check or approximate. 6) Use simple language suitable for ages 12-18 while respecting curious adults. 7) Always keep responses under ~8 sentences unless the user asks for more detail.";

const FEW_SHOTS: ChatMessage[] = [
  {
    role: "user",
    content: "How can I reduce plastic at home?",
  },
  {
    role: "assistant",
    content:
      "Great question! Try these steps:\n1) Carry a reusable bottle and bag.\n2) Buy larger packs (less packaging) and avoid single-use cutlery.\n3) Store leftovers in steel/glass dabbas instead of cling film.\n4) Refill household cleaners where available.\n5) Keep a small checklist on the fridge so your family remembers.\nSmall consistent habits make a big impact!",
  },
  {
    role: "user",
    content: "Any tips for the tree planting challenge?",
  },
  {
    role: "assistant",
    content:
      "Absolutely! 1) Choose a native species (e.g., neem, peepal, jamun) and a spot with good sunlight.\n2) Soak the pit before planting; keep the root ball intact.\n3) Water weekly and add mulch (dry leaves) to retain moisture.\n4) Take photos at planting and after 1–2 weeks to show care.\n5) Write 2–3 lines on why you chose that species.\nYou've got this—every sapling counts!",
  },
  {
    role: "user",
    content: "Give me quick climate-friendly habits for school.",
  },
  {
    role: "assistant",
    content:
      "Quick wins: 1) Bring a tiffin and bottle. 2) Share notes digitally where possible. 3) Use stairs for short floors. 4) Turn off fans/lights when leaving. 5) Join or start an eco-club for monthly clean-up drives.\nKeep it simple and consistent!",
  },
];

function detectEnvironmentTopic(text: string): boolean {
  const t = text.toLowerCase();
  const keywords: Array<string> = [
    "environment", "climate", "recycle", "recycling", "waste", "plastic", "tree",
    "planting", "pollution", "biodiversity", "conservation", "energy", "solar",
    "water", "air", "sustainability", "carbon", "footprint", "compost", "eco",
    "green", "emissions", "wildlife", "forest", "deforestation", "agriculture",
    "soil", "renewable"
  ];
  return keywords.some(k => t.includes(k));
}

async function fetchWikipediaSummary(query: string): Promise<{ content: string } | null> {
  try {
    // Step 1: Search for best matching page title
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&origin=*&search=${encodeURIComponent(
        query
      )}`,
      { method: "GET" }
    );
    if (!searchRes.ok) return null;
    const searchData = (await searchRes.json()) as any;
    const title: string | undefined = searchData?.[1]?.[0];
    if (!title) return null;

    // Step 2: Fetch page summary
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { method: "GET" }
    );
    if (!summaryRes.ok) return null;
    const summaryData = (await summaryRes.json()) as any;

    const extract: string | undefined = summaryData?.extract;
    const pageUrl: string | undefined = summaryData?.content_urls?.desktop?.page || summaryData?.content_urls?.mobile?.page;
    if (!extract) return null;

    const content =
      `${extract}\n\nSource: ${pageUrl || "https://en.wikipedia.org"}`;
    return { content };
  } catch {
    return null;
  }
}

function generateLocalWhatIf(prompt: string, mode: "story" | "video"): string {
  const action = prompt.trim();
  if (mode === "video") {
    return [
      "Title: What if I " + action + "?",
      "",
      "Hook (0:00–0:10): A normal day, a small choice.",
      "Scene 1 (0:10–0:30): The action happens. Immediate, unnoticed effects.",
      "Scene 2 (0:30–1:00): Scale up to a classroom, a neighborhood, a city. Energy, waste, or emissions add up.",
      "Scene 3 (1:00–1:30): Ripple effects—air quality, bills, noise, health, wildlife.",
      "Scene 4 (1:30–2:00): Contrast with a better choice—simple habit change, small tools, reminders.",
      "Call to Action (2:00–2:15): Try this today: 1) Make it easy; 2) Track once a week; 3) Share the habit.",
    ].join("\n");
  }
  return [
    "What if: " + action,
    "",
    "Imagine this as a short story: You choose the easy path today—no big deal. But over days, that small choice adds up. Energy is used when nobody benefits, bills climb rupee by rupee, and the neighborhood feels just a bit warmer, noisier, or more cluttered. Scale it to a school, then a city—suddenly the invisible becomes visible as air quality dips and waste rises.",
    "",
    "Now, flip the scene: the same action with a tiny tweak. You pause for 3 seconds, switch off what isn't needed, reuse what you already have, and set a reminder. At home, your space feels calmer; at school, others follow; in your community, the signal spreads. That small change, repeated, becomes a story of shared savings and cleaner air.",
    "",
    "Try this today: 1) Make the good choice the easy choice (keep it near, label it); 2) Track it once a week; 3) Share your tip with one friend.",
  ].join("\n");
}

const SYSTEM_PROMPT_WHATIF =
  "You are EcoMentor for a feature called 'What if!'. When users ask about everyday actions (e.g., 'What if I leave the fan on all day?'), reply with either a short cinematic story or a concise video outline explaining likely real-world consequences. Be practical, India/Punjab-context aware, and concise. Avoid strict claims; prefer ranges, approximations, and steps to verify. Keep to ~8-12 sentences for story mode. For video mode, produce a crisp outline with sections (Hook, Scenes, CTA). Always end with 2-3 actionable tips.";

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(
          v.literal("system"),
          v.literal("user"),
          v.literal("assistant")
        ),
        content: v.string(),
      })
    ),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Determine last user message
    const lastUserMsg =
      [...args.messages].reverse().find((m) => m.role === "user")?.content?.trim() || "";

    // Heuristic: if user asks outside of environmental focus, prefer web fallback first
    const outOfScope = lastUserMsg ? !detectEnvironmentTopic(lastUserMsg) : false;

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Helper to run Wikipedia fallback
    const runWebFallback = async () => {
      if (!lastUserMsg) {
        return {
          success: false as const,
          error: "I didn't catch your question. Please type it again.",
        };
      }
      const wiki = await fetchWikipediaSummary(lastUserMsg);
      if (wiki) {
        return { success: true as const, content: wiki.content };
      }
      return {
        success: false as const,
        error:
          "I couldn't find a reliable source for that yet. Please try rephrasing your question.",
      };
    };

    // If no key or out-of-scope, try web fallback first (free)
    if (!apiKey || outOfScope) {
      const web = await runWebFallback();
      if (!apiKey) {
        // If no key configured, return immediately (free mode)
        return web;
      }
      // If out-of-scope but web failed, continue to LLM as secondary
      if (web.success) return web;
      // else, fall through to LLM with key
    }

    const model = args.model || "google/gemini-pro";
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...FEW_SHOTS,
      ...args.messages,
    ];

    // Try LLM
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://app", // optional
          "X-Title": "GreenEd Punjab", // optional
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (!res.ok) {
        // On LLM error, fallback to web
        const web = await runWebFallback();
        if (web.success) return web;

        const text = await res.text().catch(() => "");
        return {
          success: false as const,
          error: `OpenRouter error (${res.status}): ${text || res.statusText}`,
        };
      }

      const data = (await res.json()) as any;
      const content =
        data?.choices?.[0]?.message?.content ??
        "Sorry, I couldn't generate a response.";
      return { success: true as const, content };
    } catch {
      // On unexpected error, fallback to web
      const web = await runWebFallback();
      if (web.success) return web;
      return {
        success: false as const,
        error: "Unexpected error. Please try again.",
      };
    }
  },
});

export const whatIf = action({
  args: {
    prompt: v.string(),
    mode: v.optional(v.union(v.literal("story"), v.literal("video"))),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const question = args.prompt.trim();
    if (!question) {
      return { success: false as const, error: "Please enter a scenario to explore." };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const mode = args.mode || "story";
    const model = args.model || "google/gemini-pro";

    // If no key, return a locally generated narrative/outline
    if (!apiKey) {
      return { success: true as const, content: generateLocalWhatIf(question, mode) };
    }

    const messages: Array<{ role: "system" | "user"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT_WHATIF },
      { role: "user", content: `Mode: ${mode}\nQuestion: ${question}` },
    ];

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://app",
          "X-Title": "GreenEd Punjab - What if!",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 700,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        // Fall back to local generation on error
        return {
          success: true as const,
          content: generateLocalWhatIf(question, mode) + (text ? `\n\n(Note: AI fallback used)` : ""),
        };
      }

      const data = (await res.json()) as any;
      const content =
        data?.choices?.[0]?.message?.content ??
        generateLocalWhatIf(question, mode);
      return { success: true as const, content };
    } catch {
      // On any unexpected error, use local fallback
      return {
        success: true as const,
        content: generateLocalWhatIf(question, mode) + "\n\n(Note: AI fallback used)",
      };
    }
  },
});