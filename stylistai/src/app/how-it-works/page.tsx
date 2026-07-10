"use client";

import {
  ClipboardList,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  BrainCircuit,
  BarChart3,
  Palette,
  CloudSun,
} from "lucide-react";
import Link from "next/link";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Tell Us About Yourself",
    description:
      "Start by sharing your preferences through our intuitive style quiz. Tell us about your gender, age, body type, and the occasion you're dressing for.",
    features: [
      "Quick 2-minute questionnaire",
      "Optional detailed preferences",
      "Upload your wardrobe items",
      "Set your budget range",
    ],
    gradient: "from-violet-500 to-purple-500",
  },
  {
    number: "02",
    title: "Set Your Style Preferences",
    description:
      "Choose your preferred styles and colors. Whether you love streetwear, minimalist looks, or formal elegance, our AI learns your taste.",
    features: [
      "15+ style categories to choose from",
      "Color palette selection",
      "Preferred brands",
      "Weather & season preferences",
    ],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "03",
    title: "AI Analyzes & Curates",
    description:
      "Our advanced AI engine processes your inputs, analyzing thousands of products from partner brands to find perfect outfit combinations.",
    features: [
      "Real-time AI processing",
      "Brand catalog matching",
      "Color harmony scoring",
      "Trend integration",
    ],
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    number: "04",
    title: "Review Your Outfit Recommendations",
    description:
      "Get complete outfit recommendations with detailed explanations of why each item works together. View scores for occasion match, color harmony, and more.",
    features: [
      "Complete outfit visualization",
      "Detailed style analysis",
      "Alternative suggestions",
      "Save & compare outfits",
    ],
    gradient: "from-orange-500 to-rose-500",
  },
  {
    number: "05",
    title: "Shop & Elevate Your Style",
    description:
      "Love what you see? Click through to purchase directly from brand websites. Save your favorite looks for future reference.",
    features: [
      "Direct purchase links",
      "Saved outfit collections",
      "Share with friends",
      "Get fresh recommendations anytime",
    ],
    gradient: "from-pink-500 to-fuchsia-500",
  },
];

const techFeatures = [
  {
    icon: BrainCircuit,
    title: "Machine Learning",
    description:
      "Our models are trained on millions of fashion combinations, trend data, and style expert inputs.",
  },
  {
    icon: Palette,
    title: "Color AI",
    description:
      "Advanced color analysis ensures every outfit has perfect harmony and complementing tones.",
  },
  {
    icon: BarChart3,
    title: "Trend Analysis",
    description:
      "Real-time trend monitoring across social media, fashion weeks, and style publications.",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    description:
      "Location-based weather data ensures your outfit is practical for local conditions.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/3 w-96 h-96 bg-gradient-start/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-end/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              How It <span className="gradient-text">Works</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Get styled in minutes. Our AI does the heavy lifting so you can
              look your best effortlessly.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          <StaggerContainer className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <StaggerItem key={step.number}>
                <div
                  className={`grid items-center gap-8 md:gap-12 ${
                    index % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-2"
                  }`}
                >
                  <div
                    className={`space-y-4 ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    <div className="text-4xl md:text-6xl font-bold gradient-text opacity-30">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full gradient-bg" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`relative aspect-video md:aspect-square overflow-hidden rounded-2xl ${
                      index % 2 === 1 ? "md:order-1" : ""
                    }`}
                  >
                    <div
                      className={`h-full w-full bg-gradient-to-br ${step.gradient} flex items-center justify-center`}
                    >
                      <div className="text-center text-white p-8">
                        {index === 0 && (
                          <ClipboardList className="mx-auto h-16 w-16 mb-4" />
                        )}
                        {index === 1 && (
                          <Palette className="mx-auto h-16 w-16 mb-4" />
                        )}
                        {index === 2 && (
                          <BrainCircuit className="mx-auto h-16 w-16 mb-4" />
                        )}
                        {index === 3 && (
                          <Sparkles className="mx-auto h-16 w-16 mb-4" />
                        )}
                        {index === 4 && (
                          <ShoppingBag className="mx-auto h-16 w-16 mb-4" />
                        )}
                        <p className="text-lg font-semibold">Step {step.number}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Technology */}
      <section className="border-y bg-secondary/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Technology
              </Badge>
              <h2 className="text-3xl font-bold">The AI Behind Your Style</h2>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                Our recommendation engine combines multiple AI technologies to
                deliver the perfect outfit every time.
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techFeatures.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="rounded-xl border bg-card p-6 text-center">
                  <feature.icon className="mx-auto h-10 w-10 gradient-text" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold">Ready to Get Styled?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of fashion-forward users who trust StylistAI for
              their outfit needs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/stylist">
                <Button size="lg">
                  Try AI Stylist Now
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
