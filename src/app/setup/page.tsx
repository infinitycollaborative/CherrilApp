import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Finish setup — Task Flow" };

const STEPS = [
  <>
    Create a free project at{" "}
    <span className="font-semibold text-brand-600">supabase.com</span>.
  </>,
  <>
    Run the SQL in{" "}
    <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-base">
      supabase/migrations/0001_init.sql
    </code>{" "}
    to create the tables, RLS policies, signup trigger and the seeded helper
    network.
  </>,
  <>
    Copy{" "}
    <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-base">
      .env.example
    </code>{" "}
    to{" "}
    <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-base">
      .env.local
    </code>{" "}
    and fill in your Supabase URL and anon key.
  </>,
  <>Restart the dev server and refresh this page.</>,
];

export default function SetupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-hero-gradient">
      <header className="p-5 sm:p-8">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 pb-20">
        <div className="card animate-fade-in">
          <span className="chip mb-3 border-2 border-brand-200 bg-brand-50 text-brand-700">
            ⚙️ One-time setup
          </span>
          <h1 className="text-h2">Connect Supabase to go live</h1>
          <p className="mt-2 text-lg text-ink-soft">
            Task Flow uses Supabase for sign-in and a Postgres database secured
            with Row Level Security. Add your project credentials and
            you&apos;re ready.
          </p>

          <ol className="mt-6 space-y-4 text-lg text-ink">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-base font-bold text-brand-700">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <Link href="/" className="btn-secondary mt-8 w-full">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
