import Link from "next/link";
import { requireProfile, getTaskers } from "@/lib/data";
import { TaskerCard } from "@/components/taskers/TaskerCard";
import { CATEGORIES, categoryMeta } from "@/lib/constants";
import type { TaskCategory } from "@/lib/types";

export const metadata = { title: "Find Helpers — Task Flow" };
export const dynamic = "force-dynamic";

export default async function TaskersPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>;
}) {
  await requireProfile();
  const taskers = await getTaskers();
  const { skill } = await searchParams;

  const filtered = skill
    ? taskers.filter((t) => t.skills.includes(skill as TaskCategory))
    : taskers;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-h2">Our verified helpers</h1>
        <p className="mt-2 text-xl text-ink-soft">
          Every helper is background-checked, identity-verified, and comes with
          real references. Browse and get to know them.
        </p>
      </div>

      {/* Skill filter */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/taskers"
          className={`chip border-2 ${
            !skill
              ? "border-brand-500 bg-brand-100 text-brand-700"
              : "border-surface-border bg-surface-raised text-ink-soft hover:bg-surface-overlay"
          }`}
        >
          All helpers
        </Link>
        {CATEGORIES.map((c) => {
          const active = skill === c.id;
          return (
            <Link
              key={c.id}
              href={`/taskers?skill=${c.id}`}
              className={`chip border-2 ${
                active
                  ? "border-brand-500 bg-brand-100 text-brand-700"
                  : "border-surface-border bg-surface-raised text-ink-soft hover:bg-surface-overlay"
              }`}
            >
              {c.icon} {c.label}
            </Link>
          );
        })}
      </div>

      {skill && (
        <p className="text-lg text-ink-soft">
          Showing helpers for{" "}
          <strong className="text-ink">{categoryMeta(skill as TaskCategory).label}</strong>
        </p>
      )}

      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((t) => (
            <TaskerCard key={t.id} tasker={t} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-surface-border bg-surface-raised p-10 text-center">
          <p className="text-xl font-bold text-ink">No helpers found here yet</p>
          <p className="mt-1 text-lg text-ink-soft">
            Try another category, or post a task and we&apos;ll find someone for
            you.
          </p>
        </div>
      )}

      <div className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-6 text-center">
        <p className="text-lg text-brand-700">
          Ready for help? The quickest way is to{" "}
          <Link href="/tasks/new" className="font-bold underline">
            post a task
          </Link>{" "}
          — we&apos;ll match you with the best available helper.
        </p>
      </div>
    </div>
  );
}
