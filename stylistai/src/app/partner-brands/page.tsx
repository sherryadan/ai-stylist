import Link from "next/link";

export default function PartnerBrandsPage() {
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">Retailer partnerships</h1>
        <p className="mt-5 max-w-xl text-lg text-stone-700">StylistAI plans to feature approved Pakistani menswear catalogs. Shoppers will purchase directly from retailers once live products are available.</p>
        <div className="mt-8 rounded-2xl border border-stone-300 bg-[#fffbf5] p-6">
          <h2 className="font-serif text-2xl">Catalog onboarding</h2>
          <p className="mt-3 text-stone-700">A live catalog needs retailer approval, product and image permissions, accurate prices, size and stock data, shopping URLs, and delivery coverage. The current catalog contains samples.</p>
          <Link href="/sample-catalog" className="mt-4 inline-block underline underline-offset-4">Browse the sample catalog</Link>
        </div>
      </div>
    </section>
  );
}
