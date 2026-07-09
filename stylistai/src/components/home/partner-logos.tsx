"use client";

import { brands } from "@/data/brands";

export default function PartnerLogos() {
  return (
    <section className="py-16 overflow-hidden border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Partner Brands
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex overflow-hidden">
          <div className="flex animate-marquee gap-16 items-center">
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={`${brand.id}-${i}`}
                className="text-2xl sm:text-3xl font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-300 whitespace-nowrap select-none"
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground/50">
        Partner brands shown are for illustrative purposes
      </p>
    </section>
  );
}
