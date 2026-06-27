import { requireProfile, getBrandProfile } from "@/lib/data";
import { BrandForm } from "@/components/brand/BrandForm";

export const metadata = { title: "Brand Voice — AI Sage" };

export default async function BrandPage() {
  const profile = await requireProfile();
  const brand = await getBrandProfile(profile.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1">Brand Voice & Style Guide</h1>
        <p className="mt-1 text-gray-400">
          AI Sage applies these guidelines to every draft it writes.
        </p>
      </header>
      <BrandForm initial={brand} />
    </div>
  );
}
