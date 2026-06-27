"use client";

import { useState, useTransition } from "react";
import { toggleIntegration } from "@/app/actions/integrations";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";

export function IntegrationCard({
  id,
  name,
  icon,
  category,
  initialConnected,
}: {
  id: string;
  name: string;
  icon: string;
  category: string;
  initialConnected: boolean;
}) {
  const { toast } = useToast();
  const [connected, setConnected] = useState(initialConnected);
  const [pending, startTransition] = useTransition();

  function onToggle() {
    const next = !connected;
    setConnected(next);
    startTransition(async () => {
      const res = await toggleIntegration(id, next);
      if (res.error) {
        setConnected(!next);
        return toast(res.error, "error");
      }
      toast(
        next ? `${name} connected.` : `${name} disconnected.`,
        next ? "success" : "info",
      );
    });
  }

  return (
    <div className="card flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-overlay text-2xl">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-100">{name}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={pending}
        className={connected ? "btn-secondary px-3 py-1.5 text-xs" : "btn-primary px-3 py-1.5 text-xs"}
      >
        {pending ? (
          <Spinner />
        ) : connected ? (
          "✓ Connected"
        ) : (
          "Connect"
        )}
      </button>
    </div>
  );
}
