"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { label: "Sample catalog", href: "/sample-catalog" },
  { label: "Styling history", href: "/styling-history" },
  { label: "Saved looks", href: "/saved-outfits" },
  { label: "Profile", href: "/profile" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-[#312923]/15 bg-[#f5eee3]/95 text-[#241d19] backdrop-blur"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          toggle.current?.focus();
        }
      }}>
      <div className="mx-auto flex min-h-[4.5rem] max-w-[90rem] items-center justify-between gap-4 px-5 sm:px-9 lg:px-12">
        <Link href="/" onClick={() => setOpen(false)} className="inline-flex min-h-11 shrink-0 items-center font-serif text-3xl leading-none tracking-[-0.07em]" aria-label="StylistAI home">
          Stylist<span className="italic text-[#843e32]">AI</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm lg:flex">
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              className="underline-offset-4 hover:underline aria-[current=page]:underline">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/styling-requests" onClick={() => setOpen(false)} className="hidden min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#2b221d] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#843e32] min-[360px]:inline-flex">
            Plan a look <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
          <button ref={toggle} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls={open ? "mobile-navigation" : undefined}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[#312923]/30 lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && <motion.nav id="mobile-navigation" aria-label="Main navigation" initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }}
          className="absolute inset-x-0 top-full grid border-b border-[#312923]/15 bg-[#f5eee3] px-5 pb-4 shadow-lg lg:hidden">
          <Link href="/styling-requests" onClick={() => setOpen(false)} className="border-b border-[#312923]/15 py-4 text-sm min-[360px]:hidden">Plan a look</Link>
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)} className="border-b border-[#312923]/15 py-4 text-sm last:border-0 aria-[current=page]:underline">{label}</Link>
          ))}
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}
