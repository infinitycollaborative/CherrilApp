"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_FEE_RATE } from "@/lib/constants";
import type { TaskStatus } from "@/lib/types";

async function authUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/**
 * Confirm the task is complete and pay securely. Funds are "held" then
 * "released" to the helper — a transparent, escrow-style flow. The service
 * fee is shown to the user before they confirm.
 */
export async function payForTask(
  taskId: string,
  amount: number,
  method: string,
) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };
  if (!amount || amount <= 0) return { error: "Enter a valid amount." };

  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .single();
  if (!task) return { error: "Task not found." };

  const serviceFee = Math.round(amount * SERVICE_FEE_RATE * 100) / 100;

  const { error: payErr } = await supabase.from("payments").upsert(
    {
      task_id: taskId,
      user_id: user.id,
      tasker_id: task.tasker_id,
      amount,
      service_fee: serviceFee,
      status: "released",
      method,
    },
    { onConflict: "task_id" },
  );
  if (payErr) return { error: payErr.message };

  await supabase
    .from("tasks")
    .update({ status: "completed" as TaskStatus })
    .eq("id", taskId);

  await supabase.from("task_messages").insert({
    task_id: taskId,
    user_id: user.id,
    sender: "system",
    body: `Payment of $${amount.toFixed(
      2,
    )} sent securely and released to your helper. Thank you — your task is complete!`,
  });

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}
