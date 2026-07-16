import Link from "next/link";
import { categoryMeta, STATUS_META, recurrenceLabel } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Task } from "@/lib/types";

export function TaskCard({ task }: { task: Task }) {
  const cat = categoryMeta(task.category);
  const status = STATUS_META[task.status];

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="flex items-center gap-4 rounded-2xl border-2 border-surface-border bg-surface-raised p-5 transition-all hover:border-brand-300 hover:bg-surface-overlay"
    >
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-3xl"
        aria-hidden
      >
        {cat.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-bold text-ink">{task.title}</p>
        <p className="mt-0.5 text-base text-ink-soft">
          {formatDate(task.scheduled_date)}
          {task.recurrence !== "once" && (
            <> · {recurrenceLabel(task.recurrence)}</>
          )}
        </p>
      </div>
      <span className={`chip shrink-0 ${status.className}`}>
        <span aria-hidden>{status.icon}</span>
        <span className="hidden sm:inline">{status.label}</span>
      </span>
    </Link>
  );
}
