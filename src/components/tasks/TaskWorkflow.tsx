"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { scheduleTask, setTaskStatus, cancelTask } from "@/app/actions/tasks";
import { payForTask } from "@/app/actions/payments";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  TIME_WINDOWS,
  PAYMENT_METHODS,
  SERVICE_FEE_RATE,
} from "@/lib/constants";
import type { Task, Tasker, Payment } from "@/lib/types";

export function TaskWorkflow({
  task,
  tasker,
  payment,
}: {
  task: Task;
  tasker: Tasker | null;
  payment: Payment | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [showPay, setShowPay] = useState(false);

  // scheduling
  const [date, setDate] = useState(task.scheduled_date || "");
  const [time, setTime] = useState(task.scheduled_time || TIME_WINDOWS[4]);

  // payment
  const defaultAmount = task.budget ?? (tasker ? tasker.hourly_rate * 2 : 30);
  const [amount, setAmount] = useState(String(defaultAmount));
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);

  async function run(fn: () => Promise<{ error?: string }>, success: string) {
    setBusy(true);
    const res = await fn();
    if (res?.error) {
      toast(res.error, "error");
      setBusy(false);
      return false;
    }
    toast(success, "success");
    setBusy(false);
    router.refresh();
    return true;
  }

  async function confirmSchedule() {
    await run(
      () => scheduleTask(task.id, date, time),
      "Your time is confirmed! 📅",
    );
  }

  async function pay() {
    const value = Number(amount);
    if (!value || value <= 0) {
      toast("Please enter a valid amount.", "error");
      return;
    }
    const ok = await run(
      () => payForTask(task.id, value, method),
      "Payment sent securely. Thank you! 🎉",
    );
    if (ok) setShowPay(false);
  }

  // ---- Completed: show receipt --------------------------------------------
  if (task.status === "completed") {
    return (
      <div className="rounded-2xl border-2 border-verified-200 bg-verified-50 p-6">
        <p className="text-2xl font-extrabold text-verified-700">
          🎉 Task completed
        </p>
        {payment && (
          <div className="mt-4 space-y-1.5 text-lg">
            <div className="flex justify-between">
              <span className="text-ink-soft">Paid to helper</span>
              <span className="font-semibold text-ink">
                {formatCurrency(payment.amount - payment.service_fee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Service fee</span>
              <span className="font-semibold text-ink">
                {formatCurrency(payment.service_fee)}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-verified-200 pt-1.5">
              <span className="font-bold text-ink">Total paid</span>
              <span className="font-bold text-ink">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            {payment.method && (
              <p className="pt-1 text-base text-ink-muted">
                Paid with {payment.method}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (task.status === "cancelled") {
    return (
      <div className="rounded-2xl border-2 border-surface-border bg-surface-overlay p-6 text-center">
        <p className="text-xl font-bold text-ink-soft">This task was cancelled.</p>
      </div>
    );
  }

  // ---- Payment view --------------------------------------------------------
  if (showPay) {
    const value = Number(amount) || 0;
    const fee = Math.round(value * SERVICE_FEE_RATE * 100) / 100;
    return (
      <div className="rounded-2xl border-2 border-surface-border bg-surface-raised p-6">
        <h3 className="text-h3">Confirm &amp; pay securely</h3>
        <p className="mt-1 text-lg text-ink-soft">
          You only pay now that the work is done. Your money is held safely and
          released to your helper.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label className="label" htmlFor="amount">
              Amount for your helper
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-ink-muted">
                $
              </span>
              <input
                id="amount"
                type="number"
                min="0"
                step="1"
                className="input pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="method">
              Payment method
            </label>
            <select
              id="method"
              className="select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-surface-overlay p-4 text-lg">
            <div className="flex justify-between">
              <span className="text-ink-soft">To your helper</span>
              <span className="font-semibold">{formatCurrency(value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">
                Service fee ({Math.round(SERVICE_FEE_RATE * 100)}%)
              </span>
              <span className="font-semibold">{formatCurrency(fee)}</span>
            </div>
            <div className="mt-1.5 flex justify-between border-t-2 border-surface-border pt-1.5">
              <span className="font-bold">Total</span>
              <span className="font-bold">{formatCurrency(value + fee)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={pay}
              disabled={busy}
              className="btn-verified btn-xl flex-1"
            >
              {busy && <Spinner className="h-5 w-5" />}
              🔒 Pay {formatCurrency(value + fee)} securely
            </button>
            <button
              onClick={() => setShowPay(false)}
              disabled={busy}
              className="btn-secondary"
            >
              Not yet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Matched: confirm a time --------------------------------------------
  if (task.status === "matched") {
    return (
      <div className="rounded-2xl border-2 border-surface-border bg-surface-raised p-6">
        <h3 className="text-h3">Confirm a time</h3>
        <p className="mt-1 text-lg text-ink-soft">
          {tasker ? `${tasker.name} is` : "Your helper is"} ready. Pick a day and
          time that works for you.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="sdate">
              Day
            </label>
            <input
              id="sdate"
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="stime">
              Time
            </label>
            <select
              id="stime"
              className="select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {TIME_WINDOWS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={confirmSchedule}
            disabled={busy}
            className="btn-primary btn-xl flex-1"
          >
            {busy && <Spinner className="h-5 w-5" />}
            📅 Confirm this time
          </button>
          <button
            onClick={() => run(() => cancelTask(task.id), "Task cancelled.")}
            disabled={busy}
            className="btn-ghost"
          >
            Cancel task
          </button>
        </div>
      </div>
    );
  }

  // ---- Scheduled / in progress: mark complete -----------------------------
  if (task.status === "scheduled" || task.status === "in_progress") {
    return (
      <div className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-6">
        <p className="text-xl font-bold text-brand-700">
          {task.status === "scheduled" ? "📅 All set!" : "⏳ Happening now"}
        </p>
        <p className="mt-1 text-lg text-ink-soft">
          {tasker ? tasker.name : "Your helper"} will help you
          {task.scheduled_date ? ` on ${formatDate(task.scheduled_date)}` : ""}
          {task.scheduled_time ? `, ${task.scheduled_time}` : ""}. When it&apos;s
          done, tap below to pay securely.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => setShowPay(true)}
            className="btn-verified btn-xl flex-1"
          >
            ✅ Task is done — pay helper
          </button>
          <button
            onClick={() => run(() => cancelTask(task.id), "Task cancelled.")}
            disabled={busy}
            className="btn-ghost"
          >
            Cancel task
          </button>
        </div>
      </div>
    );
  }

  // ---- Open: no workflow controls (pick a helper first), but allow cancel --
  return (
    <button
      onClick={() => run(() => setTaskStatus(task.id, "cancelled"), "Task cancelled.")}
      disabled={busy}
      className="btn-ghost"
    >
      Cancel this task
    </button>
  );
}
