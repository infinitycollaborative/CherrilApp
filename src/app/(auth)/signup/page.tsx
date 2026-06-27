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
      <h1 className="text-h2">Create your account</h1>
      <p className="mt-1 text-sm text-gray-400">
        Start shipping on-brand content in minutes. No credit card required.
      </p>

      <div className="mt-6">
        <GoogleButton label="Sign up with Google" />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-surface-border" />
        or with email
        <span className="h-px flex-1 bg-surface-border" />
      </div>

      <form action={action} className="space-y-4">
        <div>
          <label className="label" htmlFor="full_name">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            className="input"
            placeholder="Alex Rivera"
          />
        </div>
        <div>
          <label className="label" htmlFor="company_name">
            Company name
          </label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            required
            className="input"
            placeholder="Acme SaaS"
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Work email
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
          <label className="label" htmlFor="password">
            Password
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
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-lg bg-brand-500/10 px-3 py-2 text-sm text-brand-200">
            {state.message}
          </p>
        )}

        <SubmitButton>Create free account</SubmitButton>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        By signing up you agree to our Terms & Privacy Policy.
      </p>
      <p className="mt-4 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-300">
          Log in
        </Link>
      </p>
    </div>
  );
}
