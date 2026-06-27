import { requireAdmin } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { UserTable } from "@/components/admin/UserTable";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Admin — AI Sage" };

export default async function AdminPage() {
  const me = await requireAdmin();
  const supabase = await createClient();

  // RLS lets admins read every profile via the is_admin() policy.
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: contentCount } = await supabase
    .from("content_items")
    .select("*", { count: "exact", head: true });

  const list = (users as Profile[]) ?? [];
  const stats = [
    { label: "Total users", value: list.length, icon: "👥" },
    {
      label: "Admins",
      value: list.filter((u) => u.role === "admin").length,
      icon: "🛡️",
    },
    {
      label: "Suspended",
      value: list.filter((u) => u.status === "suspended").length,
      icon: "🚫",
    },
    { label: "Content items", value: contentCount ?? 0, icon: "📄" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1">Admin Panel</h1>
        <p className="mt-1 text-gray-400">
          Manage users, roles and system health.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <UserTable users={list} currentUserId={me.id} />
    </div>
  );
}
