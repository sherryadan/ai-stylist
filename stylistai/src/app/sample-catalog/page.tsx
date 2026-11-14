import Link from "next/link";
import { sampleMenswear } from "@/data/sample-menswear";

export default function SampleCatalogPage() {
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">The sample edit</h1>
        <p className="mt-4 max-w-lg text-stone-700">Explore the demonstration menswear used by the local prototype. Prices and sizes are sample values. Shopping links are unavailable.</p>
        <Link href="/styling-requests" className="mt-5 inline-block underline underline-offset-4">Plan a look</Link>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleMenswear.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-2xl border border-stone-300 bg-[#fffbf5] motion-safe:transition-transform motion-safe:hover:-translate-y-1">
              <div aria-hidden="true" className="h-28" style={{ backgroundColor: item.swatch }} />
              <div className="p-5">
                <p className="text-sm text-stone-700">{item.category} · {item.color}</p>
                <h2 className="mt-1 font-serif text-2xl">{item.name}</h2>
                <p className="mt-2">PKR {item.price.toLocaleString("en-PK")}</p>
                <p className="mt-2 text-sm text-stone-700">Sample sizes {item.variants.map(({ size }) => size).join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
