import Link from "next/link";
import { redirect } from "next/navigation";
import { profileHandoff } from "@/lib/return-destination";
import { currentShopper, listLocalLooks } from "@/lib/local-account";
import { removeLook } from "./actions";

export default async function SavedOutfitsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  if (!(await currentShopper())) redirect(profileHandoff("/profile", "/saved-outfits"));
  const { page } = await searchParams;
  const index = typeof page === "string" && /^[1-9][0-9]{0,5}$/.test(page) ? Number(page) : 1;
  const outfits = await listLocalLooks((index - 1) * 20);

  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl tracking-tight sm:text-7xl">Your saved looks</h1>
        <Link className="mt-5 inline-block underline underline-offset-4" href="/styling-history">Browse styling history</Link>
        {outfits.length === 0 ? <p className="mt-8">There are no saved looks on this page.</p> : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {outfits.slice(0, 20).map(({ requestId, look }) => (
              <li key={requestId + look.id} className="rounded-2xl border border-stone-300 bg-[#fffbf5] p-5">
                <h2 className="font-serif text-2xl">{look.items[0].name} look</h2>
                <p className="mt-2">PKR {look.subtotal.toLocaleString("en-PK")} · Sample</p>
                <ul className="mt-3 list-inside list-disc text-sm text-stone-700">
                  {look.items.map(({ id, name }) => <li key={id}>{name}</li>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-4 text-sm">
                  <Link className="underline underline-offset-4" href={`/styling-requests/${requestId}`}>Open request</Link>
                  <form action={removeLook}>
                    <input type="hidden" name="requestId" value={requestId} />
                    <input type="hidden" name="lookId" value={look.id} />
                    <button className="min-h-11 text-red-900 underline underline-offset-4">Remove look</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
        <nav aria-label="Saved look pages" className="mt-6 flex gap-6">
          {index > 1 && <Link href={`/saved-outfits?page=${index - 1}`} className="underline">Previous page</Link>}
          {outfits.length > 20 && <Link href={`/saved-outfits?page=${index + 1}`} className="underline">Next page</Link>}
        </nav>
      </div>
    </section>
  );
}
