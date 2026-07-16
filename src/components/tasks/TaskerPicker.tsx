"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestTasker } from "@/app/actions/tasks";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import { VerifiedBadges } from "@/components/taskers/TaskerCard";
import { formatCurrency, starRating } from "@/lib/format";
import type { Tasker } from "@/lib/types";

export function TaskerPicker({
  taskId,
  taskers,
}: {
  taskId: string;
  taskers: Tasker[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, setPending] = useState<string | null>(null);

  async function request(tasker: Tasker) {
    setPending(tasker.id);
    const res = await requestTasker(taskId, tasker.id);
    if (res.error) {
      toast(res.error, "error");
      setPending(null);
      return;
    }
    toast(`${tasker.name} confirmed they can help! 🎉`, "success");
    router.refresh();
  }

  if (taskers.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-surface-border bg-surface-overlay p-6 text-center">
        <p className="text-lg text-ink-soft">
          We&apos;re still finding helpers for this task. Please check back
          shortly — we&apos;ll notify you as soon as someone is available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {taskers.map((t) => (
        <div
          key={t.id}
          className="rounded-2xl border-2 border-surface-border bg-surface-raised p-5"
        >
          <div className="flex items-start gap-4">
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-3xl"
              aria-hidden
            >
              {t.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold text-ink">{t.name}</p>
              <p className="text-base text-ink-soft">{t.headline}</p>
              <p className="mt-1 text-base">
                <span className="text-warm-500" aria-hidden>
                  {starRating(t.rating)}
                </span>{" "}
                <span className="font-semibold text-ink">{t.rating}</span>{" "}
                <span className="text-ink-muted">
                  · {t.tasks_completed} tasks done ·{" "}
                  {formatCurrency(t.hourly_rate)}/hr
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3">
            <VerifiedBadges tasker={t} />
          </div>
          <p className="mt-2 text-base text-ink-muted">⏱️ {t.response_time}</p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => request(t)}
              disabled={pending !== null}
              className="btn-verified flex-1"
            >
              {pending === t.id && <Spinner className="h-5 w-5" />}
              Ask {t.name.split(" ")[0]} to help
            </button>
            <a
              href={`/taskers/${t.id}`}
              className="btn-secondary flex-1 sm:flex-none"
            >
              View profile
            </a>
          </div>
        </div>
      ))}
      <p className="px-1 text-base text-ink-muted">
        These verified helpers are skilled in your task and ranked by rating and
        reliability. When you ask one to help, they&apos;ll confirm right away.
      </p>
    </div>
  );
}
