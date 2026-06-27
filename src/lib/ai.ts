import type { BrandProfile, Platform } from "./types";
import { platformMeta } from "./constants";

export {
  readabilityScore,
  sentimentLabel,
  wordCount,
} from "./analytics";

export interface BrandContext {
  brand_name?: string | null;
  personality?: string[] | null;
  tone?: string | null;
  audience?: string | null;
  values?: string | null;
  style_rules?: string | null;
  words_to_avoid?: string | null;
}

export function brandToContext(b: BrandProfile | null): BrandContext {
  if (!b) return {};
  return {
    brand_name: b.brand_name,
    personality: b.personality,
    tone: b.tone,
    audience: b.audience,
    values: b.values,
    style_rules: b.style_rules,
    words_to_avoid: b.words_to_avoid,
  };
}

function brandSystemPrompt(brand: BrandContext): string {
  const lines: string[] = [
    "You are AI Sage, an expert B2B SaaS content writer.",
    "Write publish-ready copy that strictly follows the brand guidelines below.",
  ];
  if (brand.brand_name) lines.push(`Brand: ${brand.brand_name}.`);
  if (brand.personality?.length)
    lines.push(`Brand personality: ${brand.personality.join(", ")}.`);
  if (brand.tone) lines.push(`Tone of voice: ${brand.tone}.`);
  if (brand.audience) lines.push(`Target audience: ${brand.audience}.`);
  if (brand.values) lines.push(`Brand values: ${brand.values}.`);
  if (brand.style_rules) lines.push(`Style rules to obey: ${brand.style_rules}.`);
  if (brand.words_to_avoid)
    lines.push(`Never use these words/phrases: ${brand.words_to_avoid}.`);
  lines.push(
    "Return only the content itself — no preamble, no explanation, no markdown code fences.",
  );
  return lines.join("\n");
}

function platformInstruction(platform: Platform, prompt: string): string {
  const meta = platformMeta(platform);
  return [
    `Create a ${meta.label} about: "${prompt}".`,
    `Format guidance: ${meta.hint}.`,
    meta.charLimit
      ? `Respect a soft limit of ${meta.charLimit} characters per unit.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

async function callAnthropic(
  system: string,
  user: string,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1600,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === "string" ? text.trim() : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Template fallbacks — keep every flow working without an API key.
// ---------------------------------------------------------------------------
function fallbackContent(
  platform: Platform,
  prompt: string,
  brand: BrandContext,
): string {
  const topic = prompt.trim() || "your topic";
  const voice = brand.personality?.length
    ? brand.personality.join(", ").toLowerCase()
    : "clear and professional";
  const who = brand.audience || "B2B SaaS teams";

  switch (platform) {
    case "blog":
      return `# ${titleCase(topic)}: What ${who} Need to Know

For ${who}, ${topic} has shifted from a nice-to-have to a competitive necessity. In this post we break down why it matters now and how to act on it.

## The problem
Most teams treat ${topic} as an afterthought — and pay for it in wasted hours and inconsistent results.

## A better approach
1. Start with a clear definition of success.
2. Build a repeatable system instead of one-off effort.
3. Measure, learn and iterate every cycle.

## Why it works
A systematic approach to ${topic} compounds. Small, consistent improvements outperform sporadic big pushes every time.

## Takeaway
Treat ${topic} as a system, not a task. Your future self — and your pipeline — will thank you.

_(Drafted by AI Sage in a ${voice} voice. Connect an Anthropic API key for fully AI-generated drafts.)_`;

    case "linkedin":
      return `${titleCase(topic)} is quietly costing ${who} more than they realize. 👇

Here's what I've learned:

→ The teams winning at ${topic} aren't working harder — they've built a system.
→ Consistency beats intensity. Every. Single. Time.
→ The best time to fix this was last quarter. The second best is today.

If ${topic} is on your roadmap, start small and stay relentless.

What's worked for your team? 👇

#B2BSaaS #ContentMarketing`;

    case "twitter":
      return `1/ ${titleCase(topic)} is a bigger lever for ${who} than most realize. A thread 🧵

2/ Most teams treat it as a task. The winners treat it as a system.

3/ Systems beat willpower. Define success, then build a repeatable loop around it.

4/ Measure one thing that matters. Improve it 1% each week.

5/ Consistency compounds. Six months of small wins > one heroic sprint.

6/ TL;DR: make ${topic} a system, ship weekly, and let the compounding do the work.`;

    case "newsletter":
      return `Subject: The ${titleCase(topic)} playbook (in 3 minutes)

Hi there,

Quick one this week on ${topic} — because it's one of the highest-leverage things ${who} can fix right now.

The big idea: stop treating ${topic} as a one-off task. Build a repeatable system, measure what matters, and let small wins compound.

Three things to try this week:
• Define what "good" looks like for ${topic}.
• Pick one metric and track it.
• Ship one small improvement.

Reply and tell me how it goes — I read every response.

Until next week,
The ${brand.brand_name || "AI Sage"} team`;

    case "website":
      return `## ${titleCase(topic)}, finally made simple

Built for ${who} who don't have hours to spare.

**Stop guessing. Start shipping.**
AI Sage turns ${topic} from a recurring headache into a repeatable system — so you ship consistent, on-brand results every time.

✓ Set it up in minutes
✓ Stay consistent across every channel
✓ See measurable results

[Get started free →]`;

    case "ad":
      return `Variant A: ${titleCase(topic)} without the busywork. Try AI Sage free →
Variant B: ${who}: reclaim 15 hours a week. Start free →
Variant C: On-brand ${topic}, in minutes not hours. Sign up free →
Variant D: Stop guessing at ${topic}. Let AI Sage handle it. →`;

    default:
      return `Draft about ${topic} for ${who}.`;
  }
}

export async function generateContent(opts: {
  platform: Platform;
  prompt: string;
  brand: BrandContext;
}): Promise<{ body: string; aiGenerated: boolean }> {
  const system = brandSystemPrompt(opts.brand);
  const user = platformInstruction(opts.platform, opts.prompt);
  const ai = await callAnthropic(system, user);
  if (ai) return { body: ai, aiGenerated: true };
  return {
    body: fallbackContent(opts.platform, opts.prompt, opts.brand),
    aiGenerated: false,
  };
}

export interface ResearchResult {
  summary: string;
  keywords: string[];
  outline: { heading: string; points: string[] }[];
  aiGenerated: boolean;
}

export async function generateResearch(
  topic: string,
  brand: BrandContext,
): Promise<ResearchResult> {
  const system =
    brandSystemPrompt(brand) +
    "\nYou are now in research mode. Respond ONLY with valid minified JSON matching: " +
    '{"summary": string, "keywords": string[], "outline": [{"heading": string, "points": string[]}]}';
  const user = `Produce a research brief and content outline for the topic: "${topic}".`;
  const ai = await callAnthropic(system, user);
  if (ai) {
    try {
      const parsed = JSON.parse(stripFences(ai));
      if (parsed?.summary && Array.isArray(parsed?.outline)) {
        return {
          summary: parsed.summary,
          keywords: parsed.keywords ?? [],
          outline: parsed.outline,
          aiGenerated: true,
        };
      }
    } catch {
      /* fall through to template */
    }
  }
  return { ...fallbackResearch(topic, brand), aiGenerated: false };
}

function fallbackResearch(topic: string, brand: BrandContext): ResearchResult {
  const who = brand.audience || "B2B SaaS teams";
  const t = topic.trim() || "your topic";
  return {
    summary: `${titleCase(
      t,
    )} is a high-priority area for ${who}. Search intent skews toward practical, how-to guidance rather than theory. Competitors mostly publish surface-level overviews, leaving room for a system-driven, example-rich angle. Frame the piece around a repeatable framework and back claims with concrete steps and measurable outcomes.`,
    keywords: [
      t,
      `${t} for B2B SaaS`,
      `${t} best practices`,
      `${t} framework`,
      `how to improve ${t}`,
      `${t} examples`,
    ],
    outline: [
      {
        heading: "Hook & problem",
        points: [
          `Why ${t} matters now for ${who}`,
          "The hidden cost of getting it wrong",
        ],
      },
      {
        heading: "The framework",
        points: ["Define success", "Build a repeatable system", "Measure & iterate"],
      },
      {
        heading: "In practice",
        points: ["A worked example", "Common pitfalls to avoid"],
      },
      {
        heading: "Takeaway & CTA",
        points: ["Key recap", "Clear next step for the reader"],
      },
    ],
    aiGenerated: false,
  };
}

// ---------------------------------------------------------------------------
function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
function stripFences(s: string): string {
  return s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
}
