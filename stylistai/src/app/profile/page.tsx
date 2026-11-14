import { currentLocalAccount, localAccountEnabled, readLocalProfile } from "@/lib/local-account";
import { signIn, signOut } from "./actions";
import { ProfileForm } from "./profile-form";
import Link from "next/link";

function ageDisplay(birthDate: string, timezone: string) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(new Date());
  const [year, month, day] = today.split("-").map(Number);
  const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
  const date = Date.UTC(year, month - 1, day);
  const anniversary = Date.UTC(year, birthMonth - 1, birthDay);
  const latestYear = anniversary > date ? year - 1 : year;
  const elapsed = (date - Date.UTC(latestYear, birthMonth - 1, birthDay)) / 86_400_000;
  const years = latestYear - birthYear;
  return `${years} ${years === 1 ? "year" : "years"}, ${elapsed} ${elapsed === 1 ? "day" : "days"}`;
}

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const signedIn = await currentLocalAccount();
  const profile = signedIn ? await readLocalProfile() : undefined;
  const { saved } = await searchParams;

  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">Your style profile</h1>
          <p className="mt-5 max-w-sm text-lg text-stone-700">Set the preferences you want to carry into your styling requests.</p>
          {profile && <p className="mt-5 text-stone-700">Age · {ageDisplay(profile.birth_date, profile.timezone)}</p>}
        </div>
        <div className="rounded-3xl border border-stone-300 bg-[#fffbf5] p-6 sm:p-9">
          {signedIn ? <>
            {saved === "1" && <p role="status" className="mb-5 text-green-900">Profile saved.</p>}
            <ProfileForm profile={profile} />
            {profile && <div className="mt-6 flex flex-wrap gap-4">
              <Link className="underline underline-offset-4" href="/styling-requests">Plan a look</Link>
              <Link className="underline underline-offset-4" href="/styling-history">Styling history</Link>
            </div>}
            <form action={signOut} className="mt-6">
              <button className="underline underline-offset-4">Sign out</button>
            </form>
          </> : localAccountEnabled() ? (
            <form action={signIn}>
              <p className="mb-5 text-stone-700">Use the shared local test account with sample information.</p>
              <button className="rounded-full bg-stone-950 px-6 py-3 text-white hover:bg-orange-950">Open local test account</button>
            </form>
          ) : <p>Account sign-in is currently unavailable.</p>}
        </div>
      </div>
    </section>
  );
}
