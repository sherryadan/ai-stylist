import { randomUUID } from "node:crypto";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentShopper, readLocalProfile } from "@/lib/local-account";
import { RequestForm } from "./request-form";
import { occasions } from "@/data/occasions";
import { profileHandoff } from "@/lib/return-destination";

export default async function StylingRequestPage({ searchParams }: { searchParams: Promise<{ category?: string; occasion?: string }> }) {
  const signedIn = await currentShopper();
  const profile = signedIn ? await readLocalProfile() : undefined;
  const { category, occasion } = await searchParams;
  const initialCategory = category === "Eastern" || category === "Western" || category === "Mixed" ? category : undefined;
  const initialOccasion = occasions.find(({ id }) => id === occasion)?.id;
  const query = new URLSearchParams();
  if (initialCategory) query.set("category", initialCategory);
  if (initialOccasion) query.set("occasion", initialOccasion);
  const next = query.size ? `/styling-requests?${query}` : "/styling-requests";
  if (signedIn && !profile) redirect(profileHandoff("/profile", next));
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl tracking-tight sm:text-7xl">Plan a look</h1>
        {profile ? <RequestForm id={randomUUID()} profile={profile} initialCategory={initialCategory} initialOccasion={initialOccasion} /> : (
          <Link className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4" href={profileHandoff("/profile", next)}>
            Sign in to plan a look
          </Link>
        )}
      </div>
    </section>
  );
}
