import Link from "next/link";
import { requireProfile, getBrandProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { PLATFORMS, STATUS_META, platformMeta } from "@/lib/constants";
import type { ContentItem } from "@/lib/types";

export const metadata = { title: "Dashboard — AI Sage" };

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const brand = await getBrandProfile(profile.id);

  const { data: recent } = await supabase
    .from("content_items")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(5);

  const { count: total } = await supabase
    .from("content_items")
    .select("*", { count: "exact", head: true });

  const { count: published } = await supabase
    .from("content_items")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const items = (recent as ContentItem[]) ?? [];
  const firstName = (profile.full_name || "there").split(" ")[0];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-h1">Welcome back, {firstName} 👋</h1>
        <p className="mt-1 text-gray-400">
          Here&apos;s your content workspace at a glance.
        </p>
      </header>

      {/* Brand voice nudge */}
      {!brand && (
        <div className="card flex flex-col items-start justify-between gap-4 border-brand-400/40 bg-brand-500/5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-h3">Finish your brand voice setup</h3>
            <p className="mt-1 text-sm text-gray-400">
              Capture your tone and style rules so every draft ships on-brand.
            </p>
          </div>
          <Link href="/brand" className="btn-primary shrink-0">
            Set up brand voice →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total drafts", value: total ?? 0, icon: "📄" },
          { label: "Published", value: published ?? 0, icon: "🚀" },
          {
            label: "Brand voice",
            value: brand ? "Active" : "Not set",
            icon: "🎯",
          },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick generate */}
      <section>
        <h2 className="text-h3">Generate content</h2>
        <p className="mt-1 text-sm text-gray-400">
          Start a draft for any platform — or open the full studio.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PLATFORMS.map((p) => (
            <Link
              key={p.id}
              href={`/generate?platform=${p.id}`}
              className="card group flex flex-col items-center gap-2 py-5 text-center transition-transform hover:-translate-y-1 hover:border-brand-400/50"
            >
              <span className="text-2xl">{p.icon}</span>
              <span className="text-xs font-medium text-gray-300">
                {p.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-h3">Recent activity</h2>
          <Link href="/content" className="text-sm text-brand-300 hover:text-brand-200">
            View all →
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card mt-4 flex flex-col items-center py-12 text-center">
            <span className="text-4xl">✨</span>
            <h3 className="mt-3 text-h3">No content yet</h3>
            <p className="mt-1 max-w-sm text-sm text-gray-400">
              Generate your first on-brand draft and it&apos;ll show up here.
            </p>
            <Link href="/generate" className="btn-primary mt-5">
              Create your first draft →
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {items.map((item) => {
              const meta = platformMeta(item.platform);
              const status = STATUS_META[item.status];
              return (
                <li key={item.id}>
                  <Link
                    href={`/content/${item.id}`}
                    className="card flex items-center gap-4 py-4 transition-colors hover:border-brand-400/40"
                  >
                    <span className="text-xl">{meta.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-100">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {meta.label} ·{" "}
                        {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`chip ${status.className}`}>
                      {status.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
