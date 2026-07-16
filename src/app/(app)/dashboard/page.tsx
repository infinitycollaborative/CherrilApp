import Link from "next/link";
import { requireProfile, getTasks } from "@/lib/data";
import { TaskCard } from "@/components/tasks/TaskCard";

export const metadata = { title: "Home — Task Flow" };
export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = ["open", "matched", "scheduled", "in_progress"];

export default async function DashboardPage() {
  const profile = await requireProfile();
  const tasks = await getTasks(profile.id);

  const firstName = (profile.full_name || "").split(" ")[0];
  const active = tasks.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const completed = tasks.filter((t) => t.status === "completed");
  const needsHelper = tasks.filter((t) => t.status === "open");

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-h2">
          Hello{firstName ? `, ${firstName}` : ""} 👋
        </h1>
        <p className="mt-2 text-xl text-ink-soft">
          What would you like help with today?
        </p>
      </div>

      {/* Primary call to action — always front and center */}
      <Link
        href="/tasks/new"
        className="block rounded-3xl bg-warm-gradient p-8 text-white shadow-soft transition-transform hover:-translate-y-0.5"
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-extrabold">Post a New Task</p>
            <p className="mt-1 text-lg text-warm-50">
              Tell us what you need — help is just a few taps away.
            </p>
          </div>
          <span className="btn btn-xl bg-white font-bold text-warm-600 hover:bg-warm-50">
            ➕ Get Help Now
          </span>
        </div>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { n: active.length, label: "Active tasks", icon: "📋" },
          { n: completed.length, label: "Completed", icon: "🎉" },
          { n: tasks.length, label: "Total posted", icon: "✨" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border-2 border-surface-border bg-surface-raised p-4 text-center sm:p-5"
          >
            <div className="text-3xl" aria-hidden>
              {s.icon}
            </div>
            <div className="mt-1 text-3xl font-extrabold text-brand-600">
              {s.n}
            </div>
            <div className="text-base text-ink-soft">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active tasks */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-h3">Your active tasks</h2>
          {tasks.length > 0 && (
            <Link
              href="/tasks"
              className="text-lg font-bold text-brand-600 hover:text-brand-700"
            >
              See all →
            </Link>
          )}
        </div>

        {active.length > 0 ? (
          <div className="mt-4 space-y-3">
            {active.slice(0, 4).map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-surface-border bg-surface-raised p-8 text-center">
            <div className="text-5xl" aria-hidden>
              🌟
            </div>
            <p className="mt-3 text-xl font-bold text-ink">
              You have no active tasks
            </p>
            <p className="mt-1 text-lg text-ink-soft">
              Posting your first task takes about two minutes.
            </p>
            <Link href="/tasks/new" className="btn-warm btn-xl mt-5 inline-flex">
              Post Your First Task
            </Link>
          </div>
        )}
      </section>

      {/* Helpful nudge */}
      {needsHelper.length > 0 && (
        <div className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-5">
          <p className="text-lg font-semibold text-brand-700">
            🔎 {needsHelper.length} task
            {needsHelper.length > 1 ? "s are" : " is"} waiting for you to pick a
            helper. Open a task to see who&apos;s available.
          </p>
        </div>
      )}

      {/* Explore helpers */}
      <section className="rounded-2xl border-2 border-surface-border bg-surface-raised p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3">Meet our verified helpers</h2>
            <p className="mt-1 text-lg text-ink-soft">
              Every helper is background-checked and comes with references.
            </p>
          </div>
          <Link href="/taskers" className="btn-secondary shrink-0">
            🤝 Browse helpers
          </Link>
        </div>
      </section>
    </div>
  );
}
