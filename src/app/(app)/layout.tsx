import { Sidebar } from "@/components/app/Sidebar";
import { requireProfile } from "@/lib/data";

// Auth-dependent: must render per request, never prerendered/cached.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
