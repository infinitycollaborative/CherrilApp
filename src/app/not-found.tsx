import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-4 text-center">
      <Logo />
      <div className="mt-10">
        <p className="text-6xl font-extrabold text-brand-400">404</p>
        <h1 className="mt-3 text-h2">Page not found</h1>
        <p className="mt-2 text-lg text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <Link href="/dashboard" className="btn-primary btn-xl mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}
