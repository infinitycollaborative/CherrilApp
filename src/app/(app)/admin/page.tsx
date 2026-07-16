import { requireAdmin } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { UserTable } from "@/components/admin/AdminTables";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Admin — Task Flow" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const me = await requireAdmin();
  const supabase = await createClient();

  // RLS lets admins read every profile / task via the is_admin() policies.
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: taskCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true });
  const { count: completedCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");
  const { count: taskerCount } = await supabase
    .from("taskers")
    .select("*", { count: "exact", head: true });

  const list = (users as Profile[]) ?? [];
  const stats = [
    { label: "Members", value: list.length, icon: "👥" },
    { label: "Verified helpers", value: taskerCount ?? 0, icon: "🤝" },
    { label: "Tasks posted", value: taskCount ?? 0, icon: "📋" },
    { label: "Tasks completed", value: completedCount ?? 0, icon: "🎉" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="text-h2">Admin</h1>
        <p className="mt-2 text-xl text-ink-soft">
          Manage members, helpers and platform health.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="text-3xl" aria-hidden>
              {s.icon}
            </div>
            <div className="mt-2 text-3xl font-extrabold text-brand-600">
              {s.value}
            </div>
            <div className="text-base text-ink-soft">{s.label}</div>
          </div>
        ))}
      </div>

      <UserTable users={list} currentUserId={me.id} />
    </div>
  );
}
