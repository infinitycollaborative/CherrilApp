import Link from "next/link";
import { requireProfile, getTasks } from "@/lib/data";
import { TaskCard } from "@/components/tasks/TaskCard";

export const metadata = { title: "My Tasks — Task Flow" };
export const dynamic = "force-dynamic";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const ACTIVE = ["open", "matched", "scheduled", "in_progress"];

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const profile = await requireProfile();
  const tasks = await getTasks(profile.id);
  const { filter = "all" } = await searchParams;

  const filtered = tasks.filter((t) => {
    if (filter === "active") return ACTIVE.includes(t.status);
    if (filter === "completed") return t.status === "completed";
    if (filter === "cancelled") return t.status === "cancelled";
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2">My Tasks</h1>
          <p className="mt-1 text-xl text-ink-soft">
            Everything you&apos;ve asked for help with.
          </p>
        </div>
        <Link href="/tasks/new" className="btn-warm shrink-0">
          ➕ Post a Task
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <Link
              key={f.id}
              href={f.id === "all" ? "/tasks" : `/tasks?filter=${f.id}`}
              className={`chip border-2 ${
                active
                  ? "border-brand-500 bg-brand-100 text-brand-700"
                  : "border-surface-border bg-surface-raised text-ink-soft hover:bg-surface-overlay"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-surface-border bg-surface-raised p-10 text-center">
          <div className="text-5xl" aria-hidden>
            📋
          </div>
          <p className="mt-3 text-xl font-bold text-ink">No tasks here yet</p>
          <p className="mt-1 text-lg text-ink-soft">
            When you post a task, it will show up on this page.
          </p>
          <Link href="/tasks/new" className="btn-warm btn-xl mt-5 inline-flex">
            Post a Task
          </Link>
        </div>
      )}
    </div>
  );
}
