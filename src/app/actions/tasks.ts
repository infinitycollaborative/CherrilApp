"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTaskers } from "@/lib/data";
import {
  suitableTaskers,
  availabilityMessage,
  matchSystemMessage,
} from "@/lib/matching";
import type { TaskCategory, Recurrence, Urgency, TaskStatus } from "@/lib/types";
import { categoryMeta } from "@/lib/constants";

async function authUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export interface CreateTaskInput {
  category: TaskCategory;
  title: string;
  description?: string;
  location?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  recurrence: Recurrence;
  urgency: Urgency;
  budget?: number | null;
}

export interface CreateTaskResult {
  id?: string;
  error?: string;
}

/**
 * The priority first-user action: post a task request. On success we mark
 * onboarding complete (their need is met) and return the new task id so the
 * client can navigate to it and pick a helper.
 */
export async function createTask(
  input: CreateTaskInput,
): Promise<CreateTaskResult> {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Please log in to post a task." };

  const title = input.title.trim() || categoryMeta(input.category).label;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      category: input.category,
      title,
      description: input.description?.trim() || null,
      location: input.location?.trim() || null,
      scheduled_date: input.scheduled_date || null,
      scheduled_time: input.scheduled_time || null,
      recurrence: input.recurrence,
      urgency: input.urgency,
      budget: input.budget ?? null,
      status: "open" as TaskStatus,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Opening line in the task thread so the page never looks empty.
  await supabase.from("task_messages").insert({
    task_id: data.id,
    user_id: user.id,
    sender: "system",
    body: "Task posted. We're finding trusted, background-checked helpers who can assist you.",
  });

  // First task met their need — onboarding is complete.
  await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { id: data.id };
}

/**
 * Request a specific helper. The verified tasker "confirms availability"
 * (simulated) so the whole flow works end-to-end without a live second user.
 */
export async function requestTasker(taskId: string, taskerId: string) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };

  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .single();
  if (!task) return { error: "Task not found." };

  const taskers = await getTaskers();
  const tasker = taskers.find((t) => t.id === taskerId);
  if (!tasker) return { error: "Helper not found." };

  const { error } = await supabase
    .from("tasks")
    .update({ tasker_id: taskerId, status: "matched" as TaskStatus })
    .eq("id", taskId);
  if (error) return { error: error.message };

  // System note + a warm confirmation "from" the tasker.
  await supabase.from("task_messages").insert([
    {
      task_id: taskId,
      user_id: user.id,
      sender: "system",
      body: matchSystemMessage(tasker),
    },
    {
      task_id: taskId,
      user_id: user.id,
      sender: "tasker",
      body: availabilityMessage(tasker, task),
    },
  ]);

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function scheduleTask(
  taskId: string,
  scheduledDate: string,
  scheduledTime: string,
) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("tasks")
    .update({
      scheduled_date: scheduledDate || null,
      scheduled_time: scheduledTime || null,
      status: "scheduled" as TaskStatus,
    })
    .eq("id", taskId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  await supabase.from("task_messages").insert({
    task_id: taskId,
    user_id: user.id,
    sender: "system",
    body: `Time confirmed. Your helper is all set${
      scheduledDate ? "" : ""
    }. You'll get a reminder before it's time.`,
  });

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function setTaskStatus(taskId: string, status: TaskStatus) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function cancelTask(taskId: string) {
  return setTaskStatus(taskId, "cancelled");
}

export async function deleteTask(taskId: string) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}
