import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Finish setup — AI Sage" };

export default function SetupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-hero-gradient">
      <header className="p-5 sm:p-8">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 pb-20">
        <div className="card animate-fade-in">
          <span className="chip mb-3 border border-brand-400/30 bg-brand-500/10 text-brand-200">
            ⚙️ One-time setup
          </span>
          <h1 className="text-h2">Connect Supabase to go live</h1>
          <p className="mt-2 text-sm text-gray-400">
            AI Sage uses Supabase for authentication and a Postgres database
            secured with Row Level Security. Add your project credentials and
            you&apos;re ready.
          </p>

          <ol className="mt-6 space-y-4 text-sm text-gray-300">
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/20 text-xs text-brand-200">1</span>
              <span>
                Create a free project at{" "}
                <span className="text-brand-300">supabase.com</span>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/20 text-xs text-brand-200">2</span>
              <span>
                Run the SQL in{" "}
                <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-xs">
                  supabase/migrations/0001_init.sql
                </code>{" "}
                in the Supabase SQL editor to create tables, RLS policies and the
                signup trigger.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/20 text-xs text-brand-200">3</span>
              <span>
                Copy{" "}
                <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-xs">
                  .env.example
                </code>{" "}
                to{" "}
                <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-xs">
                  .env.local
                </code>{" "}
                and fill in your Supabase URL and anon key (optionally an
                Anthropic API key for full AI generation).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/20 text-xs text-brand-200">4</span>
              <span>Restart the dev server and refresh.</span>
            </li>
          </ol>

          <Link href="/" className="btn-secondary mt-8 w-full">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
