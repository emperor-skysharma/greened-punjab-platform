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
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        success: false as const,
        error:
          "OpenRouter API key is not configured. Please add OPENROUTER_API_KEY in Integrations > OpenRouter.",
      };
    }

    const model = args.model || "openai/gpt-4o";
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...FEW_SHOTS,
      ...args.messages,
    ];

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
  },
});