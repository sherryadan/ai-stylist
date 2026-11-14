import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { currentLocalAccount, localDashboardSummary, readLocalProfile } from "@/lib/local-account";
import { occasions } from "@/data/occasions";

const links = [
  { title: "Plan a look", href: "/styling-requests", details: "Create an outfit request for your next occasion." },
  { title: "Saved looks", href: "/saved-outfits", details: "Reopen the sample looks you’ve saved." },
  { title: "Style profile", href: "/profile", details: "Manage your preferences and local test account." },
];

export default async function DashboardPage() {
  if (!(await currentLocalAccount())) redirect("/profile");
  const [profile, summary] = await Promise.all([readLocalProfile(), localDashboardSummary()]);
  if (!summary) redirect("/profile");
  const stats = [
    { label: "Styling requests", value: summary.requests },
    { label: "Saved looks", value: summary.saved },
    { label: "Looks rated", value: summary.feedback },
  ];

  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">Your styling desk</h1>
        <p className="mt-4 text-stone-700">{profile ? `Welcome, ${profile.name}.` : "Complete your style profile to start planning looks."} This activity is stored locally.</p>
        <dl className="editorial-enter mt-8 grid gap-3 sm:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-stone-300 bg-[#fffbf5] p-5">
              <dt className="text-sm text-stone-700">{label}</dt><dd className="mt-2 font-serif text-4xl">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {links.map(({ title, href, details }) => (
            <Link key={href} href={href} className="group rounded-2xl border border-stone-300 p-5 hover:bg-[#fffbf5]">
              <span className="flex items-center justify-between gap-2 font-serif text-2xl">{title}<ArrowUpRight aria-hidden="true" size={18} className="motion-safe:transition-transform motion-safe:group-hover:-translate-y-1" /></span>
              <p className="mt-2 text-sm text-stone-700">{details}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <h2 className="font-serif text-3xl">Recent requests</h2>
          {summary.recent.length ? <ul className="mt-4 divide-y divide-stone-300">
            {summary.recent.map((request) => (
              <li key={request.id}>
                <Link href={`/styling-requests/${request.id}`} className="flex flex-wrap justify-between gap-2 py-3 underline-offset-4 hover:underline">
                  <span>{occasions.find(({ id }) => id === request.occasion)?.name} · {request.category}</span>
                  <span>PKR {request.budget.toLocaleString("en-PK")}</span>
                </Link>
              </li>
            ))}
          </ul> : <p className="mt-4 text-stone-700">You haven’t submitted a styling request yet.</p>}
          <Link href="/styling-history" className="mt-4 inline-block underline underline-offset-4">Open styling history</Link>
        </div>
      </div>
    </section>
  );
}
