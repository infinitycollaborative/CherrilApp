"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "../actions";
import { SubmitButton } from "@/components/auth/SubmitButton";

export default function ForgotPasswordPage() {
  const [state, action] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    {},
  );

  return (
    <div className="card">
      <h1 className="text-h2">Reset your password</h1>
      <p className="mt-2 text-lg text-ink-soft">
        Enter your email and we&apos;ll send you a secure reset link.
      </p>

      <form action={action} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input"
            placeholder="you@email.com"
          />
        </div>

        {state.error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-xl bg-verified-50 px-4 py-3 text-base font-medium text-verified-700">
            {state.message}
          </p>
        )}

        <SubmitButton>Send reset link</SubmitButton>
      </form>

      <p className="mt-6 text-center text-lg text-ink-soft">
        Remembered it?{" "}
        <Link href="/login" className="font-bold text-brand-600">
          Back to login
        </Link>
      </p>
    </div>
  );
}
