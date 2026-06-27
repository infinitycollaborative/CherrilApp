"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { BRAND_PERSONALITIES } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import type { BrandProfile } from "@/lib/types";
import {
  completeOnboarding,
  type SaveBrandState,
} from "@/app/actions/brand";

const STEPS = [
  { key: "personality", title: "Brand personality", sub: "How should your content feel?" },
  { key: "audience", title: "Audience & values", sub: "Who are you talking to?" },
  { key: "examples", title: "Content examples", sub: "Show us your existing voice." },
  { key: "rules", title: "Style guide rules", sub: "Set the hard rules." },
];

const DRAFT_KEY = "ai-sage-brand-draft";

export function BrandWizard({ initial }: { initial?: BrandProfile | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [state, action] = useActionState<SaveBrandState, FormData>(
    completeOnboarding,
    {},
  );

  // Local controlled state so values survive step navigation + autosave.
  const [form, setForm] = useState({
    brand_name: initial?.brand_name ?? "",
    personality: initial?.personality ?? ([] as string[]),
    tone: initial?.tone ?? "",
    audience: initial?.audience ?? "",
    values: initial?.values ?? "",
    example_content: initial?.example_content ?? "",
    style_rules: initial?.style_rules ?? "",
    words_to_avoid: initial?.words_to_avoid ?? "",
  });

  // Restore an in-progress draft from localStorage (data persistence on refresh)
  useEffect(() => {
    if (initial) return;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {
      /* ignore */
    }
  }, [initial]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  useEffect(() => {
    if (state.ok) {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      toast("Brand voice saved! Generating your workspace…", "success");
      router.push("/dashboard");
    } else if (state.error) {
      toast(state.error, "error");
    }
  }, [state, router, toast]);

  function togglePersonality(p: string) {
    setForm((f) => ({
      ...f,
      personality: f.personality.includes(p)
        ? f.personality.filter((x) => x !== p)
        : [...f.personality, p],
    }));
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const canContinue = step !== 0 || form.brand_name.trim().length > 0;

  return (
    <form action={action} className="card">
      {/* Hidden fields carry the controlled state into the server action */}
      <input type="hidden" name="brand_name" value={form.brand_name} />
      {form.personality.map((p) => (
        <input key={p} type="hidden" name="personality" value={p} />
      ))}
      <input type="hidden" name="tone" value={form.tone} />
      <input type="hidden" name="audience" value={form.audience} />
      <input type="hidden" name="values" value={form.values} />
      <input type="hidden" name="example_content" value={form.example_content} />
      <input type="hidden" name="style_rules" value={form.style_rules} />
      <input type="hidden" name="words_to_avoid" value={form.words_to_avoid} />

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-overlay">
          <div
            className="h-full rounded-full bg-brand-gradient transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-h3">{STEPS[step].title}</h2>
      <p className="mt-1 text-sm text-gray-400">{STEPS[step].sub}</p>

      <div className="mt-6 min-h-[260px] animate-fade-in" key={step}>
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="label">Brand / company name</label>
              <input
                className="input"
                value={form.brand_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, brand_name: e.target.value }))
                }
                placeholder="Acme SaaS"
                autoFocus
              />
            </div>
            <div>
              <label className="label">
                Pick the traits that describe your voice
              </label>
              <div className="flex flex-wrap gap-2">
                {BRAND_PERSONALITIES.map((p) => {
                  const on = form.personality.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => togglePersonality(p)}
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
              <label className="label">Describe your tone (optional)</label>
              <input
                className="input"
                value={form.tone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tone: e.target.value }))
                }
                placeholder="Confident but never salesy; helpful and concrete."
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="label">Who is your target audience?</label>
              <textarea
                className="input min-h-[90px]"
                value={form.audience}
                onChange={(e) =>
                  setForm((f) => ({ ...f, audience: e.target.value }))
                }
                placeholder="Content marketing managers at 10–500 person B2B SaaS companies."
              />
            </div>
            <div>
              <label className="label">What does your brand stand for?</label>
              <textarea
                className="input min-h-[90px]"
                value={form.values}
                onChange={(e) =>
                  setForm((f) => ({ ...f, values: e.target.value }))
                }
                placeholder="Practical over theoretical. Honest. Respect the reader's time."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <label className="label">
              Paste a sample of existing on-brand content
            </label>
            <textarea
              className="input min-h-[200px]"
              value={form.example_content}
              onChange={(e) =>
                setForm((f) => ({ ...f, example_content: e.target.value }))
              }
              placeholder="Paste a blog intro, a few LinkedIn posts, or any copy that sounds like you. AI Sage learns your voice from this."
            />
            <p className="text-xs text-gray-500">
              The more representative the sample, the closer every draft will
              match your voice.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="label">Style guide rules</label>
              <textarea
                className="input min-h-[120px]"
                value={form.style_rules}
                onChange={(e) =>
                  setForm((f) => ({ ...f, style_rules: e.target.value }))
                }
                placeholder="e.g. Use Oxford commas. Write in second person. Keep sentences under 25 words. Use sentence case for headings."
              />
            </div>
            <div>
              <label className="label">Words & phrases to avoid</label>
              <input
                className="input"
                value={form.words_to_avoid}
                onChange={(e) =>
                  setForm((f) => ({ ...f, words_to_avoid: e.target.value }))
                }
                placeholder="synergy, leverage, game-changer, revolutionary"
              />
            </div>
          </div>
        )}
      </div>

      {state.error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ← Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue}
          >
            Continue →
          </button>
        ) : (
          <FinishButton />
        )}
      </div>
    </form>
  );
}

function FinishButton() {
  // useFormStatus reads the pending state of the enclosing <form>.
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending && <Spinner />}
      {pending ? "Saving…" : "Finish setup ✓"}
    </button>
  );
}
