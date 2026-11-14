import type { StylingRequest } from "@/lib/styling-request";
import { sampleMenswear } from "@/data/sample-menswear";
import { matchMenswear } from "@/services/menswear-matching";

const money = (subtotal: number) => `PKR ${subtotal.toLocaleString("en-PK")}`;

export function MenswearResults({ request }: { request: StylingRequest }) {
  const { looks, eligible } = matchMenswear(request, sampleMenswear);

  return (
    <section aria-labelledby="sample-looks" className="mt-10">
      <h2 id="sample-looks" className="font-serif text-4xl">Your sample looks</h2>
      <p className="mt-3 text-stone-700">Demonstration items only. Item subtotals exclude shipping and taxes. Size listings do not guarantee fit.</p>
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
            {looks.map((look) => (
              <li key={look.id} className="rounded-2xl border border-stone-300 bg-[#fffbf5] p-5 motion-safe:transition-transform motion-safe:hover:-translate-y-1">
                <h3 className="font-serif text-2xl">{look.items[0].name} look</h3>
                <p className="mt-2 font-medium">{money(look.subtotal)}</p>
                <p className="mt-2 text-sm text-stone-700">Pairs {look.items.map(({ color }) => color.toLowerCase()).join(", ")} for a complete look{request.dressCode ? ` within your ${request.dressCode.toLowerCase()} dress code` : ""}.</p>
                <ul className="mt-4 divide-y divide-stone-200">
                  {look.items.map((item) => (
                    <li key={item.id} className="flex gap-3 py-3">
                      <span aria-hidden="true" className="mt-1 size-5 shrink-0 rounded-full border border-stone-400" style={{ backgroundColor: item.swatch }} />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-stone-700">{money(item.price)} · {item.brand}</p>
                        <p className="text-sm text-stone-700">Sizes {item.variants.filter(({ inStock }) => inStock).map(({ size }) => size).join(", ")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
