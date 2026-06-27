"use client";

import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";

export function GoogleButton({ label }: { label: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Google sign-in isn't available yet. Enable it in your Supabase project.",
        "error",
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="btn-secondary w-full"
    >
      {loading ? (
        <Spinner />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#FFC107"
            d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 110-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1024 44a20 20 0 0019.6-23.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8A12 12 0 0124 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 006.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0124 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5A20 20 0 0024 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H24v8h11.3a12 12 0 01-4.1 5.6l6.2 5.2C39.9 36.5 44 31 44 24c0-1.2-.1-2.4-.4-3.5z"
          />
        </svg>
      )}
      {label}
    </button>
  );
}
