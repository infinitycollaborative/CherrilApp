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
      <p className="mt-1 text-sm text-gray-400">
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
            placeholder="you@company.com"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
            {state.message}
          </p>
        )}

        <SubmitButton>Send reset link</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand-300">
          Back to login
        </Link>
      </p>
    </div>
  );
}
