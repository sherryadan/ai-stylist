import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentShopper, readLocalStylingRequest } from "@/lib/local-account";
import { occasions } from "@/data/occasions";
import { MenswearResults } from "@/components/stylist/menswear-results";
import { stylingRequestDetails } from "@/lib/styling-request";

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await currentShopper())) redirect("/profile");
  const request = await readLocalStylingRequest((await params).id);
  if (!request) notFound();
  const details = stylingRequestDetails(request);
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-5xl">Styling request saved</h1>
        <p className="mt-5">{request.category} menswear for {occasions.find(({ id }) => id === request.occasion)?.name}.</p>
        <p className="mt-2">Item budget PKR {request.budget.toLocaleString("en-PK")}</p>
        {details.length > 0 && <details className="mt-4 max-w-xl rounded-xl border border-stone-300 bg-[#fffbf5] p-4">
          <summary className="cursor-pointer">Request details</summary>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {details.map(([label, value]) => <div key={label}>
              <dt className="font-medium">{label}</dt><dd className="break-words text-stone-700">{value}</dd>
            </div>)}
          </dl>
        </details>}
        <MenswearResults request={request} />
        <Link className="mt-6 inline-block underline underline-offset-4" href="/styling-requests">Plan another look</Link>
      </div>
    </section>
  );
}
