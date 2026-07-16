import Link from "next/link";
import { notFound } from "next/navigation";
import {
  requireProfile,
  getTask,
  getTasker,
  getTaskers,
  getTaskMessages,
  getPaymentForTask,
} from "@/lib/data";
import { suitableTaskers } from "@/lib/matching";
import {
  categoryMeta,
  STATUS_META,
  recurrenceLabel,
  urgencyMeta,
} from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/format";
import { TaskerPicker } from "@/components/tasks/TaskerPicker";
import { TaskWorkflow } from "@/components/tasks/TaskWorkflow";
import { MessageThread } from "@/components/tasks/MessageThread";
import { VerifiedBadges } from "@/components/taskers/TaskerCard";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireProfile();
  const { id } = await params;
  const task = await getTask(id, profile.id);
  if (!task) notFound();

  const cat = categoryMeta(task.category);
  const status = STATUS_META[task.status];
  const urgency = urgencyMeta(task.urgency);

  const [tasker, messages, payment] = await Promise.all([
    task.tasker_id ? getTasker(task.tasker_id) : Promise.resolve(null),
    getTaskMessages(task.id),
    getPaymentForTask(task.id),
  ]);

  const suggestions =
    task.status === "open"
      ? suitableTaskers(await getTaskers(), task.category, profile.city)
      : [];

  return (
    <div className="animate-fade-in space-y-6">
      <Link
        href="/tasks"
        className="inline-flex text-lg font-semibold text-brand-600 hover:text-brand-700"
      >
        ← Back to my tasks
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex items-start gap-4">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-50 text-4xl"
            aria-hidden
          >
            {cat.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-h3">{task.title}</h1>
            <p className="text-lg text-ink-soft">{cat.label}</p>
          </div>
          <span className={`chip shrink-0 ${status.className}`}>
            <span aria-hidden>{status.icon}</span> {status.label}
          </span>
        </div>

        <p className="mt-4 text-lg text-ink-soft">{status.hint}</p>

        <dl className="mt-5 grid gap-4 border-t-2 border-surface-border pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-base font-semibold text-ink-muted">When</dt>
            <dd className="text-lg text-ink">
              {formatDate(task.scheduled_date)}
              {task.scheduled_time ? ` · ${task.scheduled_time}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-base font-semibold text-ink-muted">How often</dt>
            <dd className="text-lg text-ink">
              {recurrenceLabel(task.recurrence)}
            </dd>
          </div>
          <div>
            <dt className="text-base font-semibold text-ink-muted">Urgency</dt>
            <dd>
              <span className={`chip ${urgency.className}`}>{urgency.label}</span>
            </dd>
          </div>
          <div>
            <dt className="text-base font-semibold text-ink-muted">Budget</dt>
            <dd className="text-lg text-ink">
              {task.budget ? formatCurrency(task.budget) : "Open to offers"}
            </dd>
          </div>
          {task.location && (
            <div className="sm:col-span-2">
              <dt className="text-base font-semibold text-ink-muted">Where</dt>
              <dd className="text-lg text-ink">{task.location}</dd>
            </div>
          )}
          {task.description && (
            <div className="sm:col-span-2">
              <dt className="text-base font-semibold text-ink-muted">Details</dt>
              <dd className="text-lg text-ink">{task.description}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Open → pick a helper */}
      {task.status === "open" && (
        <section>
          <h2 className="text-h3">Choose your helper</h2>
          <p className="mt-1 text-lg text-ink-soft">
            These verified helpers can assist with your task. Tap to ask one to
            help — they&apos;ll confirm right away.
          </p>
          <div className="mt-4">
            <TaskerPicker taskId={task.id} taskers={suggestions} />
          </div>
        </section>
      )}

      {/* Assigned helper */}
      {tasker && (
        <section className="card">
          <h2 className="text-h3">Your helper</h2>
          <div className="mt-4 flex items-start gap-4">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-verified-50 text-4xl"
              aria-hidden
            >
              {tasker.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold text-ink">{tasker.name}</p>
              <p className="text-base text-ink-soft">{tasker.headline}</p>
              <div className="mt-2">
                <VerifiedBadges tasker={tasker} />
              </div>
            </div>
            <Link
              href={`/taskers/${tasker.id}`}
              className="btn-secondary shrink-0"
            >
              Profile
            </Link>
          </div>
        </section>
      )}

      {/* Workflow: schedule / complete / pay */}
      <TaskWorkflow task={task} tasker={tasker} payment={payment} />

      {/* Messages */}
      <section className="card">
        <h2 className="text-h3">Messages</h2>
        <p className="mt-1 text-lg text-ink-soft">
          Chat safely with your helper here — no need to share your phone
          number.
        </p>
        <div className="mt-4">
          <MessageThread
            taskId={task.id}
            messages={messages}
            tasker={tasker}
            canSend={!!tasker}
          />
        </div>
      </section>
    </div>
  );
}
