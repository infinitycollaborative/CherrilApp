"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTaskers } from "@/lib/data";

async function authUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** A short, friendly auto-reply so conversations feel responsive in the demo. */
function taskerReply(taskerName: string): string {
  const options = [
    `Thank you — got it! I'll take care of that. — ${taskerName}`,
    `Sounds good. I've noted that down and I'm all set on my end.`,
    `Perfect, thank you for letting me know. See you then!`,
    `No problem at all. I'll make sure it's done just the way you like.`,
  ];
  return options[Math.floor(Math.random() * options.length)];
}

export async function sendMessage(taskId: string, body: string) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };
  const text = body.trim();
  if (!text) return { error: "Please type a message first." };

  const { data: task } = await supabase
    .from("tasks")
    .select("tasker_id")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .single();
  if (!task) return { error: "Task not found." };

  await supabase.from("task_messages").insert({
    task_id: taskId,
    user_id: user.id,
    sender: "senior",
    body: text,
  });

  // If a helper is assigned, simulate a warm reply from them.
  if (task.tasker_id) {
    const taskers = await getTaskers();
    const tasker = taskers.find((t) => t.id === task.tasker_id);
    if (tasker) {
      await supabase.from("task_messages").insert({
        task_id: taskId,
        user_id: user.id,
        sender: "tasker",
        body: taskerReply(tasker.name),
      });
    }
  }

  revalidatePath(`/tasks/${taskId}`);
  return { ok: true };
}
