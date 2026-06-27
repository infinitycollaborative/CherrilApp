import { requireProfile } from "@/lib/data";
import { signOut } from "@/app/(auth)/actions";
import {
  ProfileSection,
  PasswordSection,
  NotificationsSection,
  DangerSection,
} from "@/components/app/SettingsForms";

export const metadata = { title: "Settings — AI Sage" };

const PLAN_LABEL: Record<string, string> = {
  user: "Pro plan · $39/mo",
  admin: "Admin · all access",
};

export default async function SettingsPage() {
  const profile = await requireProfile();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1">Settings</h1>
        <p className="mt-1 text-gray-400">
          Manage your account, security and preferences.
        </p>
      </header>

      <ProfileSection profile={profile} />

      {/* Subscription / billing summary */}
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-h3">Subscription</h2>
          <p className="mt-1 text-sm text-gray-400">
            {PLAN_LABEL[profile.role] ?? "Free plan"} · renews monthly
          </p>
        </div>
        <button className="btn-secondary" disabled>
          Manage billing
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
