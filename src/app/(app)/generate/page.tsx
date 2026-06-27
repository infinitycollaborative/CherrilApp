import { requireProfile, getBrandProfile } from "@/lib/data";
import { GenerationStudio } from "@/components/content/GenerationStudio";
import { PLATFORMS } from "@/lib/constants";
import type { Platform } from "@/lib/types";

export const metadata = { title: "Generation Studio — AI Sage" };

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const profile = await requireProfile();
  const brand = await getBrandProfile(profile.id);
  const { platform } = await searchParams;

  const valid = PLATFORMS.some((p) => p.id === platform)
    ? (platform as Platform)
    : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1">Generation Studio</h1>
        <p className="mt-1 text-gray-400">
          One prompt → platform-perfect drafts, all in your brand voice.
        </p>
      </header>
      <GenerationStudio defaultPlatform={valid} hasBrand={!!brand} />
    </div>
  );
}
