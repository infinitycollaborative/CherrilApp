"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const full_name = String(formData.get("full_name") || "").trim();
  const company_name = String(formData.get("company_name") || "").trim();
  const avatar_url = String(formData.get("avatar_url") || "").trim() || null;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, company_name, avatar_url })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { ok: true, message: "Profile updated." };
}

export async function updateNotifications(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const notify_product = formData.get("notify_product") === "on";
  const notify_marketing = formData.get("notify_marketing") === "on";

  const { error } = await supabase
    .from("profiles")
    .update({ notify_product, notify_marketing })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { ok: true, message: "Notification preferences saved." };
}

export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { ok: true, message: "Password changed." };
}

export async function deleteAccount(): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Owned rows cascade from profiles/auth deletion, but remove app data
  // explicitly so it's gone even without the service role.
  await supabase.from("content_items").delete().eq("user_id", user.id);
  await supabase.from("brand_profiles").delete().eq("user_id", user.id);
  await supabase.from("integrations").delete().eq("user_id", user.id);

  const admin = createAdminClient();
  if (admin) {
    await admin.from("profiles").delete().eq("id", user.id);
    await admin.auth.admin.deleteUser(user.id);
  }

  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
