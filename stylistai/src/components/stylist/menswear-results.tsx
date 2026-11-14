import type { StylingRequest } from "@/lib/styling-request";
import Link from "next/link";
import { currentSampleCatalog } from "@/lib/sample-catalog";
import { matchMenswear } from "@/services/menswear-matching";
import { MenswearLookCard } from "./menswear-look-card";
import { readLocalLookFeedback } from "@/lib/local-account";

const money = (subtotal: number) => `PKR ${subtotal.toLocaleString("en-PK")}`;

export async function MenswearResults({ request }: { request: StylingRequest }) {
  const { looks, eligible, options } = matchMenswear(request, currentSampleCatalog());
  const feedback = await readLocalLookFeedback(request.id);

  return (
    <section aria-labelledby="sample-looks" className="mt-10">
      <h2 id="sample-looks" className="font-serif text-4xl">Your sample looks</h2>
      <p className="mt-3 text-stone-700">Demonstration items only. Item subtotals exclude shipping and taxes. Size listings do not guarantee fit.</p>
      <Link href="/saved-outfits" className="mt-3 inline-block underline underline-offset-4">View saved looks</Link>
      {looks.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-stone-300 bg-[#fffbf5] p-5">
          <h3 className="font-serif text-2xl">No complete look matched</h3>
          <p className="mt-2">Try a higher budget or revise your size, dress code or exclusions in a new request.</p>
          {eligible.length > 0 && <>
            <p className="mt-4 font-medium">Individual matches · incomplete</p>
            <ul className="mt-2 list-inside list-disc">
              {eligible.slice(0, 5).map((item) => <li key={item.id}>{item.name} · {money(item.price)}</li>)}
            </ul>
          </>}
        </div>
      ) : (
        <>
          {looks.length < 3 && <p className="mt-4">The sample catalog has {looks.length} distinct garment {looks.length === 1 ? "combination" : "combinations"} for this request.</p>}
          <ul className="mt-6 grid gap-5 lg:grid-cols-3">
            {looks.map((look) => <MenswearLookCard key={look.id} initial={look} options={options} dressCode={request.dressCode} requestId={request.id} feedback={feedback} />)}
          </ul>
        </>
      )}
    </section>
  );
}
