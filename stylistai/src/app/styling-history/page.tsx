import Link from "next/link";
import { redirect } from "next/navigation";
import { currentLocalAccount, listLocalStylingRequests, readLocalProfile } from "@/lib/local-account";
import { occasions } from "@/data/occasions";

export default async function StylingHistoryPage({ searchParams }: { searchParams: Promise<{ before?: string }> }) {
  if (!(await currentLocalAccount())) redirect("/profile");
  const { before } = await searchParams;
  const entries = await listLocalStylingRequests(typeof before === "string" ? before : undefined);
  const profile = await readLocalProfile();
  const date = new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeZone: profile?.timezone ?? "Asia/Karachi" });
  const displayed = entries.slice(0, 20);

  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">Your styling history</h1>
        <Link href="/styling-requests" className="mt-5 inline-block underline underline-offset-4">Plan a new look</Link>
        {displayed.length === 0 ? <p className="mt-8">There are no requests here yet.</p> : (
          <ul className="mt-8 divide-y divide-stone-300 rounded-2xl border border-stone-300 bg-[#fffbf5]">
            {displayed.map(({ request, createdAt }) => (
              <li key={request.id}>
                <Link className="flex flex-wrap items-baseline justify-between gap-3 rounded-2xl p-5 hover:bg-stone-100 focus-visible:outline-2" href={`/styling-requests/${request.id}`}>
                  <div>
                    <h2 className="font-serif text-2xl">{occasions.find(({ id }) => id === request.occasion)?.name ?? request.occasion}</h2>
                    <p className="mt-1 text-sm text-stone-700">{request.category} menswear · PKR {request.budget.toLocaleString("en-PK")}</p>
                  </div>
                  <time className="text-sm text-stone-700" dateTime={new Date(createdAt).toISOString()}>{date.format(createdAt)}</time>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <nav aria-label="Styling history pages" className="mt-6 flex gap-6">
          {before && <Link href="/styling-history" className="underline underline-offset-4">Latest requests</Link>}
          {entries.length > 20 && <Link href={`/styling-history?before=${displayed[19].request.id}`} className="underline underline-offset-4">Older requests</Link>}
        </nav>
      </div>
    </section>
  );
}
