"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT =
  "You are EcoMentor, a friendly mentor helping students in Punjab learn about the environment. Be concise, supportive, and actionable. Provide clear steps, explain briefly, and tailor examples to India/Punjab context when helpful. Avoid making claims that require external verification. If users ask about challenges or quizzes, guide them with tips and encouragement.";

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
