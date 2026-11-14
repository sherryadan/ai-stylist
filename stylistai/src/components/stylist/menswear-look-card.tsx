"use client";

import { useActionState, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MatchedLook } from "@/services/menswear-matching";
import { saveLook } from "@/app/saved-outfits/actions";
import { rateLook } from "@/app/styling-requests/feedback";

const money = (subtotal: number) => `PKR ${subtotal.toLocaleString("en-PK")}`;

function SaveLookForm({ requestId, lookId }: { requestId: string; lookId: string }) {
  const [status, action, pending] = useActionState(saveLook, "");
  return (
    <form className="mt-4" action={action}>
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="lookId" value={lookId} />
      <button className="rounded-full bg-stone-950 px-4 py-2 text-sm text-white disabled:opacity-60" disabled={pending || status === "Look saved."}>
        {pending ? "Saving…" : status === "Look saved." ? "Saved" : "Save look"}
      </button>
      {status && <p className="mt-2 text-sm" role="status">{status}</p>}
    </form>
  );
}

function LookFeedback({ requestId, lookId, rating }: { requestId: string; lookId: string; rating?: string }) {
  const [result, action, pending] = useActionState(rateLook, rating ?? "");
  const current = result === "like" || result === "dislike" ? result : rating;
  return (
    <form action={action} className="mt-4 flex flex-wrap gap-2" aria-label="Rate this look">
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="lookId" value={lookId} />
      {(["like", "dislike"] as const).map((value) => (
        <button key={value} type="submit" name="rating" value={value} aria-pressed={current === value} disabled={pending}
          className="rounded-full border border-stone-400 px-3 py-1.5 text-sm aria-pressed:border-stone-950 aria-pressed:bg-stone-950 aria-pressed:text-white disabled:opacity-60">
          {value === "like" ? "Like" : "Dislike"}
        </button>
      ))}
      <p className="basis-full text-sm" role="status">
        {pending ? "Recording feedback…" : current === result && current ? "Your rating is recorded." : result}
      </p>
    </form>
  );
}

export function MenswearLookCard({ initial, options, dressCode, requestId, feedback }: {
  initial: MatchedLook;
  options: MatchedLook[];
  dressCode: string;
  requestId: string;
  feedback: Record<string, string>;
}) {
  const [look, setLook] = useState(initial);
  const [slot, setSlot] = useState<string>();
  const reduced = useReducedMotion();
  const currentItem = look.items.find((item) => item.slot === slot);
  const alternatives = currentItem ? options.filter((option) =>
    option.items.length === look.items.length &&
    option.items.some((item) => item.slot === slot && item.id !== currentItem.id) &&
    look.items.every((item) => item.slot === slot || option.items.some((other) => other.id === item.id)),
  ).sort((first, second) => first.subtotal - second.subtotal).slice(0, 5) : [];

  return (
    <motion.li className="rounded-2xl border border-stone-300 bg-[#fffbf5] p-5"
      whileHover={reduced ? undefined : { y: -4 }} transition={{ duration: 0.18 }}>
      <div aria-live="polite">
        <h3 className="font-serif text-2xl">{look.items[0].name} look</h3>
        <p className="mt-2 font-medium">{money(look.subtotal)}</p>
        <p className="mt-2 text-sm text-stone-700">Pairs {look.items.map(({ color }) => color.toLowerCase()).join(", ")} for a complete look{dressCode ? ` within your ${dressCode.toLowerCase()} dress code` : ""}.</p>
      </div>
      <ul className="mt-4 divide-y divide-stone-200">
        {look.items.map((item) => (
          <li key={item.slot} className="flex gap-3 py-3">
            <span aria-hidden="true" className="mt-1 size-5 shrink-0 rounded-full border border-stone-400" style={{ backgroundColor: item.swatch }} />
            <div>
              <p>{item.name}</p>
              <p className="text-sm text-stone-700">{money(item.price)} · {item.brand}</p>
              <p className="text-sm text-stone-700">Sizes {item.variants.filter(({ inStock }) => inStock).map(({ size }) => size).join(", ")}</p>
              <button type="button" className="mt-1 text-sm underline underline-offset-4"
                aria-label={`Swap ${item.name}`} aria-expanded={slot === item.slot}
                onClick={() => setSlot(slot === item.slot ? undefined : item.slot)}>Swap item</button>
            </div>
          </li>
        ))}
      </ul>
      {currentItem && (
        <div className="mt-2 rounded-xl bg-stone-100 p-3">
          <h4 className="font-medium">Alternatives for {currentItem.name}</h4>
          {alternatives.length ? <ul className="mt-2 space-y-2">
            {alternatives.map((alternative) => {
              const item = alternative.items.find((candidate) => candidate.slot === slot);
              return (
                <li key={alternative.id}>
                  <button type="button" className="w-full rounded-lg border border-stone-300 bg-white p-2 text-left text-sm hover:bg-stone-200"
                    onClick={() => { setLook(alternative); setSlot(undefined); }}>
                    {item?.name} · {money(alternative.subtotal)} total
                    {alternative.subtotal < look.subtotal && <span className="block text-green-900">Save {money(look.subtotal - alternative.subtotal)}</span>}
                  </button>
                </li>
              );
            })}
          </ul> : <p className="mt-2 text-sm">No replacement meets this request’s constraints.</p>}
        </div>
      )}
      {look.id !== initial.id && <button type="button" className="mt-3 text-sm underline underline-offset-4"
        onClick={() => { setLook(initial); setSlot(undefined); }}>Reset to original look</button>}
      <SaveLookForm key={look.id} requestId={requestId} lookId={look.id} />
      <LookFeedback key={`feedback-${look.id}`} requestId={requestId} lookId={look.id} rating={feedback[look.id]} />
    </motion.li>
  );
}
