export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  onboarding_completed: boolean;
  notify_product: boolean;
  notify_marketing: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  brand_name: string | null;
  personality: string[]; // e.g. ["professional", "witty"]
  tone: string | null; // free-form tone description
  audience: string | null;
  values: string | null;
  example_content: string | null;
  style_rules: string | null; // grammar / formatting do's & don'ts
  words_to_avoid: string | null;
  created_at: string;
  updated_at: string;
}

export type ContentStatus = "draft" | "in_review" | "published" | "archived";

export type Platform =
  | "blog"
  | "linkedin"
  | "twitter"
  | "newsletter"
  | "website"
  | "ad";

export interface ContentItem {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  platform: Platform;
  body: string;
  status: ContentStatus;
  readability_score: number | null;
  sentiment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentRevision {
  id: string;
  content_id: string;
  user_id: string;
  body: string;
  note: string | null;
  created_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  provider: string;
  connected: boolean;
  created_at: string;
}
