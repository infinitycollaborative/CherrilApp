import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/data";
import { Logo } from "@/components/ui/Logo";
import { TaskWizard } from "@/components/tasks/TaskWizard";
import { signOut } from "@/app/(auth)/actions";

export const metadata = { title: "Post your first task — Task Flow" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const profile = await requireProfile();
  if (profile.onboarding_completed) redirect("/dashboard");

  const firstName = (profile.full_name || "").split(" ")[0];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <header className="flex items-center justify-between border-b-2 border-surface-border bg-surface-raised/90 px-4 py-4 backdrop-blur sm:px-8">
        <Logo href={null} />
        <form action={signOut}>
          <button className="text-lg font-semibold text-ink-soft hover:text-ink">
            Log out
          </button>
        </form>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-center animate-fade-in">
          <span className="chip mx-auto mb-4 border-2 border-verified-200 bg-verified-50 text-verified-700">
            🎉 Welcome to Task Flow{firstName ? `, ${firstName}` : ""}!
          </span>
          <h1 className="text-h2">Let&apos;s post your first task</h1>
          <p className="mx-auto mt-3 max-w-xl text-xl text-ink-soft">
            This is the easiest way to get help. Tell us what you need and
            we&apos;ll connect you with a trusted, background-checked helper. It
            takes about two minutes.
          </p>
        </div>

        <div className="card mt-8">
          <TaskWizard firstTime />
        </div>

        <p className="mt-6 text-center text-lg text-ink-muted">
          Want to look around first?{" "}
          <Link href="/dashboard" className="font-bold text-brand-600">
            Skip to my home page
          </Link>
        </p>
      </main>
    </div>
  );
}
