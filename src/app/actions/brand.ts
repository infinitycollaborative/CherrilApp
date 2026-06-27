"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SaveBrandState {
  ok?: boolean;
  error?: string;
}

interface BrandPayload {
  brand_name: string;
  personality: string[];
  tone: string;
  audience: string;
  values: string;
  example_content: string;
  style_rules: string;
  words_to_avoid: string;
}

async function upsertBrand(userId: string, payload: BrandPayload) {
  const supabase = await createClient();
  return supabase
    .from("brand_profiles")
    .upsert(
      { user_id: userId, ...payload, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
}

function parseBrand(formData: FormData): BrandPayload {
  return {
    brand_name: String(formData.get("brand_name") || "").trim(),
    personality: formData.getAll("personality").map(String),
    tone: String(formData.get("tone") || "").trim(),
    audience: String(formData.get("audience") || "").trim(),
    values: String(formData.get("values") || "").trim(),
    example_content: String(formData.get("example_content") || "").trim(),
    style_rules: String(formData.get("style_rules") || "").trim(),
    words_to_avoid: String(formData.get("words_to_avoid") || "").trim(),
  };
}

/** Save the brand profile (used by both onboarding and the Brand page). */
export async function saveBrand(
  _prev: SaveBrandState,
  formData: FormData,
): Promise<SaveBrandState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const payload = parseBrand(formData);
  const { error } = await upsertBrand(user.id, payload);
  if (error) return { error: error.message };

  revalidatePath("/brand");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Save brand profile AND mark onboarding complete (used by the wizard). */
export async function completeOnboarding(
  _prev: SaveBrandState,
  formData: FormData,
): Promise<SaveBrandState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const payload = parseBrand(formData);
  if (!payload.brand_name)
    return { error: "Please give your brand a name to continue." };

  const { error } = await upsertBrand(user.id, payload);
  if (error) return { error: error.message };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);
  if (profileError) return { error: profileError.message };

  revalidatePath("/", "layout");
  return { ok: true };
}
