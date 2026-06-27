"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { runResearch } from "@/app/actions/research";
import { generateDrafts } from "@/app/actions/content";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import type { ResearchResult } from "@/lib/ai";

export function ResearchAssistant() {
  const router = useRouter();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [pending, startTransition] = useTransition();
  const [drafting, startDraft] = useTransition();
  const [result, setResult] = useState<ResearchResult | null>(null);

  function onResearch() {
    if (!topic.trim()) return toast("Enter a topic first.", "error");
    startTransition(async () => {
      const res = await runResearch(topic);
      if (res.error) return toast(res.error, "error");
      setResult(res.result ?? null);
      if (res.result && !res.result.aiGenerated)
        toast("Generated a research brief (template mode).", "info");
    });
  }

  function draftFromOutline() {
    const outlineText =
      result?.outline
        .map((o) => `${o.heading}: ${o.points.join("; ")}`)
        .join("\n") ?? "";
    const fd = new FormData();
    fd.set("prompt", `${topic}\n\nFollow this outline:\n${outlineText}`);
    fd.append("platforms", "blog");
    startDraft(async () => {
      const res = await generateDrafts(fd);
      if (res.error) return toast(res.error, "error");
      toast("Draft created from your outline!", "success");
      if (res.created[0]) router.push(`/content/${res.created[0].id}`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <label className="label">Topic or keyword to research</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="input"
            placeholder="e.g. reducing SaaS churn with onboarding"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onResearch()}
            disabled={pending}
          />
          <button
            onClick={onResearch}
            disabled={pending}
            className="btn-primary shrink-0 sm:w-44"
          >
            {pending ? (
              <>
                <Spinner /> Researching…
              </>
            ) : (
              "🔬 Research"
            )}
          </button>
        </div>
      </div>

      {pending && (
        <div className="space-y-3">
          <div className="card space-y-2">
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-11/12" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        </div>
      )}

      {!pending && result && (
        <div className="space-y-5 animate-fade-in">
          {/* Summary */}
          <div className="card">
            <h3 className="text-h3">Research summary</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {result.summary}
            </p>
          </div>

          {/* Keywords */}
          {result.keywords.length > 0 && (
            <div className="card">
              <h3 className="text-h3">Keyword angles</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.keywords.map((k) => (
                  <span
                    key={k}
                    className="chip border border-surface-border bg-surface-overlay text-gray-300"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Outline */}
          <div className="card">
            <div className="flex items-center justify-between">
              <h3 className="text-h3">Suggested outline</h3>
              <button
                onClick={draftFromOutline}
                disabled={drafting}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                {drafting ? (
                  <>
                    <Spinner /> Drafting…
                  </>
                ) : (
                  "✨ Draft from outline →"
                )}
              </button>
            </div>
            <ol className="mt-4 space-y-4">
              {result.outline.map((section, i) => (
                <li key={i} className="border-l-2 border-brand-500/40 pl-4">
                  <p className="font-medium text-gray-100">
                    {i + 1}. {section.heading}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {section.points.map((pt, j) => (
                      <li key={j} className="text-sm text-gray-400">
                        • {pt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
