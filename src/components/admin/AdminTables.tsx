"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserStatus, setUserRole, deleteUser } from "@/app/actions/admin";
import { useToast } from "@/components/ui/Toast";
import { initialsOf } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function UserTable({
  users,
  currentUserId,
}: {
  users: Profile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      !q ||
      (u.full_name || "").toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  async function act(
    id: string,
    fn: () => Promise<{ error?: string; message?: string }>,
    ok: string,
  ) {
    setBusy(id);
    const res = await fn();
    if (res?.error) toast(res.error, "error");
    else toast(res?.message || ok, "success");
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-h3">Members ({users.length})</h2>
        <input
          className="input sm:max-w-xs"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((u) => {
          const isSelf = u.id === currentUserId;
          return (
            <div
              key={u.id}
              className="rounded-2xl border-2 border-surface-border p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-gradient text-base font-bold text-white">
                  {initialsOf(u.full_name || u.email)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold text-ink">
                    {u.full_name || "—"}
                    {isSelf && (
                      <span className="ml-2 text-base font-normal text-ink-muted">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-base text-ink-soft">{u.email}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {u.role === "admin" && (
                    <span className="chip bg-warm-50 text-warm-700">Admin</span>
                  )}
                  <span
                    className={`chip ${
                      u.status === "suspended"
                        ? "bg-red-50 text-red-700"
                        : "bg-verified-50 text-verified-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              </div>

              {!isSelf && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    disabled={busy === u.id}
                    onClick={() =>
                      act(
                        u.id,
                        () =>
                          setUserStatus(
                            u.id,
                            u.status === "suspended" ? "active" : "suspended",
                          ),
                        "Updated.",
                      )
                    }
                    className="btn-secondary px-4 py-2 text-base"
                    style={{ minHeight: "auto" }}
                  >
                    {u.status === "suspended" ? "Reactivate" : "Suspend"}
                  </button>
                  <button
                    disabled={busy === u.id}
                    onClick={() =>
                      act(
                        u.id,
                        () =>
                          setUserRole(
                            u.id,
                            u.role === "admin" ? "member" : "admin",
                          ),
                        "Updated.",
                      )
                    }
                    className="btn-secondary px-4 py-2 text-base"
                    style={{ minHeight: "auto" }}
                  >
                    {u.role === "admin" ? "Remove admin" : "Make admin"}
                  </button>
                  <button
                    disabled={busy === u.id}
                    onClick={() => {
                      if (confirm(`Delete ${u.email}? This cannot be undone.`))
                        act(u.id, () => deleteUser(u.id), "User deleted.");
                    }}
                    className="btn-danger px-4 py-2 text-base"
                    style={{ minHeight: "auto" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-lg text-ink-muted">
            No members match your search.
          </p>
        )}
      </div>
    </div>
  );
}
