"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import {
  saveContent,
  setContentStatus,
  deleteContent,
  restoreRevision,
} from "@/app/actions/content";
import {
  readabilityScore,
  readabilityLabel,
  sentimentLabel,
  wordCount,
  readingTime,
  buildSuggestions,
} from "@/lib/analytics";
import { STATUS_META, platformMeta } from "@/lib/constants";
import type {
  ContentItem,
  ContentRevision,
  ContentStatus,
} from "@/lib/types";

const STATUSES: ContentStatus[] = [
  "draft",
  "in_review",
  "published",
  "archived",
];

export function Editor({
  item,
  revisions: initialRevisions,
  wordsToAvoid,
}: {
  item: ContentItem;
  revisions: ContentRevision[];
  wordsToAvoid: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [status, setStatus] = useState<ContentStatus>(item.status);
  const [revisions, setRevisions] = useState(initialRevisions);
  const [tab, setTab] = useState<"insights" | "history">("insights");
  const meta = platformMeta(item.platform);

  const dirty = body !== item.body || title !== item.title;

  const stats = useMemo(() => {
    const r = readabilityScore(body);
    return {
      words: wordCount(body),
      chars: body.length,
      read: readingTime(body),
      readability: r,
      readabilityText: readabilityLabel(r),
      sentiment: sentimentLabel(body),
      suggestions: buildSuggestions(body, wordsToAvoid),
    };
  }, [body, wordsToAvoid]);

  function onSave(snapshot = true) {
    startTransition(async () => {
      const res = await saveContent(item.id, body, title, {
        snapshot,
        note: "Manual save",
      });
      if (res.error) return toast(res.error, "error");
      toast("Saved.", "success");
      if (snapshot)
        setRevisions((rs) => [
          {
            id: `tmp-${Date.now()}`,
            content_id: item.id,
            user_id: item.user_id,
            body: item.body,
            note: "Manual save",
            created_at: new Date().toISOString(),
          },
          ...rs,
        ]);
      router.refresh();
    });
  }

  function onStatus(next: ContentStatus) {
    setStatus(next);
    startTransition(async () => {
      const res = await setContentStatus(item.id, next);
      if (res.error) return toast(res.error, "error");
      toast(`Marked as ${STATUS_META[next].label}.`, "success");
    });
  }

  function onDelete() {
    if (!confirm("Delete this content permanently? This can't be undone."))
      return;
    startTransition(async () => {
      const res = await deleteContent(item.id);
      if (res.error) return toast(res.error, "error");
      toast("Deleted.", "success");
      router.push("/content");
    });
  }

  function onRestore(rev: ContentRevision) {
    if (!confirm("Restore this version? Your current draft will be snapshotted."))
      return;
    startTransition(async () => {
      const res = await restoreRevision(item.id, rev.id);
      if (res.error) return toast(res.error, "error");
      setBody(rev.body);
      toast("Version restored.", "success");
      router.refresh();
    });
  }

  function onExport() {
    const blob = new Blob([`# ${title}\n\n${body}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Exported as Markdown.", "success");
  }

  async function onCopy() {
    await navigator.clipboard.writeText(body);
    toast("Copied to clipboard.", "success");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Editor column */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip border border-surface-border bg-surface-overlay text-gray-300">
            {meta.icon} {meta.label}
          </span>
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value as ContentStatus)}
            className="input w-auto py-1.5 text-xs"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          {dirty && (
            <span className="text-xs text-accent">● Unsaved changes</span>
          )}
        </div>

        <input
          className="input text-lg font-semibold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="input min-h-[460px] leading-relaxed"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing…"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSave(true)}
            disabled={pending || !dirty}
            className="btn-primary"
          >
            {pending ? <Spinner /> : "💾"} Save
          </button>
          <button onClick={onCopy} className="btn-secondary">
            📋 Copy
          </button>
          <button onClick={onExport} className="btn-secondary">
            ⬇ Export
          </button>
          <button onClick={onDelete} className="btn-ghost ml-auto text-red-300">
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Side panel */}
      <aside className="space-y-4">
        <div className="card p-0">
          <div className="flex border-b border-surface-border">
            <button
              onClick={() => setTab("insights")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                tab === "insights"
                  ? "border-b-2 border-brand-400 text-brand-200"
                  : "text-gray-400"
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setTab("history")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                tab === "history"
                  ? "border-b-2 border-brand-400 text-brand-200"
                  : "text-gray-400"
              }`}
            >
              History ({revisions.length})
            </button>
          </div>

          <div className="p-5">
            {tab === "insights" ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <Stat label="Words" value={stats.words} />
                  <Stat label="Read time" value={`${stats.read} min`} />
                  <Stat
                    label="Readability"
                    value={stats.readability}
                    hint={stats.readabilityText}
                  />
                  <Stat label="Sentiment" value={stats.sentiment} />
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-200">
                    AI suggestions
                  </h4>
                  <ul className="space-y-2">
                    {stats.suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="rounded-lg bg-surface-overlay px-3 py-2 text-xs leading-relaxed text-gray-300"
                      >
                        💡 {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {revisions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No revisions yet. Saving creates a version you can revert to.
                  </p>
                ) : (
                  revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-lg border border-surface-border bg-surface-overlay p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {new Date(rev.created_at).toLocaleString()}
                        </span>
                        <button
                          onClick={() => onRestore(rev)}
                          disabled={pending || rev.id.startsWith("tmp-")}
                          className="text-xs text-brand-300 hover:text-brand-200 disabled:opacity-40"
                        >
                          Restore
                        </button>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {rev.note ? `${rev.note} · ` : ""}
                        {rev.body.slice(0, 90)}…
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-surface-overlay px-3 py-3">
      <div className="text-lg font-bold text-gray-100">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500">
        {label}
      </div>
      {hint && <div className="text-[11px] text-brand-300">{hint}</div>}
    </div>
  );
}
