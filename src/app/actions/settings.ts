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
  const phone = String(formData.get("phone") || "").trim() || null;
  const city = String(formData.get("city") || "").trim() || null;
  const emergency_contact =
    String(formData.get("emergency_contact") || "").trim() || null;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, phone, city, emergency_contact })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { ok: true, message: "Your details were saved." };
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

  const notify_sms = formData.get("notify_sms") === "on";
  const notify_email = formData.get("notify_email") === "on";

  const { error } = await supabase
    .from("profiles")
    .update({ notify_sms, notify_email })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { ok: true, message: "Notification choices saved." };
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
  if (password !== confirm) return { error: "The two passwords don't match." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { ok: true, message: "Your password was changed." };
}

export async function deleteAccount(): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Remove app data explicitly so it's gone even without the service role.
  await supabase.from("payments").delete().eq("user_id", user.id);
  await supabase.from("task_messages").delete().eq("user_id", user.id);
  await supabase.from("tasks").delete().eq("user_id", user.id);

  const admin = createAdminClient();
  if (admin) {
    await admin.from("profiles").delete().eq("id", user.id);
    await admin.auth.admin.deleteUser(user.id);
  }

  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
