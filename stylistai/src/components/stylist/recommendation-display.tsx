"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  Star,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Sun,
  Palette,
  Target,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatPrice } from "@/utils/format";
import type {
  OutfitRecommendation,
  OutfitItem,
  ProductCategory,
  StyleAnalysis,
} from "@/types";

const categoryLabels: Record<ProductCategory, string> = {
  top: "Top",
  bottom: "Bottom",
  shoes: "Shoes",
  watch: "Watch",
  bag: "Bag",
  belt: "Belt",
  accessory: "Accessories",
  perfume: "Perfume",
  outerwear: "Outerwear",
  jewelry: "Jewelry",
  sunglasses: "Sunglasses",
  hat: "Hat",
};

const categoryGradients: Record<ProductCategory, string> = {
  top: "from-blue-500 to-cyan-500",
  bottom: "from-indigo-500 to-purple-500",
  shoes: "from-emerald-500 to-teal-500",
  watch: "from-amber-500 to-orange-500",
  bag: "from-rose-500 to-pink-500",
  belt: "from-stone-500 to-neutral-500",
  accessory: "from-violet-500 to-fuchsia-500",
  perfume: "from-sky-500 to-indigo-500",
  outerwear: "from-slate-500 to-gray-500",
  jewelry: "from-yellow-500 to-amber-500",
  sunglasses: "from-cyan-500 to-blue-500",
  hat: "from-red-500 to-rose-500",
};

const analysisSections: {
  key: keyof StyleAnalysis;
  label: string;
  icon: typeof Sparkles;
}[] = [
  { key: "colorPsychology", label: "Color Psychology", icon: Palette },
  { key: "fashionPrinciples", label: "Fashion Principles", icon: Sparkles },
  { key: "bodyTypeCompatibility", label: "Body Type Compatibility", icon: Target },
  { key: "seasonSuitability", label: "Season Suitability", icon: Sun },
  { key: "occasionAppropriateness", label: "Occasion Appropriateness", icon: Star },
  { key: "currentTrends", label: "Current Trends", icon: TrendingUp },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-3 w-3 fill-amber-400 text-amber-400"
        />
      ))}
      {hasHalf && (
        <div className="relative">
          <Star className="h-3 w-3 text-neutral-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-3 w-3 text-neutral-300" />
      ))}
    </div>
  );
}

function ScorePanel({ outfit }: { outfit: OutfitRecommendation }) {
  const scoreItems = [
    {
      label: "Overall Score",
      value: outfit.score.overall,
      icon: Target,
      color: outfit.score.overall >= 85 ? "text-emerald-500" : outfit.score.overall >= 75 ? "text-amber-500" : "text-red-500",
    },
    {
      label: "Confidence",
      value: outfit.score.confidence,
      icon: ShieldCheck,
      color: "text-blue-500",
    },
    {
      label: "Occasion Match",
      value: outfit.score.occasionMatch,
      icon: Star,
      color: "text-violet-500",
    },
    {
      label: "Weather Match",
      value: outfit.score.weatherMatch,
      icon: Sun,
      color: "text-amber-500",
    },
    {
      label: "Color Harmony",
      value: outfit.score.colorHarmony,
      icon: Palette,
      color: "text-rose-500",
    },
    {
      label: "Trend Score",
      value: outfit.score.trendScore,
      icon: TrendingUp,
      color: "text-cyan-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {scoreItems.map((item) => (
          <Card key={item.label} className="bg-white/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className={cn("h-4 w-4", item.color)} />
                <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{item.value}</span>
                <span className="text-xs text-neutral-400 mb-1">%</span>
              </div>
              <Progress value={item.value} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">Estimated Total Cost</span>
          </div>
          <span className="text-lg font-bold">
            {formatPrice(outfit.totalCost)}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

function OutfitItemCard({ item }: { item: OutfitItem }) {
  const product = item.product;
  const grad = categoryGradients[item.category] || "from-neutral-500 to-neutral-500";
  const firstColor = product.colors[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300">
        {/* Color placeholder */}
        <div
          className={cn(
            "relative h-32 bg-gradient-to-br flex items-center justify-center overflow-hidden",
            grad
          )}
        >
          {firstColor && (
            <div
              className="absolute inset-4 rounded-xl opacity-30"
              style={{ backgroundColor: firstColor.hex }}
            />
          )}
          <div className="relative z-10 text-center px-4">
            <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              {categoryLabels[item.category]}
            </p>
            <p className="text-[10px] text-white/70 mt-1 line-clamp-1">
              {product.productName}
            </p>
          </div>
          {/* Color dots */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.hex}
                className="h-2 w-2 rounded-full border border-white/30"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <CardContent className="p-3 space-y-2">
          <div>
            <p className="text-xs font-medium leading-tight line-clamp-1">
              {product.productName}
            </p>
            <p className="text-[10px] text-neutral-500">{product.brand}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              {formatPrice(product.price)}
            </span>
            <StarRating rating={product.rating} />
          </div>

          <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {product.styleTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 text-xs gap-1 mt-1"
            onClick={() => window.open(product.purchaseUrl, "_blank", "noopener,noreferrer")}
          >
            Buy from {product.brand}
            <ExternalLink className="h-3 w-3" />
          </Button>

          <p className="text-[10px] text-neutral-400 italic leading-snug border-t border-neutral-100 dark:border-neutral-800 pt-2">
            {item.reason}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OutfitGrid({ items }: { items: OutfitItem[] }) {
  const categoriesPresent = new Set(items.map((i) => i.category));
  const allCategories: ProductCategory[] = [
    "top",
    "bottom",
    "shoes",
    "watch",
    "bag",
    "belt",
    "accessory",
    "outerwear",
    "perfume",
    "jewelry",
    "sunglasses",
    "hat",
  ];

  const missingCategories = allCategories.filter(
    (cat) => !categoriesPresent.has(cat)
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <OutfitItemCard key={`${item.category}-${item.product.id}`} item={item} />
        ))}

        {/* Placeholder cards for missing items */}
        {missingCategories.slice(0, Math.max(0, 6 - items.length)).map((cat) => (
          <Card
            key={cat}
            className="border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30"
          >
            <div className="h-32 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  {categoryLabels[cat]}
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-neutral-400 text-center">
                No match found
              </p>
              <p className="text-[10px] text-neutral-400 text-center mt-1">
                Try adjusting your preferences
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AIExplanation({ explanation }: { explanation: string }) {
  return (
    <Card className="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1">AI Stylist&apos;s Note</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StyleAnalysisSection({
  analysis,
}: {
  analysis: StyleAnalysis;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Style Analysis</h3>
      <div className="grid gap-2">
        {analysisSections.map((section, idx) => {
          const isExpanded = expandedIndex === idx;
          const Icon = section.icon;
          const content = analysis[section.key];
          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedIndex(isExpanded ? null : idx)
                }
                className="w-full text-left"
              >
                <Card className="bg-white/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50 hover:bg-white/80 dark:hover:bg-neutral-900/80 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-neutral-500" />
                        <span className="text-sm font-medium">
                          {section.label}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-neutral-400" />
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
                            {content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface RecommendationDisplayProps {
  results: OutfitRecommendation[];
  onStartOver: () => void;
}

export default function RecommendationDisplay({
  results,
  onStartOver,
}: RecommendationDisplayProps) {
  const [selectedTab, setSelectedTab] = useState<string>(results[0]?.type || "balanced");

  const currentOutfit = results.find((r) => r.type === selectedTab) || results[0];

  if (!results.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <p className="text-lg font-medium">No recommendations generated</p>
        <p className="text-sm text-neutral-500">
          Try adjusting your preferences and try again.
        </p>
        <Button onClick={onStartOver} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your AI Styled Outfits
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Curated just for you based on your preferences
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onStartOver}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>

      {currentOutfit && (
        <>
          {/* Tabs */}
          <div className="flex justify-center">
            <Tabs
              value={selectedTab}
              onValueChange={(v) => setSelectedTab(v as "budget" | "premium" | "balanced")}
              className="w-full"
            >
              <div className="flex justify-center">
                <TabsList>
                  {results.map((outfit) => (
                    <TabsTrigger key={outfit.type} value={outfit.type} className="gap-2 capitalize">
                      {outfit.type === "budget" && <DollarSign className="h-3.5 w-3.5" />}
                      {outfit.type === "balanced" && <ShieldCheck className="h-3.5 w-3.5" />}
                      {outfit.type === "premium" && <Sparkles className="h-3.5 w-3.5" />}
                      {outfit.type}
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                        {formatPrice(outfit.totalCost)}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <Separator className="my-6" />

              <AnimatePresence mode="wait">
                <TabsContent key={selectedTab} value={selectedTab} className="space-y-8">
                  {/* Outfit name */}
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{currentOutfit.name}</h2>
                  </div>

                  {/* Score Panel */}
                  <ScorePanel outfit={currentOutfit} />

                  {/* AI Explanation */}
                  <AIExplanation explanation={currentOutfit.explanation} />

                  {/* Outfit Grid */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Complete Outfit</h3>
                    <OutfitGrid items={currentOutfit.items} />
                  </div>

                  {/* Style Analysis */}
                  <StyleAnalysisSection analysis={currentOutfit.styleAnalysis} />
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </>
      )}
    </motion.div>
  );
}
