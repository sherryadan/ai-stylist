"use client";

import { Sparkles, DollarSign, Palette, Wand2, ShoppingBag } from "lucide-react";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";

const steps = [
  {
    number: 1,
    icon: Sparkles,
    title: "Tell Us About You",
    description:
      "Share your style preferences, body type, and the occasion you're dressing for.",
  },
  {
    number: 2,
    icon: DollarSign,
    title: "Set Your Budget",
    description:
      "Choose your budget range and we'll find outfits that match your style and wallet.",
  },
  {
    number: 3,
    icon: Palette,
    title: "Choose Your Style",
    description:
      "Pick from streetwear to old-money, we've got every aesthetic covered.",
  },
  {
    number: 4,
    icon: Wand2,
    title: "AI Recommendations",
    description:
      "Our AI analyzes thousands of combinations to find your perfect outfit.",
  },
  {
    number: 5,
    icon: ShoppingBag,
    title: "Shop & Impress",
    description:
      "Browse your curated looks with direct links to purchase from top brands.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting your perfect outfit is as easy as 1, 2, 3 — well, 5 simple steps.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-500/40" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <div className="relative flex flex-col items-center text-center group">
                  {/* Number badge */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full gradient-bg shadow-lg shadow-purple-500/25 mb-6 transition-transform group-hover:scale-110">
                    <span className="text-lg font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <step.icon className="h-8 w-8 text-foreground" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
