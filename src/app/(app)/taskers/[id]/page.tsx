import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, getTasker } from "@/lib/data";
import { VerifiedBadges } from "@/components/taskers/TaskerCard";
import { categoryMeta } from "@/lib/constants";
import { formatCurrency, starRating } from "@/lib/format";

export const dynamic = "force-dynamic";

// A couple of representative reviews per helper (illustrative for the demo).
const SAMPLE_REVIEWS = [
  {
    stars: 5,
    author: "Margaret W.",
    text: "So kind and patient. Arrived right on time and treated me with such respect. I felt completely at ease.",
  },
  {
    stars: 5,
    author: "Harold T.",
    text: "Dependable and thorough. Explained everything clearly and even followed up the next day. Highly recommend.",
  },
  {
    stars: 4,
    author: "Eleanor R.",
    text: "Lovely to work with and did a wonderful job. Will definitely ask for help again.",
  },
];

export default async function TaskerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireProfile();
  const { id } = await params;
  const tasker = await getTasker(id);
  if (!tasker) notFound();

  return (
    <div className="animate-fade-in space-y-6">
      <Link
        href="/taskers"
        className="inline-flex text-lg font-semibold text-brand-600 hover:text-brand-700"
      >
        ← Back to helpers
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span
            className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-brand-50 text-6xl"
            aria-hidden
          >
            {tasker.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-h2">{tasker.name}</h1>
            <p className="text-xl text-ink-soft">{tasker.headline}</p>
            <p className="mt-2 text-lg">
              <span className="text-warm-500" aria-hidden>
                {starRating(tasker.rating)}
              </span>{" "}
              <span className="font-bold text-ink">{tasker.rating}</span>{" "}
              <span className="text-ink-muted">
                ({tasker.reviews_count} reviews)
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-ink">
              {formatCurrency(tasker.hourly_rate)}
              <span className="text-lg font-normal text-ink-muted">/hr</span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <VerifiedBadges tasker={tasker} />
        </div>

        <Link href="/tasks/new" className="btn-warm btn-xl mt-6 w-full">
          ➕ Post a task &amp; request {tasker.name.split(" ")[0]}
        </Link>
        <p className="mt-2 text-center text-base text-ink-muted">
          ⏱️ {tasker.response_time}
        </p>
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { n: tasker.tasks_completed, label: "Tasks done" },
          { n: `${tasker.years_experience} yrs`, label: "Experience" },
          { n: tasker.references_count, label: "References" },
          { n: tasker.reviews_count, label: "Reviews" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border-2 border-surface-border bg-surface-raised p-4 text-center"
          >
            <div className="text-2xl font-extrabold text-brand-600">{s.n}</div>
            <div className="text-base text-ink-soft">{s.label}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <section className="card">
        <h2 className="text-h3">About {tasker.name.split(" ")[0]}</h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">{tasker.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tasker.languages.map((l) => (
            <span key={l} className="chip bg-surface-overlay text-ink-soft">
              🗣️ {l}
            </span>
          ))}
          <span className="chip bg-surface-overlay text-ink-soft">
            📍 {tasker.city}
          </span>
        </div>
      </section>

      {/* Skills */}
      <section className="card">
        <h2 className="text-h3">Can help with</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tasker.skills.map((s) => {
            const c = categoryMeta(s);
            return (
              <div
                key={s}
                className="flex items-center gap-3 rounded-2xl border-2 border-surface-border p-4"
              >
                <span className="text-3xl" aria-hidden>
                  {c.icon}
                </span>
                <div>
                  <p className="text-lg font-bold text-ink">{c.label}</p>
                  <p className="text-base text-ink-soft">{c.blurb}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="card">
        <h2 className="text-h3">What people say</h2>
        <div className="mt-4 space-y-4">
          {SAMPLE_REVIEWS.map((r) => (
            <figure
              key={r.author}
              className="rounded-2xl border-2 border-surface-border p-5"
            >
              <div className="text-warm-500" aria-hidden>
                {starRating(r.stars)}
              </div>
              <blockquote className="mt-2 text-lg text-ink">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-2 text-base font-semibold text-ink-soft">
                — {r.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border-2 border-verified-200 bg-verified-50 p-6 text-center">
        <p className="text-lg font-semibold text-verified-700">
          🛡️ Your safety comes first. Every helper passes a background check and
          identity verification before joining Task Flow.
        </p>
      </div>
    </div>
  );
}
