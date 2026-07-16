import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Tasker, Task, TaskMessage, Payment } from "./types";

function envReady() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Returns the authenticated user's profile, redirecting to /login when there
 * is no session. Use at the top of every protected Server Component.
 */
export async function requireProfile(): Promise<Profile> {
  if (!envReady()) redirect("/setup");

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
    // Profile row is normally created by the DB trigger; fall back gracefully.
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata?.full_name as string) ?? null,
      phone: null,
      city: null,
      account_type: "senior",
      avatar_url: null,
      role: "member",
      status: "active",
      onboarding_completed: false,
      emergency_contact: null,
      notify_sms: true,
      notify_email: true,
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

// ---------------------------------------------------------------------------
// Read helpers
// ---------------------------------------------------------------------------

export async function getTaskers(): Promise<Tasker[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("taskers")
    .select("*")
    .order("rating", { ascending: false });
  return (data as Tasker[]) ?? [];
}

export async function getTasker(id: string): Promise<Tasker | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("taskers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Tasker) ?? null;
}

export async function getTasks(userId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as Task[]) ?? [];
}

export async function getTask(
  id: string,
  userId: string,
): Promise<Task | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Task) ?? null;
}

export async function getTaskMessages(taskId: string): Promise<TaskMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("task_messages")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  return (data as TaskMessage[]) ?? [];
}

export async function getPaymentForTask(
  taskId: string,
): Promise<Payment | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("task_id", taskId)
    .maybeSingle();
  return (data as Payment) ?? null;
}
