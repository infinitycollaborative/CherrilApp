import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { BrandWizard } from "@/components/brand/BrandWizard";
import { requireProfile, getBrandProfile } from "@/lib/data";
import { signOut } from "@/app/(auth)/actions";

export const metadata = { title: "Set up your brand voice — AI Sage" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const profile = await requireProfile();
  if (profile.onboarding_completed) redirect("/dashboard");

  const brand = await getBrandProfile(profile.id);

  return (
    <div className="min-h-screen bg-hero-gradient">
      <header className="flex items-center justify-between p-5 sm:p-8">
        <Logo href={null} />
        <form action={signOut}>
          <button className="text-sm text-gray-400 hover:text-gray-200">
            Log out
          </button>
        </form>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-20">
        <div className="mb-6 text-center animate-fade-in">
          <span className="chip mx-auto mb-3 border border-brand-400/30 bg-brand-500/10 text-brand-200">
            👋 Welcome to AI Sage
          </span>
          <h1 className="text-h2">Let&apos;s capture your brand voice</h1>
          <p className="mt-2 text-sm text-gray-400">
            This takes about two minutes. Every draft AI Sage writes will follow
            these guidelines automatically.
          </p>
        </div>
        <BrandWizard initial={brand} />
      </main>
    </div>
  );
}
