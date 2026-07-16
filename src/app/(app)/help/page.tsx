import Link from "next/link";
import { requireProfile } from "@/lib/data";

export const metadata = { title: "Help — Task Flow" };
export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: "➕",
    title: "1. Post a task",
    body: "Tap the orange “Post a New Task” button. Choose what you need, add a few details, and pick a time. That's it!",
  },
  {
    icon: "🤝",
    title: "2. Choose a helper",
    body: "We'll show you trusted, background-checked helpers. Tap “Ask to help” next to the one you like.",
  },
  {
    icon: "💬",
    title: "3. Message them",
    body: "Chat safely in the app to share any details. You never have to give out your phone number.",
  },
  {
    icon: "🔒",
    title: "4. Pay when it's done",
    body: "Once your task is finished, pay securely in the app. Your money is only released when you're happy.",
  },
];

const FAQ = [
  {
    q: "Are the helpers safe and trustworthy?",
    a: "Yes. Every helper passes a background check and identity verification, and comes with references, before they can join Task Flow.",
  },
  {
    q: "When do I have to pay?",
    a: "Only after your task is complete. You choose the amount and pay securely through the app — never with cash at the door.",
  },
  {
    q: "What if I need to cancel?",
    a: "You can cancel any task at any time from the task's page. Just open the task and tap “Cancel task”.",
  },
  {
    q: "Do I need to be good with technology?",
    a: "Not at all. Task Flow is built to be simple, with large text and big buttons. If you can tap a button, you can use Task Flow.",
  },
  {
    q: "Can someone help me set things up?",
    a: "Absolutely. A family member or friend can help you post your first task — after that, it's easy to do on your own.",
  },
];

export default async function HelpPage() {
  await requireProfile();

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-h2">Help &amp; support</h1>
        <p className="mt-2 text-xl text-ink-soft">
          We&apos;re here for you. Here&apos;s everything you need to know.
        </p>
      </div>

      {/* How it works */}
      <section>
        <h2 className="text-h3">How Task Flow works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.title} className="card">
              <div className="text-4xl" aria-hidden>
                {s.icon}
              </div>
              <h3 className="mt-3 text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-lg text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-h3">Common questions</h2>
        <div className="mt-4 space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl border-2 border-surface-border bg-surface-raised p-5"
            >
              <summary className="cursor-pointer text-xl font-bold text-ink">
                {f.q}
              </summary>
              <p className="mt-3 text-lg text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="card bg-brand-50">
        <h2 className="text-h3 text-brand-700">Still need a hand?</h2>
        <p className="mt-2 text-lg text-ink-soft">
          Our friendly support team is happy to help you over the phone or by
          email, every day from 8 AM to 8 PM.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a href="tel:18005550100" className="btn-primary btn-xl flex-1">
            📞 Call 1-800-555-0100
          </a>
          <a
            href="mailto:help@taskflow.example"
            className="btn-secondary btn-xl flex-1"
          >
            ✉️ Email support
          </a>
        </div>
      </section>

      <div className="text-center">
        <Link href="/tasks/new" className="btn-warm btn-xl">
          ➕ Ready? Post a task
        </Link>
      </div>
    </div>
  );
}
