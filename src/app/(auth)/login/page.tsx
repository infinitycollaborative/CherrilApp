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
      <p className="mt-1 text-sm text-gray-400">
        Log in to keep your content on-brand.
      </p>

      <div className="mt-6">
        <GoogleButton label="Continue with Google" />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-surface-border" />
        or with email
        <span className="h-px flex-1 bg-surface-border" />
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
            placeholder="you@company.com"
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
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-lg bg-brand-500/10 px-3 py-2 text-sm text-brand-200">
            {state.message}
          </p>
        )}

        <SubmitButton>Log in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        New to AI Sage?{" "}
        <Link href="/signup" className="font-semibold text-brand-300">
          Sign up free
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
