import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-hero-gradient">
      <header className="flex items-center justify-between p-5 sm:p-8">
        <Logo />
        <Link
          href="/"
          className="text-lg font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          ← Back home
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
