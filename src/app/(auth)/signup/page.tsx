"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "../actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function SignupPage() {
  const [state, action] = useActionState<AuthState, FormData>(signUp, {});

  return (
    <div className="card">
      <h1 className="text-h2">Create your free account</h1>
      <p className="mt-2 text-lg text-ink-soft">
        It only takes a minute. No credit card required.
      </p>

      <div className="mt-6">
        <GoogleButton label="Sign up with Google" />
      </div>

      <div className="my-5 flex items-center gap-3 text-base text-ink-muted">
        <span className="h-0.5 flex-1 bg-surface-border" />
        or with email
        <span className="h-0.5 flex-1 bg-surface-border" />
      </div>

      <form action={action} className="space-y-4">
        <div>
          <label className="label" htmlFor="full_name">
            Your name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            className="input"
            placeholder="Dorothy Miller"
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone number{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="input"
            placeholder="(813) 555-0142"
          />
          <p className="help-text">
            So your helper can reach you if needed. We never share it publicly.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email address
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
          <label className="label" htmlFor="password">
            Create a password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="input"
            placeholder="At least 8 characters"
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

        <SubmitButton>Create my account</SubmitButton>
      </form>

      <p className="mt-4 text-center text-base text-ink-muted">
        By signing up you agree to our Terms &amp; Privacy Policy.
      </p>
      <p className="mt-4 text-center text-lg text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-brand-600">
          Log in
        </Link>
      </p>
    </div>
  );
}
