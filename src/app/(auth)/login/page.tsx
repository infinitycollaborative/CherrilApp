"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { logIn, type AuthState } from "../actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { GoogleButton } from "@/components/auth/GoogleButton";

function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";
  const [state, action] = useActionState<AuthState, FormData>(logIn, {});

  return (
    <div className="card">
      <h1 className="text-h2">Welcome back</h1>
      <p className="mt-2 text-lg text-ink-soft">
        Log in to see your tasks and helpers.
      </p>

      <div className="mt-6">
        <GoogleButton label="Continue with Google" />
      </div>

      <div className="my-5 flex items-center gap-3 text-base text-ink-muted">
        <span className="h-0.5 flex-1 bg-surface-border" />
        or with email
        <span className="h-0.5 flex-1 bg-surface-border" />
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="redirect" value={redirect} />
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
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand-300 hover:text-brand-200"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input"
            placeholder="••••••••"
          />
        </div>

        {state.error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-xl bg-brand-50 px-4 py-3 text-base font-medium text-brand-700">
            {state.message}
          </p>
        )}

        <SubmitButton>Log in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-lg text-ink-soft">
        New to Task Flow?{" "}
        <Link href="/signup" className="font-bold text-brand-600">
          Create a free account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card h-96 skeleton" />}>
      <LoginForm />
    </Suspense>
  );
}
