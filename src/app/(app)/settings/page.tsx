import { requireProfile } from "@/lib/data";
import { signOut } from "@/app/(auth)/actions";
import { PAYMENT_METHODS } from "@/lib/constants";
import {
  ProfileSection,
  PasswordSection,
  NotificationsSection,
  DangerSection,
} from "@/components/app/SettingsForms";

export const metadata = { title: "Settings — Task Flow" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const profile = await requireProfile();

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="text-h2">Settings</h1>
        <p className="mt-2 text-xl text-ink-soft">
          Manage your details, safety and preferences.
        </p>
      </header>

      <ProfileSection profile={profile} />

      {/* Payment methods (illustrative) */}
      <div className="card space-y-4">
        <h2 className="text-h3">Payment methods</h2>
        <p className="text-lg text-ink-soft">
          You&apos;re only charged after a task is complete. Cards on file:
        </p>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <div
              key={m}
              className="flex items-center gap-3 rounded-2xl border-2 border-surface-border p-4 text-lg font-semibold text-ink"
            >
              💳 {m}
            </div>
          ))}
        </div>
        <button className="btn-secondary" disabled>
          Add a payment method
        </button>
      </div>

      <NotificationsSection profile={profile} />
      <PasswordSection />
      <DangerSection />

      <form action={signOut} className="pt-2">
        <button className="btn-secondary w-full sm:w-auto">↪ Log out</button>
      </form>
    </div>
  );
}
