"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { PLATFORMS } from "@/lib/constants";
import { generateDrafts } from "@/app/actions/content";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import type { ContentItem, Platform } from "@/lib/types";
import { platformMeta } from "@/lib/constants";

const PROMPT_IDEAS = [
  "How AI is changing B2B content workflows",
  "5 ways to reduce customer churn with onboarding",
  "Why product-led growth beats sales-led for SMB SaaS",
  "Announcing our new analytics dashboard",
];

export function GenerationStudio({
  defaultPlatform,
  hasBrand,
}: {
  defaultPlatform?: Platform;
  hasBrand: boolean;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<Platform[]>(
    defaultPlatform ? [defaultPlatform] : ["blog"],
  );
  const [results, setResults] = useState<ContentItem[]>([]);

  function toggle(p: Platform) {
    setSelected((s) =>
      s.includes(p) ? s.filter((x) => x !== p) : [...s, p],
    );
  }

  function onGenerate() {
    if (!prompt.trim()) return toast("Enter a prompt first.", "error");
    if (selected.length === 0)
      return toast("Select at least one platform.", "error");

    const fd = new FormData();
    fd.set("prompt", prompt);
    selected.forEach((p) => fd.append("platforms", p));

    startTransition(async () => {
      const res = await generateDrafts(fd);
      if (res.error) {
        toast(res.error, "error");
        return;
      }
      setResults(res.created);
      toast(
        res.usedAI
          ? `Generated ${res.created.length} draft${res.created.length > 1 ? "s" : ""}!`
          : `Generated ${res.created.length} template draft${res.created.length > 1 ? "s" : ""} (add an Anthropic key for full AI).`,
        "success",
      );
    });
  }

  return (
    <div className="space-y-6">
      {!hasBrand && (
        <div className="card border-brand-400/40 bg-brand-500/5 text-sm text-gray-300">
          💡 Tip: <Link href="/brand" className="text-brand-300 underline">set up your brand voice</Link>{" "}
          first so generated drafts match your tone and style rules.
        </div>
      )}

      <div className="card">
        <label className="label">What do you want to write about?</label>
        <textarea
          className="input min-h-[120px]"
          placeholder="Describe your topic, angle, key points, or paste a rough brief…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={pending}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {PROMPT_IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => setPrompt(idea)}
              className="chip border border-surface-border bg-surface-overlay text-gray-400 hover:border-gray-500 hover:text-gray-200"
            >
              + {idea}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="label">Choose output platforms</label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {PLATFORMS.map((p) => {
              const on = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  disabled={pending}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                    on
                      ? "border-brand-400 bg-brand-500/15"
                      : "border-surface-border bg-surface-overlay hover:border-gray-500"
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-gray-100">
                      {p.label}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      {p.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={pending}
          className="btn-primary mt-6 w-full py-3 text-base"
        >
          {pending ? (
            <>
              <Spinner /> Generating {selected.length} draft
              {selected.length > 1 ? "s" : ""}…
            </>
          ) : (
            <>✨ Generate {selected.length} draft{selected.length > 1 ? "s" : ""}</>
          )}
        </button>
      </div>

      {/* Loading skeletons */}
      {pending && (
        <div className="space-y-3">
          {selected.map((p) => (
            <div key={p} className="card">
              <div className="skeleton h-5 w-1/3" />
              <div className="mt-3 space-y-2">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-11/12" />
                <div className="skeleton h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!pending && results.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h2 className="text-h3">Your drafts are ready 🎉</h2>
          {results.map((item) => {
            const meta = platformMeta(item.platform);
            return (
              <div key={item.id} className="card">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <span className="font-medium">{meta.label}</span>
                  </div>
                  <Link
                    href={`/content/${item.id}`}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    Open in editor →
                  </Link>
                </div>
                <pre className="mt-3 max-h-48 overflow-hidden whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-300">
                  {item.body.slice(0, 600)}
                  {item.body.length > 600 ? "…" : ""}
                </pre>
              </div>
            );
          })}
          <Link href="/content" className="btn-ghost w-full justify-center">
            View all in My Content →
          </Link>
        </div>
      )}
    </div>
  );
}
