"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PLATFORMS, STATUS_META, platformMeta } from "@/lib/constants";
import type { ContentItem, ContentStatus, Platform } from "@/lib/types";

const STATUS_FILTERS: (ContentStatus | "all")[] = [
  "all",
  "draft",
  "in_review",
  "published",
  "archived",
];

export function ContentLibrary({ items }: { items: ContentItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ContentStatus | "all">("all");
  const [platform, setPlatform] = useState<Platform | "all">("all");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      if (platform !== "all" && i.platform !== platform) return false;
      if (query && !`${i.title} ${i.prompt}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [items, query, status, platform]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="card space-y-4">
        <input
          className="input"
          placeholder="🔍 Search by title or prompt…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`chip border transition-colors ${
                status === s
                  ? "border-brand-400 bg-brand-500/20 text-brand-200"
                  : "border-surface-border bg-surface-overlay text-gray-400 hover:text-gray-200"
              }`}
            >
              {s === "all" ? "All statuses" : STATUS_META[s].label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPlatform("all")}
            className={`chip border transition-colors ${
              platform === "all"
                ? "border-brand-400 bg-brand-500/20 text-brand-200"
                : "border-surface-border bg-surface-overlay text-gray-400 hover:text-gray-200"
            }`}
          >
            All platforms
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`chip border transition-colors ${
                platform === p.id
                  ? "border-brand-400 bg-brand-500/20 text-brand-200"
                  : "border-surface-border bg-surface-overlay text-gray-400 hover:text-gray-200"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500">
        {filtered.length} {filtered.length === 1 ? "item" : "items"}
      </p>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <span className="text-4xl">🗂️</span>
          <h3 className="mt-3 text-h3">Nothing matches</h3>
          <p className="mt-1 text-sm text-gray-400">
            Try clearing a filter — or generate something new.
          </p>
          <Link href="/generate" className="btn-primary mt-5">
            Generate content →
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item) => {
            const meta = platformMeta(item.platform);
            const st = STATUS_META[item.status];
            return (
              <li key={item.id}>
                <Link
                  href={`/content/${item.id}`}
                  className="card flex h-full flex-col transition-colors hover:border-brand-400/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="chip border border-surface-border bg-surface-overlay text-gray-300">
                      {meta.icon} {meta.label}
                    </span>
                    <span className={`chip ${st.className}`}>{st.label}</span>
                  </div>
                  <h3 className="mt-3 font-medium text-gray-100">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">
                    {item.body.slice(0, 140)}
                  </p>
                  <p className="mt-3 text-xs text-gray-600">
                    Updated {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
