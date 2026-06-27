import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, getBrandProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { Editor } from "@/components/content/Editor";
import type { ContentItem, ContentRevision } from "@/lib/types";

export const metadata = { title: "Editor — AI Sage" };

export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireProfile();
  const { id } = await params;
  const supabase = await createClient();

  // RLS ensures users can only read their own content.
  const { data: item } = await supabase
    .from("content_items")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const { data: revisions } = await supabase
    .from("content_revisions")
    .select("*")
    .eq("content_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const brand = await getBrandProfile(profile.id);

  return (
    <div className="space-y-6">
      <Link
        href="/content"
        className="text-sm text-gray-400 hover:text-gray-200"
      >
        ← Back to My Content
      </Link>
      <Editor
        item={item as ContentItem}
        revisions={(revisions as ContentRevision[]) ?? []}
        wordsToAvoid={brand?.words_to_avoid ?? null}
      />
    </div>
  );
}
