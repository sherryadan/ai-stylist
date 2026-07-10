"use client";

import { Star } from "lucide-react";
import { brands } from "@/data/brands";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { cn } from "@/lib/cn";

const priceRangeColors: Record<string, string> = {
  budget: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  "mid-range":
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  premium:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  luxury:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export default function BrandsShowcase() {
  return (
    <section className="py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Trusted by Leading <span className="gradient-text">Brands</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We partner with the world&apos;s most iconic fashion brands to bring you
              the best recommendations.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <StaggerItem key={brand.id}>
              <div className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 overflow-hidden">
                {/* Glass shimmer overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Brand name */}
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {brand.name}
                </h3>

                {/* Tagline */}
                <p className="text-sm text-muted-foreground italic mb-4">
                  &ldquo;{brand.tagline}&rdquo;
                </p>

                {/* Price range badge */}
                <Badge
                  variant="outline"
                  className={cn(
                    "mb-4 capitalize",
                    priceRangeColors[brand.priceRange]
                  )}
                >
                  {brand.priceRange}
                </Badge>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < Math.floor(brand.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {brand.rating}
                  </span>
                </div>

                {/* Product count */}
                <p className="text-sm text-muted-foreground">
                  {brand.productCount.toLocaleString()} products available
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <p className="mt-12 text-center text-xs text-muted-foreground/50">
            Partner brands shown are for illustrative purposes. All trademarks and
            brand names are property of their respective owners.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
