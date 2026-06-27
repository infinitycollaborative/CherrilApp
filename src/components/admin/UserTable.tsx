"use client";

import { useMemo, useState, useTransition } from "react";
import {
  setUserStatus,
  setUserRole,
  deleteUser,
} from "@/app/actions/admin";
import { useToast } from "@/components/ui/Toast";
import type { Profile } from "@/lib/types";

export function UserTable({
  users,
  currentUserId,
}: {
  users: Profile[];
  currentUserId: string;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">(
    "all",
  );

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (statusFilter !== "all" && u.status !== statusFilter) return false;
        if (
          query &&
          !`${u.email} ${u.full_name ?? ""} ${u.company_name ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [users, query, statusFilter],
  );

  function run(fn: () => Promise<{ error?: string; message?: string }>, ok: string) {
    startTransition(async () => {
      const res = await fn();
      if (res.error) return toast(res.error, "error");
      toast(res.message || ok, "success");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="input sm:max-w-xs"
          placeholder="🔍 Search users…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2">
          {(["all", "active", "suspended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`chip border capitalize transition-colors ${
                statusFilter === s
                  ? "border-brand-400 bg-brand-500/20 text-brand-200"
                  : "border-surface-border bg-surface-overlay text-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="border-b border-surface-border text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const self = u.id === currentUserId;
              return (
                <tr
                  key={u.id}
                  className="border-b border-surface-border/60 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-100">
                      {u.full_name || "—"}
                      {self && (
                        <span className="ml-2 text-xs text-gray-500">(you)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {u.company_name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`chip ${
                        u.role === "admin"
                          ? "bg-accent/20 text-accent"
                          : "bg-surface-overlay text-gray-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`chip ${
                        u.status === "active"
                          ? "bg-brand-500/20 text-brand-200"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {!self && (
                        <>
                          {u.status === "active" ? (
                            <button
                              disabled={pending}
                              onClick={() =>
                                run(
                                  () => setUserStatus(u.id, "suspended"),
                                  "User suspended.",
                                )
                              }
                              className="btn-ghost px-2 py-1 text-xs text-yellow-300"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              disabled={pending}
                              onClick={() =>
                                run(
                                  () => setUserStatus(u.id, "active"),
                                  "User activated.",
                                )
                              }
                              className="btn-ghost px-2 py-1 text-xs text-brand-300"
                            >
                              Activate
                            </button>
                          )}
                          {u.role === "user" ? (
                            <button
                              disabled={pending}
                              onClick={() =>
                                run(
                                  () => setUserRole(u.id, "admin"),
                                  "Promoted to admin.",
                                )
                              }
                              className="btn-ghost px-2 py-1 text-xs"
                            >
                              Promote
                            </button>
                          ) : (
                            <button
                              disabled={pending}
                              onClick={() =>
                                run(
                                  () => setUserRole(u.id, "user"),
                                  "Demoted to user.",
                                )
                              }
                              className="btn-ghost px-2 py-1 text-xs"
                            >
                              Demote
                            </button>
                          )}
                          <button
                            disabled={pending}
                            onClick={() => {
                              if (confirm(`Delete ${u.email}? This is permanent.`))
                                run(() => deleteUser(u.id), "User deleted.");
                            }}
                            className="btn-ghost px-2 py-1 text-xs text-red-300"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">
          No users match your filters.
        </p>
      )}
    </div>
  );
}
