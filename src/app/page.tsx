import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { PLATFORMS } from "@/lib/constants";

const FEATURES = [
  {
    icon: "🎯",
    title: "Brand Voice Enforcement",
    body: "Define your tone, style rules and words-to-avoid once. Every draft ships on-brand — automatically.",
  },
  {
    icon: "⚡",
    title: "Multi-Platform Generation",
    body: "One prompt becomes a blog post, LinkedIn update, X thread, newsletter, ad and website copy — each platform-optimized.",
  },
  {
    icon: "🔬",
    title: "Research & Outlining",
    body: "Get instant research summaries, keyword angles and structured outlines so you never start from a blank page.",
  },
  {
    icon: "✍️",
    title: "Editor + Revision History",
    body: "Refine with AI suggestions, track every version, and revert in one click when you change your mind.",
  },
  {
    icon: "📈",
    title: "Performance Insights",
    body: "Readability scores, sentiment and predicted engagement guide every piece toward better results.",
  },
  {
    icon: "🔌",
    title: "Connect Your Stack",
    body: "Push finished content straight to your calendar, scheduler and CMS without copy-paste busywork.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "AI Sage cut our content turnaround from 3 days to an afternoon. The brand voice is finally consistent across every channel.",
    name: "Priya N.",
    role: "Head of Content, fintech SaaS",
  },
  {
    quote:
      "I'm a team of one supporting five platforms. This is the first tool that actually made that feel sustainable.",
    name: "Marcus L.",
    role: "Content Marketing Manager",
  },
  {
    quote:
      "We doubled output without adding headcount. The research outlines alone save me hours every week.",
    name: "Dana K.",
    role: "Demand Gen Lead, B2B SaaS",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/mo",
    blurb: "For trying AI Sage on real work.",
    features: ["20 generations / mo", "1 brand profile", "All 6 platforms", "Revision history"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$39",
    cadence: "/mo",
    blurb: "For the working content manager.",
    features: [
      "Unlimited generations",
      "3 brand profiles",
      "Research & outlining",
      "Performance insights",
      "Integrations",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$99",
    cadence: "/mo",
    blurb: "For small content teams.",
    features: [
      "Everything in Pro",
      "5 seats included",
      "Shared brand library",
      "Roles & permissions",
      "Priority support",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-surface-border/60 bg-surface-base/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-gray-300 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#testimonials" className="hover:text-white">Customers</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="chip mx-auto mb-6 border border-brand-400/30 bg-brand-500/10 text-brand-200">
            ✦ AI writing assistant for B2B SaaS marketers
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            On-brand content across every channel,{" "}
            <span className="bg-gradient-to-r from-brand-300 to-accent bg-clip-text text-transparent">
              in minutes
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            AI Sage turns a single prompt into platform-perfect drafts — blog,
            LinkedIn, X, newsletter, ads and web copy — all enforcing your brand
            voice. Cut content creation time by up to 70%.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary px-7 py-3 text-base">
              Sign Up Free →
            </Link>
            <Link href="/login" className="btn-secondary px-7 py-3 text-base">
              Log in
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Free forever plan · No credit card · 2-minute setup
          </p>

          {/* Platform pills */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-2.5">
            {PLATFORMS.map((p) => (
              <span
                key={p.id}
                className="chip border border-surface-border bg-surface-raised/70 text-gray-300"
              >
                <span aria-hidden>{p.icon}</span> {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-surface-border/60 bg-surface-raised/40">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {[
            ["70%", "less time per piece"],
            ["6", "platforms, one prompt"],
            ["3×", "more content output"],
            ["100%", "brand-voice consistency"],
          ].map(([stat, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-brand-300">{stat}</div>
              <div className="mt-1 text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">Everything you need to scale content</h2>
          <p className="mt-3 text-gray-400">
            Built for the content manager juggling five platforms, tight
            deadlines and a brand that must stay consistent.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card transition-transform hover:-translate-y-1">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-h3">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="border-y border-surface-border/60 bg-surface-raised/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-h2">Loved by content teams</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card">
                <div className="text-accent">★★★★★</div>
                <blockquote className="mt-3 text-sm leading-relaxed text-gray-200">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-white">{t.name}</span>
                  <span className="block text-gray-500">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">Simple, scalable pricing</h2>
          <p className="mt-3 text-gray-400">Start free. Upgrade when you scale.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRICING.map((p) => (
            <div
              key={p.name}
              className={`card flex flex-col ${
                p.highlight
                  ? "border-brand-400/60 shadow-glow ring-1 ring-brand-400/40"
                  : ""
              }`}
            >
              {p.highlight && (
                <span className="chip mb-3 w-fit bg-brand-500/20 text-brand-200">
                  Most popular
                </span>
              )}
              <h3 className="text-h3">{p.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="mb-1 text-gray-500">{p.cadence}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{p.blurb}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <span className="text-accent">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-6 ${p.highlight ? "btn-primary" : "btn-secondary"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="card overflow-hidden bg-brand-gradient text-center">
          <div className="px-6 py-14">
            <h2 className="text-h2 text-white">
              Ready to reclaim 15 hours a week?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-50/90">
              Set up your brand voice in two minutes and generate your first
              on-brand draft today.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-flex bg-white px-7 py-3 text-base font-semibold text-brand-700 btn"
            >
              Sign Up Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo href="/" />
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI Sage. Built for content marketers.
          </p>
        </div>
      </footer>
    </div>
  );
}
