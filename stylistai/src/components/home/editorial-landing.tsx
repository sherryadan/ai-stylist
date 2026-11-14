"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const edits = {
  Eastern: { title: "The eastern edit", description: "Build around a kurta set or pair separates with a Peshawari chappal or khussa.", color: "#e6d7c1" },
  Western: { title: "The western edit", description: "Start with an Oxford or poplin shirt, then balance it with tailored trousers and loafers.", color: "#d9dccd" },
  Mixed: { title: "The mixed edit", description: "Bring eastern and western pieces together and match the outfit to your occasion.", color: "#dfcec3" },
} as const;

export function EditorialLanding() {
  const [category, setCategory] = useState<keyof typeof edits>("Eastern");
  const reduced = useReducedMotion();
  const edit = edits[category];

  return (
    <div className="bg-[#f5eee3] text-[#241d19]">
      <section className="mx-auto grid max-w-[90rem] items-center gap-9 px-5 py-8 sm:px-9 sm:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-12 lg:py-14">
        <div className="editorial-enter">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#843e32] uppercase">Pakistani menswear</p>
          <h1 className="mt-5 max-w-2xl font-serif text-[clamp(4rem,8.4vw,8.5rem)] leading-[0.84] tracking-[-0.08em]">
            Dress for <em className="font-normal text-[#843e32]">the occasion.</em>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#594b42]">
            Plan an eastern, western, or mixed look around your occasion, size, and budget in PKR.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link href="/styling-requests" className="inline-flex items-center gap-4 rounded-full bg-[#2b221d] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#843e32]">
              Start styling <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/sample-catalog" className="text-sm underline underline-offset-4">Browse sample catalog</Link>
          </div>
        </div>
        <div className="editorial-image-enter relative isolate aspect-[4/4.7] max-h-[700px] overflow-hidden bg-[#c9ac8f]">
          <Image fill src="/editorial-menswear.webp" alt="Man in an ivory kurta and dark overshirt seated in a sunlit courtyard"
            className="object-cover object-top" sizes="(min-width: 1024px) 49vw, 100vw" preload />
        </div>
      </section>
      <section className="border-t border-[#312923]/15 bg-[#eee3d4] px-5 py-12 sm:px-9 lg:px-12 lg:py-20" aria-labelledby="edits-heading">
        <div className="mx-auto grid max-w-[84rem] gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <ArrowDown size={26} aria-hidden="true" className="mb-4 text-[#843e32]" />
            <h2 id="edits-heading" className="font-serif text-5xl tracking-[-0.05em]">Choose your edit</h2>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Clothing category">
              {(Object.keys(edits) as Array<keyof typeof edits>).map((value) => (
                <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}
                  className="rounded-full border border-[#2b221d]/35 px-4 py-2 text-sm transition-colors hover:bg-[#e0d2bf] aria-pressed:border-[#2b221d] aria-pressed:bg-[#2b221d] aria-pressed:text-white">
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="min-h-52" aria-live="polite">
            <AnimatePresence mode={reduced ? "sync" : "wait"} initial={false}>
              <motion.div key={category} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.16 }}
                className="h-full p-7 sm:p-9" style={{ backgroundColor: edit.color }}>
                <h3 className="font-serif text-4xl tracking-[-0.04em]">{edit.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-[#594b42]">{edit.description}</p>
                <Link href={`/styling-requests?category=${category}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
                  Plan a {category.toLowerCase()} look <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
