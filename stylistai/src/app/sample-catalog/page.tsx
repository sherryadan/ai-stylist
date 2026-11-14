import Link from "next/link";
import { currentSampleCatalog } from "@/lib/sample-catalog";

export default async function SampleCatalogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const category = params.category === "Eastern" || params.category === "Western" ? params.category : "";
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const normalized = query.toLowerCase();
  const items = currentSampleCatalog().filter((item) => (!category || item.category === category) &&
    [item.name, item.brand, item.color, item.category].some((field) => field.toLowerCase().includes(normalized)));
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">The sample edit</h1>
        <p className="mt-4 max-w-lg text-stone-700">Explore the demonstration menswear used by the local prototype. Prices and sizes are sample values. Shopping links are unavailable.</p>
        <Link href="/styling-requests" className="mt-5 inline-block underline underline-offset-4">Plan a look</Link>
        <form className="mt-8 flex flex-wrap items-end gap-4" action="/sample-catalog">
          <label className="text-sm">Search the sample catalog
            <input name="q" defaultValue={query} maxLength={80} placeholder="Item, color or brand" className="mt-1 block rounded-lg border border-stone-400 bg-white px-3 py-2" />
          </label>
          <label className="text-sm">Category
            <select name="category" defaultValue={category} className="mt-1 block rounded-lg border border-stone-400 bg-white px-3 py-2">
              <option value="">All</option><option>Eastern</option><option>Western</option>
            </select>
          </label>
          <button className="rounded-full bg-stone-950 px-4 py-2 text-sm text-white">Apply filters</button>
          {(query || category) && <Link href="/sample-catalog" className="px-1 py-2 text-sm underline underline-offset-4">Clear filters</Link>}
        </form>
        {items.length === 0 && <p className="mt-6">No sample items matched these filters.</p>}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-2xl border border-stone-300 bg-[#fffbf5] motion-safe:transition-transform motion-safe:hover:-translate-y-1">
              <div aria-hidden="true" className="h-28" style={{ backgroundColor: item.swatch }} />
              <div className="p-5">
                <p className="text-sm text-stone-700">{item.category} · {item.color}</p>
                <h2 className="mt-1 font-serif text-2xl">{item.name}</h2>
                <p className="mt-2">PKR {item.price.toLocaleString("en-PK")}</p>
                <p className="mt-2 text-sm text-stone-700">{item.variants.length
                  ? `Sample sizes ${item.variants.map(({ size }) => size).join(", ")}`
                  : "Unavailable in the sample catalog"}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
