import { requireProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { INTEGRATION_PROVIDERS } from "@/lib/constants";
import { IntegrationCard } from "@/components/app/IntegrationCard";
import type { Integration } from "@/lib/types";

export const metadata = { title: "Integrations — AI Sage" };

export default async function IntegrationsPage() {
  await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase.from("integrations").select("*");
  const connected = new Set(
    ((data as Integration[]) ?? [])
      .filter((i) => i.connected)
      .map((i) => i.provider),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1">Integrations</h1>
        <p className="mt-1 text-gray-400">
          Connect AI Sage to the tools where your content lives.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {INTEGRATION_PROVIDERS.map((p) => (
          <IntegrationCard
            key={p.id}
            id={p.id}
            name={p.name}
            icon={p.icon}
            category={p.category}
            initialConnected={connected.has(p.id)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-gray-600">
        These are demo connections that persist your preference. Wire up OAuth
        per provider to go live.
      </p>
    </div>
  );
}
