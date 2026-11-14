"use client";

import { useActionState } from "react";
import type { LocalProfile } from "@/lib/local-account";
import { saveProfile } from "./actions";

const field = "mt-2 w-full rounded-lg border border-stone-400 bg-white px-4 py-3 text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-900";

export function ProfileForm({ profile }: { profile?: LocalProfile }) {
  const [error, action, pending] = useActionState(saveProfile, "");

  return (
    <form action={action} className="editorial-enter grid gap-5 sm:grid-cols-2">
      <label>Preferred name<input className={field} name="name" autoComplete="given-name" required maxLength={80} defaultValue={profile?.name} /></label>
      <label>Date of birth<input className={field} type="date" name="birth_date" required defaultValue={profile?.birth_date} /></label>
      <label>Clothing preference<select className={field} name="preference" defaultValue={profile?.preference ?? "Both"}>
        <option>Eastern</option><option>Western</option><option>Both</option>
      </select></label>
      <label>Timezone<input className={field} name="timezone" required list="profile-timezones" defaultValue={profile?.timezone ?? "Asia/Karachi"} /></label>
      <datalist id="profile-timezones">
        {Intl.supportedValuesOf("timeZone").map((zone) => <option key={zone} value={zone} />)}
      </datalist>
      <details className="rounded-lg border border-stone-300 p-4 sm:col-span-2">
        <summary className="cursor-pointer">Optional details</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>Delivery city<input className={field} name="city" maxLength={80} defaultValue={profile?.city} /></label>
          <label>Gender<input className={field} name="gender" maxLength={80} defaultValue={profile?.gender} /></label>
          <label>Clothing size<input className={field} name="clothing_size" maxLength={32} placeholder="e.g. M" defaultValue={profile?.clothing_size} /></label>
          <label>Shoe size<input className={field} name="shoe_size" maxLength={32} placeholder="e.g. EU 42" defaultValue={profile?.shoe_size} /></label>
          <label>Height (cm)<input className={field} name="height_cm" type="number" min={50} max={260} step={0.1} defaultValue={profile?.height_cm ?? ""} /></label>
          <label>Weight (kg)<input className={field} name="weight_kg" type="number" min={20} max={400} step={0.1} defaultValue={profile?.weight_kg ?? ""} /></label>
          <label>Preferred fit<select className={field} name="preferred_fit" defaultValue={profile?.preferred_fit ?? ""}>
            <option value="">No preference</option><option>Fitted</option><option>Regular</option><option>Relaxed</option>
          </select></label>
        </div>
      </details>
      {error && <p role="alert" className="text-red-900 sm:col-span-2">{error}</p>}
      <button disabled={pending} className="rounded-full bg-stone-950 px-6 py-3 text-white hover:bg-orange-950 disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
