import { signOut } from "@/app/(auth)/actions";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Account paused — Task Flow" };

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-4 text-center">
      <Logo href={null} />
      <div className="card mt-8 max-w-md">
        <div className="text-5xl" aria-hidden>
          🚫
        </div>
        <h1 className="mt-4 text-h2">Your account is paused</h1>
        <p className="mt-2 text-lg text-ink-soft">
          Your account has been paused by an administrator. If you think this is
          a mistake, please contact our support team at{" "}
          <span className="font-semibold text-brand-600">
            help@taskflow.example
          </span>
          .
        </p>
        <form action={signOut} className="mt-6">
          <button className="btn-secondary w-full">Log out</button>
        </form>
      </div>
    </div>
  );
}
