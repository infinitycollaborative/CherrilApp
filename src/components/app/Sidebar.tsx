"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { signOut } from "@/app/(auth)/actions";
import { initialsOf } from "@/lib/format";
import type { Profile } from "@/lib/types";

const NAV = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/tasks/new", label: "Post a Task", icon: "➕" },
  { href: "/tasks", label: "My Tasks", icon: "📋" },
  { href: "/taskers", label: "Find Helpers", icon: "🤝" },
  { href: "/messages", label: "Messages", icon: "💬" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/help", label: "Help", icon: "❓" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1.5" aria-label="Main">
      {NAV.map((item) => {
        const active =
          item.href === "/tasks/new"
            ? pathname === "/tasks/new"
            : pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-semibold transition-colors ${
              active
                ? "bg-brand-100 text-brand-700"
                : "text-ink-soft hover:bg-surface-overlay"
            }`}
          >
            <span aria-hidden className="text-2xl">
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
  return (
    <div className="mt-3 border-t-2 border-surface-border pt-3">
      {profile.role === "admin" && (
        <Link
          href="/admin"
          className="mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-semibold text-warm-600 hover:bg-surface-overlay"
        >
          <span aria-hidden className="text-2xl">
            🛡️
          </span>{" "}
          Admin
        </Link>
      )}
      <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-gradient text-base font-bold text-white">
          {initialsOf(profile.full_name || profile.email)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-ink">
            {profile.full_name || "Welcome"}
          </p>
          <p className="truncate text-sm text-ink-muted">{profile.email}</p>
        </div>
      </div>
      <form action={signOut}>
        <button className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-lg font-semibold text-ink-soft hover:bg-surface-overlay">
          <span aria-hidden className="text-2xl">
            ↪
          </span>{" "}
          Log out
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
      <div className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-surface-border bg-surface-raised/95 px-4 py-3 backdrop-blur lg:hidden">
        <Logo href="/dashboard" />
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="btn-secondary px-3 py-2"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r-2 border-surface-border bg-surface-raised p-4 lg:flex">
        <div className="px-2 py-2">
          <Logo href="/dashboard" />
        </div>
        <div className="mt-5 flex flex-1 flex-col">
          <NavLinks />
          <UserCard profile={profile} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col border-r-2 border-surface-border bg-surface-raised p-4 animate-fade-in">
            <div className="flex items-center justify-between px-2 py-2">
              <Logo href="/dashboard" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="btn-secondary px-3 py-1.5 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <NavLinks onNavigate={() => setOpen(false)} />
              <UserCard profile={profile} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
