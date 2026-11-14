import { randomUUID } from "node:crypto";
import Link from "next/link";
import { currentLocalAccount, readLocalProfile } from "@/lib/local-account";
import { RequestForm } from "./request-form";

export default async function StylingRequestPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const signedIn = await currentLocalAccount();
  const profile = signedIn ? await readLocalProfile() : undefined;
  const { category } = await searchParams;
  const initialCategory = category === "Eastern" || category === "Western" || category === "Mixed" ? category : undefined;
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">Plan a look</h1>
        {profile ? <RequestForm id={randomUUID()} profile={profile} initialCategory={initialCategory} /> : (
          <Link className="mt-6 inline-block underline underline-offset-4" href="/profile">
            {signedIn ? "Complete your style profile first" : "Open your local style profile to begin"}
          </Link>
        )}
      </div>
    </section>
  );
}
