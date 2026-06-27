"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole, UserStatus } from "@/lib/types";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." as const };
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { error: "Admins only." as const };
  return { supabase, userId: user.id };
}

export async function setUserStatus(id: string, status: UserStatus) {
  const ctx = await assertAdmin();
  if ("error" in ctx) return ctx;
  if (id === ctx.userId)
    return { error: "You can't change your own status." };

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function setUserRole(id: string, role: UserRole) {
  const ctx = await assertAdmin();
  if ("error" in ctx) return ctx;
  if (id === ctx.userId)
    return { error: "You can't change your own role." };

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteUser(id: string) {
  const ctx = await assertAdmin();
  if ("error" in ctx) return ctx;
  if (id === ctx.userId)
    return { error: "You can't delete your own account here." };

  const admin = createAdminClient();
  if (!admin) {
    // Without the service role we can only remove the profile + owned data.
    await ctx.supabase.from("content_items").delete().eq("user_id", id);
    await ctx.supabase.from("brand_profiles").delete().eq("user_id", id);
    const { error } = await ctx.supabase.from("profiles").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    return {
      ok: true,
      message: "Profile removed. Set SUPABASE_SERVICE_ROLE_KEY to also delete the auth user.",
    };
  }

  await admin.from("profiles").delete().eq("id", id);
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
