"use client";

import { Star, ShoppingBag, TrendingUp, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { brands } from "@/data/brands";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const priceRangeColors: Record<string, string> = {
  budget: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "mid-range": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  premium: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  luxury: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

const brandStats = [
  { icon: ShoppingBag, value: "10+", label: "Partner Brands" },
  { icon: TrendingUp, value: "5,000+", label: "Products Available" },
  { icon: Globe, value: "3", label: "Price Tiers" },
  { icon: ShieldCheck, value: "100%", label: "Authentic Products" },
];

export default function PartnerBrandsPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/3 w-96 h-96 bg-gradient-start/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-end/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Our Partner <span className="gradient-text">Brands</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              We collaborate with top fashion brands to bring you the best
              selection of products across every style and budget.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <strong>Disclaimer:</strong> Brand partnerships shown are for
              illustrative purposes. StylistAI does not guarantee active
              partnerships with all listed brands. Product availability and
              prices may vary.
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-secondary/50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {brandStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <stat.icon className="mx-auto h-6 w-6 gradient-text mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <StaggerItem key={brand.id}>
                <Card className="group flex h-full flex-col border-0 bg-secondary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-bg text-lg font-bold text-white">
                        {brand.name.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                          {brand.rating}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="mt-3">{brand.name}</CardTitle>
                    <p className="text-sm italic text-muted-foreground">
                      &ldquo;{brand.tagline}&rdquo;
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {brand.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.styleProfile.map((style) => (
                        <Badge key={style} variant="secondary" className="text-xs">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <Badge
                      className={priceRangeColors[brand.priceRange]}
                    >
                      {brand.priceRange}
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Explore Collection
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
