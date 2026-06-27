import { requireProfile } from "@/lib/data";
import { ResearchAssistant } from "@/components/content/ResearchAssistant";

export const metadata = { title: "Research & Outlining — AI Sage" };

export default async function ResearchPage() {
  await requireProfile();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1">Research & Outlining</h1>
        <p className="mt-1 text-gray-400">
          Turn a topic into a research brief, keyword angles and a ready-to-write
          outline.
        </p>
      </header>
      <ResearchAssistant />
    </div>
  );
}
