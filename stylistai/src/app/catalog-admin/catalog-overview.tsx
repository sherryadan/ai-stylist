"use client";

import { useActionState } from "react";
import { viewCatalogOverview } from "./overview-action";

const localDate = new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });

export function CatalogOverview() {
  const [state, action, pending] = useActionState(viewCatalogOverview, { error: "" });
  const data = state.data;
  return (
    <section className="mt-10" aria-labelledby="catalog-overview">
      <h2 id="catalog-overview" className="font-serif text-4xl">Local catalog activity</h2>
      <form action={action} className="mt-4 flex flex-wrap items-end gap-4">
        <label>Administrator token
          <input className="mt-1 block rounded-md border border-stone-400 bg-white p-2" type="password" name="token" required maxLength={256} autoComplete="off" />
        </label>
        <button disabled={pending} className="rounded-full border border-stone-800 px-4 py-2 disabled:opacity-60">
          {pending ? "Loading activity…" : data ? "Refresh activity" : "View activity"}
        </button>
      </form>
      {state.error && <p role="alert" className="mt-3 text-red-900">{state.error}</p>}
      {data && (
        <div className="mt-5 rounded-2xl border border-stone-300 bg-[#fffbf5] p-5">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Object.entries({
              "Imported sample SKUs": data.imported,
              "In-stock sample SKUs": data.available,
              "Unavailable sample SKUs": data.imported - data.available,
              "Styling requests": data.requests,
              "Likes": data.likes,
              "Dislikes": data.dislikes,
              "Blueprint attempts": data.attempts,
              "Validated blueprints": data.successes,
            }).map(([label, value]) => (
              <div key={label}><dt className="text-sm text-stone-700">{label}</dt><dd className="font-serif text-3xl">{value}</dd></div>
            ))}
          </dl>
          <h3 className="mt-6 font-serif text-2xl">Recent successful imports</h3>
          {data.imports.length ? (
            <ul className="mt-2 divide-y divide-stone-300">
              {data.imports.map((entry) => (
                <li key={entry.id} className="flex flex-wrap justify-between gap-2 py-2">
                  <span>{entry.rows} {entry.rows === 1 ? "row" : "rows"}</span>
                  <time dateTime={new Date(entry.createdAt).toISOString()}>{localDate.format(entry.createdAt)} PKT</time>
                </li>
              ))}
            </ul>
          ) : <p className="mt-2">No successful imports yet.</p>}
        </div>
      )}
    </section>
  );
}
