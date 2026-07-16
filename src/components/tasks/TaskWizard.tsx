"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/app/actions/tasks";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import {
  CATEGORIES,
  TIME_WINDOWS,
  RECURRENCES,
  URGENCIES,
  categoryMeta,
} from "@/lib/constants";
import type { TaskCategory, Recurrence, Urgency } from "@/lib/types";

const STEP_LABELS = ["What you need", "The details", "When & budget"];

export function TaskWizard({ firstTime = false }: { firstTime?: boolean }) {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState<TaskCategory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("flexible");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState(TIME_WINDOWS[4]);
  const [recurrence, setRecurrence] = useState<Recurrence>("once");
  const [budget, setBudget] = useState("");

  function chooseCategory(id: TaskCategory) {
    setCategory(id);
    if (!title) setTitle(categoryMeta(id).label);
    setStep(1);
  }

  function next() {
    if (step === 0 && !category) {
      toast("Please choose what you need help with.", "error");
      return;
    }
    if (step === 1 && !title.trim()) {
      toast("Please give your task a short title.", "error");
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!category) return;
    setSubmitting(true);
    const result = await createTask({
      category,
      title,
      description,
      location,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      recurrence,
      urgency,
      budget: budget ? Number(budget) : null,
    });
    if (result.error || !result.id) {
      toast(result.error || "Something went wrong. Please try again.", "error");
      setSubmitting(false);
      return;
    }
    toast("Your task was posted! Finding helpers for you…", "success");
    router.push(`/tasks/${result.id}`);
  }

  return (
    <div>
      {/* Progress */}
      <ol className="mb-8 flex items-center gap-2" aria-label="Progress">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <div
              className={`h-2.5 rounded-full transition-colors ${
                i <= step ? "bg-brand-500" : "bg-surface-border"
              }`}
            />
            <span
              className={`text-base font-semibold ${
                i === step ? "text-brand-700" : "text-ink-muted"
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {/* Step 1 — category */}
      {step === 0 && (
        <div className="animate-fade-in">
          <h2 className="text-h3">What do you need help with?</h2>
          <p className="mt-1 text-lg text-ink-soft">
            Tap the kind of task below. You can add details next.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => chooseCategory(c.id)}
                  className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                    active
                      ? "border-brand-500 bg-brand-50 shadow-glow"
                      : "border-surface-border bg-surface-raised hover:border-brand-300 hover:bg-surface-overlay"
                  }`}
                >
                  <span className="text-4xl" aria-hidden>
                    {c.icon}
                  </span>
                  <span>
                    <span className="block text-xl font-bold text-ink">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block text-base text-ink-soft">
                      {c.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2 — details */}
      {step === 1 && category && (
        <div className="animate-fade-in space-y-6">
          <div>
            <h2 className="text-h3">Tell us a little more</h2>
            <p className="mt-1 text-lg text-ink-soft">
              {categoryMeta(category).icon} {categoryMeta(category).label}
            </p>
          </div>
          <div>
            <label className="label" htmlFor="title">
              What do you need done?
            </label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly grocery shopping"
            />
          </div>
          <div>
            <label className="label" htmlFor="description">
              Any details for your helper?{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I usually shop at Publix on Main St. I'll have a list ready. Please ring the doorbell twice."
            />
            <p className="help-text">
              Examples: {categoryMeta(category).examples}
            </p>
          </div>
          <div>
            <label className="label" htmlFor="location">
              Where should it happen?{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="location"
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. My home, 123 Oak Street"
            />
          </div>
        </div>
      )}

      {/* Step 3 — when & budget + review */}
      {step === 2 && category && (
        <div className="animate-fade-in space-y-6">
          <div>
            <h2 className="text-h3">When would you like this?</h2>
            <p className="mt-1 text-lg text-ink-soft">
              Pick what suits you. Helpers will confirm they&apos;re available.
            </p>
          </div>

          <fieldset>
            <legend className="label">How soon do you need it?</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {URGENCIES.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUrgency(u.id)}
                  className={`rounded-2xl border-2 p-4 text-left transition-all ${
                    urgency === u.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-surface-border hover:bg-surface-overlay"
                  }`}
                >
                  <span className="block text-lg font-bold text-ink">
                    {u.label}
                  </span>
                  <span className="mt-0.5 block text-base text-ink-soft">
                    {u.hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="date">
                Preferred day{" "}
                <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <input
                id="date"
                type="date"
                className="input"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="time">
                Preferred time
              </label>
              <select
                id="time"
                className="select"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              >
                {TIME_WINDOWS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="label">How often?</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {RECURRENCES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRecurrence(r.id)}
                  className={`rounded-2xl border-2 p-4 text-center transition-all ${
                    recurrence === r.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-surface-border hover:bg-surface-overlay"
                  }`}
                >
                  <span className="block text-lg font-bold text-ink">
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="label" htmlFor="budget">
              What can you pay?{" "}
              <span className="font-normal text-ink-muted">
                (optional, in dollars)
              </span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-ink-muted">
                $
              </span>
              <input
                id="budget"
                type="number"
                min="0"
                step="1"
                className="input pl-8"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="30"
              />
            </div>
            <p className="help-text">
              You only pay after the task is done, and always through the app.
            </p>
          </div>

          {/* Review */}
          <div className="rounded-2xl border-2 border-surface-border bg-surface-overlay p-5">
            <h3 className="text-lg font-bold text-ink">Quick review</h3>
            <dl className="mt-3 space-y-1.5 text-lg">
              <div className="flex gap-2">
                <dt className="font-semibold text-ink-soft">Task:</dt>
                <dd className="text-ink">
                  {categoryMeta(category).icon} {title || categoryMeta(category).label}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-ink-soft">When:</dt>
                <dd className="text-ink">
                  {scheduledDate ? `${scheduledDate}, ` : ""}
                  {scheduledTime}
                  {recurrence !== "once"
                    ? ` · ${RECURRENCES.find((r) => r.id === recurrence)?.label}`
                    : ""}
                </dd>
              </div>
              {budget && (
                <div className="flex gap-2">
                  <dt className="font-semibold text-ink-soft">Budget:</dt>
                  <dd className="text-ink">${budget}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={back} className="btn-secondary">
            ← Back
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {step < 2 ? (
          <button type="button" onClick={next} className="btn-primary">
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="btn-warm btn-xl"
          >
            {submitting && <Spinner className="h-5 w-5" />}
            {firstTime ? "Post My First Task" : "Post This Task"}
          </button>
        )}
      </div>
    </div>
  );
}
