"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Heart,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Frown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoOutfits = [
  {
    id: 1,
    name: "Summer Casual Vibes",
    occasion: "Casual",
    dateSaved: "2024-06-15",
    items: ["Nike Air Max", "White Tee", "Denim Shorts", "Cap"],
    totalCost: 245,
    itemsCount: 4,
  },
  {
    id: 2,
    name: "Business Meeting Ready",
    occasion: "Business",
    dateSaved: "2024-06-10",
    items: ["Zara Blazer", "Oxford Shirt", "Slim Trousers", "Leather Shoes", "Watch"],
    totalCost: 520,
    itemsCount: 5,
  },
  {
    id: 3,
    name: "Date Night Elegance",
    occasion: "Date Night",
    dateSaved: "2024-06-08",
    items: ["Suede Jacket", "Black Shirt", "Dark Jeans", "Chelsea Boots"],
    totalCost: 310,
    itemsCount: 4,
  },
  {
    id: 4,
    name: "Weekend Explorer",
    occasion: "Travel",
    dateSaved: "2024-06-05",
    items: ["Windbreaker", "Joggers", "Running Shoes", "Backpack"],
    totalCost: 280,
    itemsCount: 4,
  },
  {
    id: 5,
    name: "Wedding Guest Look",
    occasion: "Wedding",
    dateSaved: "2024-06-01",
    items: ["Sherwani", "Dupatta", "Khussa", "Pendant"],
    totalCost: 450,
    itemsCount: 4,
  },
  {
    id: 6,
    name: "Conference Professional",
    occasion: "Conference",
    dateSaved: "2024-05-28",
    items: ["Suit Jacket", "Dress Shirt", "Tie", "Dress Pants", "Briefcase"],
    totalCost: 680,
    itemsCount: 5,
  },
];

const occasions = [
  "All",
  "Casual",
  "Business",
  "Date Night",
  "Travel",
  "Wedding",
  "Conference",
];

export default function SavedOutfitsPage() {
  const [occasionFilter, setOccasionFilter] = useState("All");

  const filtered =
    occasionFilter === "All"
      ? demoOutfits
      : demoOutfits.filter((o) => o.occasion === occasionFilter);

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold">
                  Saved <span className="gradient-text">Outfits</span>
                </h1>
                <p className="mt-1 text-muted-foreground">
                  You have {demoOutfits.length} saved outfits
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setOccasionFilter(occ)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      occasionFilter === occ
                        ? "gradient-bg text-white"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Outfit Grid */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          {filtered.length === 0 ? (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Frown className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-bold">No saved outfits</h3>
                <p className="mt-2 text-muted-foreground">
                  Start by getting an AI-powered outfit recommendation
                </p>
                <Link href="/stylist" className="mt-6">
                  <Button>
                    Get Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((outfit) => (
                <StaggerItem key={outfit.id}>
                  <Card className="group border-0 bg-secondary/30 overflow-hidden">
                    {/* Image placeholder */}
                    <div className="relative h-36 gradient-bg opacity-80 flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-white/40" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          {outfit.occasion}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold">{outfit.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Saved {outfit.dateSaved}
                      </div>
                      {/* Items preview */}
                      <div className="flex items-center gap-1.5">
                        {outfit.items.slice(0, 4).map((item) => (
                          <div
                            key={item}
                            className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg text-[8px] font-bold text-white"
                            title={item}
                          >
                            {item.charAt(0)}
                          </div>
                        ))}
                        {outfit.itemsCount > 4 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs text-muted-foreground">
                            +{outfit.itemsCount - 4}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        Total: ${outfit.totalCost}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1 text-muted-foreground"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        Favorite
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
