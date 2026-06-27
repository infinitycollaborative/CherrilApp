import { signOut } from "@/app/(auth)/actions";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Account suspended — AI Sage" };

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-4 text-center">
      <Logo href={null} />
      <div className="card mt-8 max-w-md">
        <div className="text-4xl">🚫</div>
        <h1 className="mt-4 text-h2">Account suspended</h1>
        <p className="mt-2 text-sm text-gray-400">
          Your account has been suspended by an administrator. If you believe
          this is a mistake, please contact support.
        </p>
        <form action={signOut} className="mt-6">
          <button className="btn-secondary w-full">Log out</button>
        </form>
      </div>
    </div>
  );
}
