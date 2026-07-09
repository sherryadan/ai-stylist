"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Shirt, Watch, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const floatingCards = [
  {
    icon: Shirt,
    label: "Casual",
    sub: "Streetwear",
    color: "from-pink-500/20 to-purple-500/20",
    x: "left-[5%]",
    y: "top-[15%]",
    delay: "animate-float",
  },
  {
    icon: Watch,
    label: "Luxury",
    sub: "Accessories",
    color: "from-blue-500/20 to-cyan-500/20",
    x: "right-[8%]",
    y: "top-[20%]",
    delay: "animate-float-delayed",
  },
  {
    icon: ShoppingBag,
    label: "Formal",
    sub: "Premium Edit",
    color: "from-amber-500/20 to-orange-500/20",
    x: "right-[12%]",
    y: "bottom-[18%]",
    delay: "animate-float",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-pink-500/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      {/* Floating cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.2, duration: 0.6 }}
          className={cn(
            "absolute hidden lg:block",
            card.x,
            card.y,
            card.delay
          )}
        >
          <div className="glass rounded-2xl p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
            <div
              className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2",
                card.color
              )}
            >
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-foreground">{card.label}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            AI-Powered Fashion Styling
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
        >
          <span className="gradient-text">Your AI Personal</span>
          <br />
          <span className="text-foreground">Fashion Stylist</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Find your perfect outfit in seconds. Our AI analyzes your style, body type, and occasion
          to curate personalized fashion recommendations from top brands.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/stylist">
            <Button
              size="lg"
              className="h-12 px-8 rounded-full gradient-bg text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105 text-base"
            >
              <Sparkles className="h-5 w-5" />
              Get Styled
            </Button>
          </Link>
          <Link href="/partner-brands">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full text-base border-border hover:bg-secondary/50"
            >
              Explore Brands
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
        >
          {[
            ["10K+", "Outfits Styled"],
            ["50+", "Brand Partners"],
            ["95%", "Accuracy Rate"],
            ["4.9/5", "User Rating"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold gradient-text">{val}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
