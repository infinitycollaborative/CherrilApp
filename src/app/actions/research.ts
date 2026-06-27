"use server";

import { createClient } from "@/lib/supabase/server";
import { getBrandProfile } from "@/lib/data";
import { generateResearch, brandToContext, type ResearchResult } from "@/lib/ai";

export async function runResearch(
  topic: string,
): Promise<{ result?: ResearchResult; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  if (!topic.trim()) return { error: "Enter a topic or keyword." };

  try {
    const brand = brandToContext(await getBrandProfile(user.id));
    const result = await generateResearch(topic.trim(), brand);
    return { result };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Research failed." };
  }
}
