import Link from "next/link";

const steps = [
  { title: "Set up your profile", detail: "Choose your clothing preference and optionally add a delivery city and sizes. Use sample details for the local prototype." },
  { title: "Plan for an occasion", detail: "Choose eastern, western, or mixed menswear and set an item budget in PKR. Add a dress code, sizes, or exclusions when they matter." },
  { title: "Compare complete looks", detail: "Get up to three sample combinations that fit the request. Swap eligible items, save a look, or revisit it from styling history." },
];

export default function HowItWorksPage() {
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">How styling works</h1>
        <p className="mt-5 max-w-xl text-stone-700">The local prototype uses a demonstration catalog. It can show sample sizes and prices, and item subtotals exclude shipping and taxes.</p>
        <ol className="editorial-enter mt-8 grid gap-4 lg:grid-cols-3">
          {steps.map(({ title, detail }) => (
            <li key={title} className="rounded-2xl border border-stone-300 bg-[#fffbf5] p-6">
              <h2 className="font-serif text-2xl">{title}</h2><p className="mt-2 text-stone-700">{detail}</p>
            </li>
          ))}
        </ol>
        <Link href="/styling-requests" className="mt-8 inline-block rounded-full bg-stone-950 px-5 py-3 text-white">Plan a look</Link>
      </div>
    </section>
  );
}
