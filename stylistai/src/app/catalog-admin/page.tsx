import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentLocalAccount, localAccountEnabled } from "@/lib/local-account";
import { csvHeader } from "@/services/sample-collection-import";
import { CatalogImportForm } from "./catalog-import-form";

export default async function CatalogAdminPage() {
  if (!localAccountEnabled() || (process.env.STYLIST_LOCAL_ADMIN_TOKEN?.length ?? 0) < 24) notFound();
  if (!(await currentLocalAccount())) redirect("/profile");
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-5xl">Import sample menswear</h1>
        <p className="mt-4">Load or paste up to 100 rows of UTF-8 CSV. Separate lists with a vertical bar. An existing SKU updates the item. An empty size list makes it unavailable for matching.</p>
        <Link className="mt-3 inline-block underline" href="/sample-catalog">Browse sample catalog</Link>
        <CatalogImportForm example={`${csvHeader}\nexample-jacket,Sand sample jacket,Sample Studio,Western,upper,4500,Sand,#c2aa81,Smart casual,S|M|L,Pakistan`} />
      </div>
    </section>
  );
}
