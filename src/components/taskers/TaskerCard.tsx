import Link from "next/link";
import { categoryMeta } from "@/lib/constants";
import { formatCurrency, starRating } from "@/lib/format";
import type { Tasker } from "@/lib/types";

export function VerifiedBadges({ tasker }: { tasker: Tasker }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tasker.background_checked && (
        <span className="chip bg-verified-50 text-verified-700">
          🛡️ Background-checked
        </span>
      )}
      {tasker.identity_verified && (
        <span className="chip bg-brand-50 text-brand-700">✓ ID verified</span>
      )}
      {tasker.references_count > 0 && (
        <span className="chip bg-surface-overlay text-ink-soft">
          📋 {tasker.references_count} references
        </span>
      )}
    </div>
  );
}

export function TaskerCard({ tasker }: { tasker: Tasker }) {
  return (
    <Link
      href={`/taskers/${tasker.id}`}
      className="flex flex-col gap-4 rounded-2xl border-2 border-surface-border bg-surface-raised p-6 transition-all hover:border-brand-300 hover:shadow-soft"
    >
      <div className="flex items-start gap-4">
        <span
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-50 text-4xl"
          aria-hidden
        >
          {tasker.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold text-ink">{tasker.name}</p>
          <p className="text-base text-ink-soft">{tasker.headline}</p>
          <p className="mt-1 text-base">
            <span className="text-warm-500" aria-hidden>
              {starRating(tasker.rating)}
            </span>{" "}
            <span className="font-semibold text-ink">{tasker.rating}</span>{" "}
            <span className="text-ink-muted">
              ({tasker.reviews_count} reviews)
            </span>
          </p>
        </div>
      </div>

      <VerifiedBadges tasker={tasker} />

      <div className="flex flex-wrap gap-1.5">
        {tasker.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="chip bg-surface-overlay text-ink-soft"
          >
            {categoryMeta(s).icon} {categoryMeta(s).label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t-2 border-surface-border pt-3">
        <span className="text-lg font-bold text-ink">
          {formatCurrency(tasker.hourly_rate)}
          <span className="text-base font-normal text-ink-muted">/hour</span>
        </span>
        <span className="text-lg font-bold text-brand-600">View profile →</span>
      </div>
    </Link>
  );
}
