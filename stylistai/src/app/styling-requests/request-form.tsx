"use client";

import { useActionState, useState, type FormEvent } from "react";
import { occasions } from "@/data/occasions";
import type { LocalProfile } from "@/lib/local-account";
import { stylingRequestDetails, stylingRequestSchema, type StylingRequest } from "@/lib/styling-request";
import { submitRequest } from "./actions";

const field = "mt-2 w-full rounded-lg border border-stone-400 bg-white px-3 py-2 text-stone-950";
const button = "rounded-full bg-stone-950 px-5 py-3 text-white hover:bg-orange-950 disabled:opacity-60";

export function RequestForm({ id, profile, initialCategory, initialOccasion }: {
  id: string;
  profile: LocalProfile;
  initialCategory?: StylingRequest["category"];
  initialOccasion?: string;
}) {
  const [request, setRequest] = useState<StylingRequest>();
  const [error, setError] = useState("");
  const [result, action, pending] = useActionState(submitRequest, "");
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = stylingRequestSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (parsed.success) {
      setError("");
      setRequest(parsed.data);
    } else {
      setError("Check the required fields and enter a positive whole-PKR budget.");
    }
  }

  return (
    <div className="editorial-enter mt-8 rounded-3xl border border-stone-300 bg-[#fffbf5] p-6 sm:p-9">
      <form hidden={Boolean(request)} onSubmit={review}>
        <input type="hidden" name="id" value={id} />
        <div className="grid gap-5 sm:grid-cols-2">
          <label>Occasion<select name="occasion" className={field} required defaultValue={initialOccasion ?? ""}>
            <option value="" disabled>Select an occasion</option>
            {occasions.map((occasion) => <option key={occasion.id} value={occasion.id}>{occasion.name}</option>)}
          </select></label>
          <label>Menswear category<select name="category" className={field} defaultValue={initialCategory ?? (profile.preference === "Both" ? "Mixed" : profile.preference)}>
            <option>Eastern</option><option>Western</option><option>Mixed</option>
          </select></label>
          <label>Budget (PKR)<input name="budget" className={field} type="number" min={1} max={99999999} step={1} required /></label>
          <label>Delivery city<input name="city" className={field} maxLength={100} defaultValue={profile.city} /></label>
          <label>Clothing size<input name="clothingSize" className={field} maxLength={100} defaultValue={profile.clothing_size} /></label>
          <label>Shoe size<input name="shoeSize" className={field} maxLength={100} defaultValue={profile.shoe_size} /></label>
          <label>Dress code<select name="dressCode" className={field}>
            <option value="">Any</option><option>Casual</option><option>Smart casual</option><option>Formal</option>
          </select></label>
          <label>Excluded colors<input name="avoidColors" className={field} maxLength={100} placeholder="Comma-separated" /></label>
          <label>Excluded brands<input name="avoidBrands" className={field} maxLength={100} placeholder="Comma-separated" /></label>
          <details className="rounded-lg border border-stone-300 p-4 sm:col-span-2">
            <summary className="cursor-pointer">Additional preferences</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>Preferred colors<input name="preferredColors" className={field} maxLength={100} placeholder="Comma-separated" /></label>
              <label>Preferred brands<input name="preferredBrands" className={field} maxLength={100} placeholder="Comma-separated" /></label>
              <label>Desired style<input name="style" className={field} maxLength={100} placeholder="e.g. understated, tailored" /></label>
              <label>Season or weather<input name="season" className={field} maxLength={100} placeholder="e.g. warm evening" /></label>
              <label>Preferred fit<select name="fit" className={field} defaultValue={profile.preferred_fit}>
                <option value="">No preference</option><option>Fitted</option><option>Regular</option><option>Relaxed</option>
              </select></label>
              <label className="sm:col-span-2">Styling notes<textarea name="notes" className={field} maxLength={500} /></label>
            </div>
            <p className="mt-3 text-sm text-stone-700">Color and brand preferences help rank sample looks. Style, weather, fit, and notes are saved as context.</p>
          </details>
        </div>
        {error && <p className="mt-4 text-red-900" role="alert">{error}</p>}
        <button className={`mt-6 ${button}`}>Review request</button>
      </form>
      {request && (
        <form action={action}>
          {Object.entries(request).map(([name, value]) => <input type="hidden" key={name} name={name} value={value} />)}
          <h2 className="font-serif text-3xl">Review your request</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><dt className="font-medium">Occasion</dt><dd>{occasions.find(({ id }) => id === request.occasion)?.name}</dd></div>
            <div><dt className="font-medium">Category</dt><dd>{request.category} menswear</dd></div>
            <div><dt className="font-medium">Item budget</dt><dd>PKR {request.budget.toLocaleString("en-PK")}</dd></div>
            {stylingRequestDetails(request).map(([label, value]) => (
                <div key={label}><dt className="font-medium">{label}</dt><dd className="break-words">{value}</dd></div>
              ))}
          </dl>
          <p className="mt-5 text-sm text-stone-700">Shipping and taxes are excluded. Edits apply only to this request.</p>
          {result && <p className="mt-4 text-red-900" role="alert">{result}</p>}
          <div className="mt-6 flex flex-wrap gap-4">
            <button className={button} disabled={pending}>{pending ? "Saving…" : "Save request"}</button>
            <button type="button" className="underline underline-offset-4" disabled={pending} onClick={() => setRequest(undefined)}>Edit request</button>
          </div>
        </form>
      )}
    </div>
  );
}
