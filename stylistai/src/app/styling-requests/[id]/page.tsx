import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentLocalAccount, readLocalStylingRequest } from "@/lib/local-account";
import { occasions } from "@/data/occasions";

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await currentLocalAccount())) redirect("/profile");
  const request = await readLocalStylingRequest((await params).id);
  if (!request) notFound();
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-5xl">Styling request saved</h1>
        <p className="mt-5">{request.category} menswear for {occasions.find(({ id }) => id === request.occasion)?.name}.</p>
        <p className="mt-2">Item budget PKR {request.budget.toLocaleString("en-PK")}</p>
        <Link className="mt-6 inline-block underline underline-offset-4" href="/styling-requests">Plan another look</Link>
      </div>
    </section>
  );
}
