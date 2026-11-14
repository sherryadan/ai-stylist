import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/15 bg-[#2b221d] text-[#f5eee3]">
      <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-6 px-5 py-8 sm:px-9 lg:px-12">
        <Link href="/" className="font-serif text-3xl tracking-[-0.07em]">Stylist<span className="italic">AI</span></Link>
        <p className="text-sm text-[#ddd0bf]">A menswear styling prototype for Pakistan.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-sm">
          <Link href="/sample-catalog" className="underline-offset-4 hover:underline">Sample catalog</Link>
          <Link href="/profile" className="underline-offset-4 hover:underline">Style profile</Link>
        </nav>
      </div>
    </footer>
  );
}
