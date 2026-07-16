import Link from "next/link";
import { requireProfile, getTasks, getTaskers } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { categoryMeta } from "@/lib/constants";
import { relativeDay } from "@/lib/format";
import type { TaskMessage } from "@/lib/types";

export const metadata = { title: "Messages — Task Flow" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const profile = await requireProfile();
  const tasks = await getTasks(profile.id);
  const conversations = tasks.filter((t) => t.tasker_id);

  // Latest message per conversation for a preview line.
  const supabase = await createClient();
  const ids = conversations.map((t) => t.id);
  const lastByTask: Record<string, TaskMessage> = {};
  if (ids.length > 0) {
    const { data } = await supabase
      .from("task_messages")
      .select("*")
      .in("task_id", ids)
      .order("created_at", { ascending: false });
    for (const m of (data as TaskMessage[]) ?? []) {
      if (!lastByTask[m.task_id]) lastByTask[m.task_id] = m;
    }
  }

  const taskers = await getTaskers();
  const taskerById = Object.fromEntries(taskers.map((t) => [t.id, t]));

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-h2">Messages</h1>
        <p className="mt-2 text-xl text-ink-soft">
          Your conversations with helpers, all in one safe place.
        </p>
      </div>

      {conversations.length > 0 ? (
        <div className="space-y-3">
          {conversations.map((t) => {
            const tasker = t.tasker_id ? taskerById[t.tasker_id] : null;
            const last = lastByTask[t.id];
            return (
              <Link
                key={t.id}
                href={`/tasks/${t.id}`}
                className="flex items-center gap-4 rounded-2xl border-2 border-surface-border bg-surface-raised p-5 transition-all hover:border-brand-300 hover:bg-surface-overlay"
              >
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-3xl"
                  aria-hidden
                >
                  {tasker?.emoji ?? categoryMeta(t.category).icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xl font-bold text-ink">
                      {tasker?.name ?? "Your helper"}
                    </p>
                    {last && (
                      <span className="shrink-0 text-base text-ink-muted">
                        {relativeDay(last.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-base text-ink-soft">
                    {categoryMeta(t.category).label} · {t.title}
                  </p>
                  {last && (
                    <p className="mt-0.5 truncate text-base text-ink-muted">
                      {last.sender === "senior" ? "You: " : ""}
                      {last.body}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-surface-border bg-surface-raised p-10 text-center">
          <div className="text-5xl" aria-hidden>
            💬
          </div>
          <p className="mt-3 text-xl font-bold text-ink">No messages yet</p>
          <p className="mt-1 text-lg text-ink-soft">
            When you post a task and choose a helper, you can chat with them
            right here.
          </p>
          <Link href="/tasks/new" className="btn-warm btn-xl mt-5 inline-flex">
            Post a Task
          </Link>
        </div>
      )}
    </div>
  );
}
