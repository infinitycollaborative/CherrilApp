import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, BrandProfile } from "./types";

/**
 * Returns the authenticated user's profile, redirecting to /login when there
 * is no session. Use at the top of every protected Server Component.
 */
export async function requireProfile(): Promise<Profile> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect("/setup");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Profile row should be created by the DB trigger; fall back gracefully.
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata?.full_name as string) ?? null,
      company_name: (user.user_metadata?.company_name as string) ?? null,
      avatar_url: null,
      role: "user",
      status: "active",
      onboarding_completed: false,
      notify_product: true,
      notify_marketing: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (profile.status === "suspended") redirect("/suspended");

  return profile as Profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== "admin") redirect("/dashboard");
  return profile;
}

export async function getBrandProfile(
  userId: string,
): Promise<BrandProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as BrandProfile) ?? null;
}
