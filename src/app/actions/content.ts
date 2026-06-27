"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBrandProfile } from "@/lib/data";
import {
  generateContent,
  brandToContext,
  readabilityScore,
  sentimentLabel,
} from "@/lib/ai";
import type { ContentItem, ContentStatus, Platform } from "@/lib/types";
import { platformMeta } from "@/lib/constants";

async function authUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function deriveTitle(prompt: string, platform: Platform): string {
  const base = prompt.trim().replace(/\s+/g, " ");
  const short = base.length > 60 ? base.slice(0, 57) + "…" : base || "Untitled";
  return `${short} · ${platformMeta(platform).label}`;
}

export interface GenerateResult {
  created: ContentItem[];
  error?: string;
  usedAI: boolean;
}

/** Generate one draft per selected platform and persist them. */
export async function generateDrafts(formData: FormData): Promise<GenerateResult> {
  const { supabase, user } = await authUser();
  if (!user) return { created: [], error: "Not authenticated.", usedAI: false };

  const prompt = String(formData.get("prompt") || "").trim();
  const platforms = formData.getAll("platforms").map(String) as Platform[];

  if (!prompt) return { created: [], error: "Enter a prompt first.", usedAI: false };
  if (platforms.length === 0)
    return { created: [], error: "Select at least one platform.", usedAI: false };

  const brand = brandToContext(await getBrandProfile(user.id));

  try {
    const results = await Promise.all(
      platforms.map((platform) =>
        generateContent({ platform, prompt, brand }),
      ),
    );

    const rows = results.map((r, i) => ({
      user_id: user.id,
      title: deriveTitle(prompt, platforms[i]),
      prompt,
      platform: platforms[i],
      body: r.body,
      status: "draft" as ContentStatus,
      readability_score: readabilityScore(r.body),
      sentiment: sentimentLabel(r.body),
    }));

    const { data, error } = await supabase
      .from("content_items")
      .insert(rows)
      .select();

    if (error) return { created: [], error: error.message, usedAI: false };

    revalidatePath("/content");
    revalidatePath("/dashboard");
    return {
      created: (data as ContentItem[]) ?? [],
      usedAI: results.some((r) => r.aiGenerated),
    };
  } catch (e) {
    return {
      created: [],
      error: e instanceof Error ? e.message : "Generation failed.",
      usedAI: false,
    };
  }
}

export interface SaveContentState {
  ok?: boolean;
  error?: string;
}

/** Save an edit to a content item, optionally snapshotting a revision. */
export async function saveContent(
  id: string,
  body: string,
  title: string,
  options?: { snapshot?: boolean; note?: string },
): Promise<SaveContentState> {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };

  // RLS guarantees ownership, but fetch current body for the snapshot.
  const { data: current } = await supabase
    .from("content_items")
    .select("body")
    .eq("id", id)
    .single();

  if (options?.snapshot && current) {
    await supabase.from("content_revisions").insert({
      content_id: id,
      user_id: user.id,
      body: current.body,
      note: options.note ?? "Manual save",
    });
  }

  const { error } = await supabase
    .from("content_items")
    .update({
      body,
      title,
      readability_score: readabilityScore(body),
      sentiment: sentimentLabel(body),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/content/${id}`);
  revalidatePath("/content");
  return { ok: true };
}

export async function setContentStatus(id: string, status: ContentStatus) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase
    .from("content_items")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/content");
  revalidatePath(`/content/${id}`);
  return { ok: true };
}

export async function deleteContent(id: string) {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/content");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function restoreRevision(
  contentId: string,
  revisionId: string,
): Promise<SaveContentState> {
  const { supabase, user } = await authUser();
  if (!user) return { error: "Not authenticated." };

  const { data: rev } = await supabase
    .from("content_revisions")
    .select("body")
    .eq("id", revisionId)
    .single();
  if (!rev) return { error: "Revision not found." };

  // Snapshot the current body before restoring.
  const { data: current } = await supabase
    .from("content_items")
    .select("body")
    .eq("id", contentId)
    .single();
  if (current) {
    await supabase.from("content_revisions").insert({
      content_id: contentId,
      user_id: user.id,
      body: current.body,
      note: "Auto-saved before restore",
    });
  }

  const { error } = await supabase
    .from("content_items")
    .update({
      body: rev.body,
      readability_score: readabilityScore(rev.body),
      sentiment: sentimentLabel(rev.body),
    })
    .eq("id", contentId);
  if (error) return { error: error.message };

  revalidatePath(`/content/${contentId}`);
  return { ok: true };
}
