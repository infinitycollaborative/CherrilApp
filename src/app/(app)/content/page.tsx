import Link from "next/link";
import { requireProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { ContentLibrary } from "@/components/content/ContentLibrary";
import type { ContentItem } from "@/lib/types";

export const metadata = { title: "My Content — AI Sage" };

export default async function ContentPage() {
  await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("*")
    .order("updated_at", { ascending: false });

  const items = (data as ContentItem[]) ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h1">My Content</h1>
          <p className="mt-1 text-gray-400">
            Every draft you&apos;ve generated and saved, in one place.
          </p>
        </div>
        <Link href="/generate" className="btn-primary">
          ✨ New content
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <span className="text-5xl">📚</span>
          <h3 className="mt-4 text-h3">Your library is empty</h3>
          <p className="mt-1 max-w-sm text-sm text-gray-400">
            Generate your first on-brand draft and it&apos;ll live here, ready to
            edit, filter and publish.
          </p>
          <Link href="/generate" className="btn-primary mt-6">
            Create your first draft →
          </Link>
        </div>
      ) : (
        <ContentLibrary items={items} />
      )}
    </div>
  );
}
