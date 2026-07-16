import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CATEGORIES } from "@/lib/constants";

const STEPS = [
  {
    icon: "📝",
    title: "1. Post your task",
    body: "Tell us what you need in a minute or two — groceries, a ride, a small repair. No long forms.",
  },
  {
    icon: "🤝",
    title: "2. Pick a trusted helper",
    body: "We instantly show background-checked, verified helpers near you who are available and ready.",
  },
  {
    icon: "🎉",
    title: "3. Relax — it's handled",
    body: "Message your helper, confirm the time, and pay securely in the app only when it's done.",
  },
];

const FEATURES = [
  {
    icon: "🛡️",
    title: "Verified helper network",
    body: "Every helper is background-checked, identity-verified and comes with real references. You choose who helps you.",
  },
  {
    icon: "⚡",
    title: "Help in minutes, not hours",
    body: "Stop the endless phone calls and texts. Post once and get availability confirmed right away.",
  },
  {
    icon: "🔒",
    title: "Safe messages & payment",
    body: "Chat and pay all in one place. Your money is held securely and only released when your task is done.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b-2 border-surface-border bg-surface-raised/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-lg font-semibold text-ink-soft md:flex">
            <a href="#how" className="hover:text-ink">
              How it works
            </a>
            <a href="#tasks" className="hover:text-ink">
              What we help with
            </a>
            <a href="#trust" className="hover:text-ink">
              Safety
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="chip mx-auto mb-6 border-2 border-verified-200 bg-verified-50 text-verified-700">
            🛡️ Background-checked, verified local helpers
          </span>
          <h1 className="mx-auto max-w-3xl text-h1">
            Trusted help for everyday tasks,{" "}
            <span className="text-brand-600">whenever you need it</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-ink-soft">
            Finding reliable help shouldn&apos;t take hours of phone calls and
            worry. With Task Flow, post what you need and connect with a trusted,
            verified helper near you — in just a few minutes.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-warm btn-xl w-full sm:w-auto">
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/login"
              className="btn-secondary btn-xl w-full sm:w-auto"
            >
              I already have an account
            </Link>
          </div>
          <p className="mt-5 text-lg text-ink-muted">
            No credit card needed · Set up in 2 minutes · Cancel anytime
          </p>
        </div>
      </section>

      {/* The problem we solve */}
      <section className="border-y-2 border-surface-border bg-surface-raised">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-h2">Sound familiar?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-ink-soft">
            Many older adults spend{" "}
            <strong className="text-ink">3 to 5 hours every week</strong> —
            across phone calls, texts and messages — just trying to find someone
            trustworthy and available to help with everyday tasks. It&apos;s
            stressful, and no one should feel like a burden asking for a hand.
          </p>
          <p className="mt-5 text-xl font-semibold text-brand-600">
            Task Flow turns all of that into a few simple taps.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">How Task Flow works</h2>
          <p className="mt-3 text-xl text-ink-soft">
            Three easy steps. That&apos;s all it takes.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="card text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-4xl">
                {s.icon}
              </div>
              <h3 className="mt-5 text-h3">{s.title}</h3>
              <p className="mt-2 text-lg text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we help with */}
      <section
        id="tasks"
        className="border-y-2 border-surface-border bg-surface-raised"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2">What can we help with?</h2>
            <p className="mt-3 text-xl text-ink-soft">
              From a quick grocery run to a ride to the doctor — we&apos;ve got
              you covered.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-surface-border bg-surface-base p-5 text-center"
              >
                <span className="text-4xl" aria-hidden>
                  {c.icon}
                </span>
                <span className="text-lg font-bold text-ink">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & safety */}
      <section id="trust" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">Built on trust and safety</h2>
          <p className="mt-3 text-xl text-ink-soft">
            Your peace of mind comes first.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="text-5xl" aria-hidden>
                {f.icon}
              </div>
              <h3 className="mt-4 text-h3">{f.title}</h3>
              <p className="mt-2 text-lg text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="card overflow-hidden bg-brand-gradient text-center">
          <div className="px-6 py-14">
            <h2 className="text-h2 text-white">
              Ready to get a little help?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xl text-brand-50">
              Create your free account and post your first task today. It only
              takes a couple of minutes.
            </p>
            <Link
              href="/signup"
              className="btn btn-xl mt-8 inline-flex bg-white px-8 font-bold text-brand-700 hover:bg-brand-50"
            >
              Get Started — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-surface-border bg-surface-raised">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
          <Logo href="/" />
          <p className="text-lg text-ink-muted">
            © {new Date().getFullYear()} Task Flow. Helping neighbors help each
            other.
          </p>
        </div>
      </footer>
    </div>
  );
}
