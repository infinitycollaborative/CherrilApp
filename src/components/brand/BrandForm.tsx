"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { BRAND_PERSONALITIES } from "@/lib/constants";
import { saveBrand, type SaveBrandState } from "@/app/actions/brand";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import type { BrandProfile } from "@/lib/types";

export function BrandForm({ initial }: { initial: BrandProfile | null }) {
  const { toast } = useToast();
  const [state, action] = useActionState<SaveBrandState, FormData>(
    saveBrand,
    {},
  );
  const [personality, setPersonality] = useState<string[]>(
    initial?.personality ?? [],
  );

  useEffect(() => {
    if (state.ok) toast("Brand voice updated.", "success");
    else if (state.error) toast(state.error, "error");
  }, [state, toast]);

  function toggle(p: string) {
    setPersonality((cur) =>
      cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p],
    );
  }

  return (
    <form action={action} className="space-y-5">
      {personality.map((p) => (
        <input key={p} type="hidden" name="personality" value={p} />
      ))}

      <div className="card space-y-5">
        <div>
          <label className="label">Brand / company name</label>
          <input
            name="brand_name"
            className="input"
            defaultValue={initial?.brand_name ?? ""}
            placeholder="Acme SaaS"
          />
        </div>

        <div>
          <label className="label">Brand personality</label>
          <div className="flex flex-wrap gap-2">
            {BRAND_PERSONALITIES.map((p) => {
              const on = personality.includes(p);
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => toggle(p)}
                  className={`chip border transition-colors ${
                    on
                      ? "border-brand-400 bg-brand-500/20 text-brand-200"
                      : "border-surface-border bg-surface-overlay text-gray-300 hover:border-gray-500"
                  }`}
                >
                  {on && "✓ "}
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label">Tone of voice</label>
          <input
            name="tone"
            className="input"
            defaultValue={initial?.tone ?? ""}
            placeholder="Confident but never salesy; helpful and concrete."
          />
        </div>
      </div>

      <div className="card space-y-5">
        <div>
          <label className="label">Target audience</label>
          <textarea
            name="audience"
            className="input min-h-[80px]"
            defaultValue={initial?.audience ?? ""}
            placeholder="Content marketing managers at 10–500 person B2B SaaS companies."
          />
        </div>
        <div>
          <label className="label">Brand values</label>
          <textarea
            name="values"
            className="input min-h-[80px]"
            defaultValue={initial?.values ?? ""}
            placeholder="Practical over theoretical. Honest. Respect the reader's time."
          />
        </div>
      </div>

      <div className="card space-y-5">
        <div>
          <label className="label">Example content (voice sample)</label>
          <textarea
            name="example_content"
            className="input min-h-[140px]"
            defaultValue={initial?.example_content ?? ""}
            placeholder="Paste a representative sample of your existing on-brand copy."
          />
        </div>
        <div>
          <label className="label">Style guide rules</label>
          <textarea
            name="style_rules"
            className="input min-h-[100px]"
            defaultValue={initial?.style_rules ?? ""}
            placeholder="e.g. Use Oxford commas. Write in second person. Sentence case headings."
          />
        </div>
        <div>
          <label className="label">Words & phrases to avoid</label>
          <input
            name="words_to_avoid"
            className="input"
            defaultValue={initial?.words_to_avoid ?? ""}
            placeholder="synergy, leverage, game-changer"
          />
        </div>
      </div>

      <SaveBar />
    </form>
  );
}

function SaveBar() {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-4 flex justify-end">
      <button type="submit" disabled={pending} className="btn-primary shadow-soft">
        {pending && <Spinner />}
        {pending ? "Saving…" : "Save brand voice"}
      </button>
    </div>
  );
}
