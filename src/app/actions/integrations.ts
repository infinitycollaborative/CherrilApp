"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleIntegration(provider: string, connected: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("integrations")
    .upsert(
      { user_id: user.id, provider, connected },
      { onConflict: "user_id,provider" },
    );
  if (error) return { error: error.message };

  revalidatePath("/integrations");
  return { ok: true };
}
