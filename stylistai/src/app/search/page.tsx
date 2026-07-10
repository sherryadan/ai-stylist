"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { styles } from "@/data/styles";
import { occasions } from "@/data/occasions";
import { formatPrice } from "@/utils/format";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

const recentSearches = ["summer outfit", "business casual", "wedding guest", "streetwear"];
const popularSearches = ["Nike shoes", "formal blazer", "leather jacket", "party wear"];

const allColors = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Olive", hex: "#556B2F" },
];

const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Rating"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState([500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.styleTags.some((s) => s.includes(q)) ||
          p.occasionTags.some((o) => o.includes(q))
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (selectedStyles.length > 0) {
      result = result.filter((p) =>
        p.styleTags.some((s) => selectedStyles.includes(s))
      );
    }
    if (selectedOccasions.length > 0) {
      result = result.filter((p) =>
        p.occasionTags.some((o) => selectedOccasions.includes(o))
      );
    }
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }
    result = result.filter((p) => p.price <= budget[0]);

    switch (sortBy) {
      case "Price: Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [query, budget, selectedBrands, selectedStyles, selectedOccasions, selectedColors, sortBy]);

  const toggleFilter = (
    arr: string[],
    setter: (v: string[]) => void,
    value: string
  ) => {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  const hasAnyFilters =
    selectedBrands.length > 0 ||
    selectedStyles.length > 0 ||
    selectedOccasions.length > 0 ||
    selectedColors.length > 0;

  const empty = hasSearched && !isSearching && filteredProducts.length === 0;

  return (
    <div className="min-h-screen pt-24">
      {/* Search Bar */}
      <section className="px-4 pb-6">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search outfits, brands, styles..."
                className="h-14 pl-12 pr-24 text-base rounded-2xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-10",
                    showFilters && "bg-secondary"
                  )}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="h-10 gradient-bg text-white border-0"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Chips */}
      <section className="px-4 pb-6">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Recent searches */}
          <FadeIn>
            <div className="flex flex-wrap items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    handleSearch();
                  }}
                  className="rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </FadeIn>
          {/* Popular searches */}
          <FadeIn delay={0.05}>
            <div className="flex flex-wrap items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
              {popularSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    handleSearch();
                  }}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary/80"
                >
                  {s}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur overflow-y-auto p-6 pt-20 lg:static lg:z-auto lg:bg-transparent lg:backdrop-blur-none lg:overflow-visible lg:p-0 lg:block">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>
              <FadeIn direction="left">
                <div className="sticky top-24 w-64 shrink-0 space-y-6 rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  {hasAnyFilters && (
                    <button
                      onClick={() => {
                        setSelectedBrands([]);
                        setSelectedStyles([]);
                        setSelectedOccasions([]);
                        setSelectedColors([]);
                        setBudget([500]);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <p className="mb-3 text-sm font-medium">Max Budget</p>
                  <Slider
                    value={budget}
                    onValueChange={(v) => setBudget(v)}
                    max={500}
                    step={10}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Up to ${budget[0]}
                  </p>
                </div>

                <Separator />

                {/* Brands */}
                <div>
                  <p className="mb-3 text-sm font-medium">Brands</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedBrands.includes(brand.name)}
                          onCheckedChange={() =>
                            toggleFilter(
                              selectedBrands,
                              setSelectedBrands,
                              brand.name
                            )
                          }
                        />
                        <span className="text-sm">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Styles */}
                <div>
                  <p className="mb-3 text-sm font-medium">Styles</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {styles.slice(0, 8).map((style) => (
                      <label
                        key={style.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedStyles.includes(style.id)}
                          onCheckedChange={() =>
                            toggleFilter(
                              selectedStyles,
                              setSelectedStyles,
                              style.id
                            )
                          }
                        />
                        <span className="text-sm">{style.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Occasions */}
                <div>
                  <p className="mb-3 text-sm font-medium">Occasions</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {occasions.slice(0, 8).map((occ) => (
                      <label
                        key={occ.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedOccasions.includes(occ.id)}
                          onCheckedChange={() =>
                            toggleFilter(
                              selectedOccasions,
                              setSelectedOccasions,
                              occ.id
                            )
                          }
                        />
                        <span className="text-sm">{occ.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Colors */}
                <div>
                  <p className="mb-3 text-sm font-medium">Colors</p>
                  <div className="space-y-2">
                    {allColors.map((color) => (
                      <label
                        key={color.name}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedColors.includes(color.name)}
                          onCheckedChange={() =>
                            toggleFilter(
                              selectedColors,
                              setSelectedColors,
                              color.name
                            )
                          }
                        />
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{
                            backgroundColor: color.hex,
                            borderColor:
                              color.hex === "#FFFFFF"
                                ? "#e4e4e7"
                                : color.hex,
                          }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                </div>
              </FadeIn>
            </div>
          )}

          {/* Mobile Filter Button */}
          {showFilters && (
            <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden">
              <Button
                className="shadow-xl gradient-bg text-white border-0"
                onClick={() => setShowFilters(false)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {hasSearched
                  ? `${filteredProducts.length} results${
                      query ? ` for "${query}"` : ""
                    }`
                  : "Search to see results"}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border bg-card px-3 py-1.5 text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Loading state */}
            {isSearching && (
              <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <StaggerItem key={i}>
                    <Card className="overflow-hidden">
                      <Skeleton className="h-40 rounded-none" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            {/* Empty state */}
            {empty && (
              <FadeIn>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-bold">No results found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              </FadeIn>
            )}

            {/* Search prompt state */}
            {!hasSearched && !isSearching && (
              <FadeIn>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold">Search our catalog</h3>
                  <p className="mt-2 text-muted-foreground">
                    Find the perfect outfit from 5,000+ products
                  </p>
                </div>
              </FadeIn>
            )}

            {/* Results grid */}
            {hasSearched && !isSearching && !empty && (
              <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.slice(0, 30).map((product) => (
                  <StaggerItem key={product.id}>
                    <Card className="group overflow-hidden border-0 bg-secondary/30 transition-shadow hover:shadow-lg">
                      <div className="relative h-40 gradient-bg/60 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/20">
                          {product.brand.charAt(0)}
                        </span>
                        {product.isBestseller && (
                          <Badge className="absolute top-3 left-3 bg-amber-500 text-white border-0 text-xs">
                            Bestseller
                          </Badge>
                        )}
                        {product.originalPrice && (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 text-xs">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">
                          {product.brand}
                        </p>
                        <h3 className="mt-1 font-semibold line-clamp-1">
                          {product.productName}
                        </h3>
                        <div className="mt-2 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">
                            {product.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {product.styleTags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
