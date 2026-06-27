import type { Platform } from "./types";

export interface PlatformMeta {
  id: Platform;
  label: string;
  icon: string;
  description: string;
  charLimit: number | null;
  hint: string;
}

export const PLATFORMS: PlatformMeta[] = [
  {
    id: "blog",
    label: "Blog Post",
    icon: "📝",
    description: "Long-form, SEO-aware article",
    charLimit: null,
    hint: "800–1500 words, clear H2/H3 structure",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    description: "Professional thought-leadership update",
    charLimit: 3000,
    hint: "Hook + insight + CTA, line breaks for scannability",
  },
  {
    id: "twitter",
    label: "X / Twitter Thread",
    icon: "🐦",
    description: "Punchy multi-tweet thread",
    charLimit: 280,
    hint: "5–8 tweets, one idea each, strong opener",
  },
  {
    id: "newsletter",
    label: "Email Newsletter",
    icon: "✉️",
    description: "Engaging subscriber email",
    charLimit: null,
    hint: "Subject line + skimmable body + single CTA",
  },
  {
    id: "website",
    label: "Website Copy",
    icon: "🌐",
    description: "Landing / product page copy",
    charLimit: null,
    hint: "Benefit-led headline, social proof, CTA",
  },
  {
    id: "ad",
    label: "Ad Copy",
    icon: "📣",
    description: "Paid social / search ad variations",
    charLimit: 150,
    hint: "3–5 short variants, action verbs",
  },
];

export function platformMeta(id: Platform): PlatformMeta {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}

export const BRAND_PERSONALITIES = [
  "Professional",
  "Friendly",
  "Authoritative",
  "Witty",
  "Bold",
  "Empathetic",
  "Innovative",
  "Approachable",
  "Data-driven",
  "Inspirational",
];

export const STATUS_META: Record<
  string,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-surface-overlay text-gray-300" },
  in_review: {
    label: "In Review",
    className: "bg-brand-500/20 text-brand-300",
  },
  published: {
    label: "Published",
    className: "bg-accent/20 text-accent",
  },
  archived: { label: "Archived", className: "bg-gray-700/40 text-gray-400" },
};

export const INTEGRATION_PROVIDERS = [
  { id: "hubspot", name: "HubSpot", icon: "🟠", category: "CRM & Marketing" },
  { id: "buffer", name: "Buffer", icon: "🔵", category: "Social Scheduling" },
  { id: "hootsuite", name: "Hootsuite", icon: "🦉", category: "Social Scheduling" },
  { id: "wordpress", name: "WordPress", icon: "📰", category: "CMS" },
  { id: "mailchimp", name: "Mailchimp", icon: "🐵", category: "Email" },
  { id: "ga4", name: "Google Analytics", icon: "📊", category: "Analytics" },
  { id: "notion", name: "Notion", icon: "📓", category: "Content Calendar" },
  { id: "slack", name: "Slack", icon: "💬", category: "Notifications" },
];
