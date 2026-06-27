"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { signOut } from "@/app/(auth)/actions";
import type { Profile } from "@/lib/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/generate", label: "Generation Studio", icon: "✨" },
  { href: "/research", label: "Research & Outlining", icon: "🔬" },
  { href: "/content", label: "My Content", icon: "📚" },
  { href: "/brand", label: "Brand Voice", icon: "🎯" },
  { href: "/integrations", label: "Integrations", icon: "🔌" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-brand-500/15 text-brand-200"
                : "text-gray-400 hover:bg-surface-overlay hover:text-gray-100"
            }`}
          >
            <span aria-hidden className="text-base">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserCard({ profile }: { profile: Profile }) {
  const initials = (profile.full_name || profile.email || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="mt-3 border-t border-surface-border pt-3">
      {profile.role === "admin" && (
        <Link
          href="/admin"
          className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-accent hover:bg-surface-overlay"
        >
          <span aria-hidden>🛡️</span> Admin Panel
        </Link>
      )}
      <div className="flex items-center gap-3 rounded-xl px-3 py-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-100">
            {profile.full_name || "Marketer"}
          </p>
          <p className="truncate text-xs text-gray-500">{profile.email}</p>
        </div>
      </div>
      <form action={signOut}>
        <button className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-400 hover:bg-surface-overlay hover:text-gray-100">
          ↪ Log out
        </button>
      </form>
    </div>
  );
}

export function Sidebar({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-surface-base/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="btn-ghost px-2 py-1.5"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-surface-border bg-surface-raised/50 p-4 lg:flex">
        <div className="px-2 py-2">
          <Logo href="/dashboard" />
        </div>
        <div className="mt-4 flex flex-1 flex-col">
          <NavLinks />
          <UserCard profile={profile} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-surface-border bg-surface-raised p-4 animate-fade-in">
            <div className="flex items-center justify-between px-2 py-2">
              <Logo href="/dashboard" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="btn-ghost px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex flex-1 flex-col">
              <NavLinks onNavigate={() => setOpen(false)} />
              <UserCard profile={profile} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
