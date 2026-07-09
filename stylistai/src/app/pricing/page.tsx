"use client";

import { useState } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { pricingPlans } from "@/data/pricing";
import { faqs } from "@/data/faqs";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/cn";

const pricingFaqs = faqs.filter((f) => f.category === "pricing");

const enterpriseFeatures = [
  "Custom integration with your existing systems",
  "Dedicated AI model fine-tuned for your catalog",
  "White-label mobile & web applications",
  "Real-time analytics dashboard",
  "Priority 24/7 phone & email support",
  "Quarterly strategy & optimization reviews",
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-96 h-96 bg-gradient-start/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-end/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Simple, Transparent{" "}
              <span className="gradient-text">Pricing</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Choose the plan that fits your style journey. No hidden fees, no
              surprises.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="px-4 pb-12">
        <div className="mx-auto flex items-center justify-center gap-4">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "text-sm font-medium transition-colors",
              billing === "monthly"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <div
            className="flex h-6 w-11 cursor-pointer items-center rounded-full border-2 border-border bg-secondary"
            onClick={() =>
              setBilling(billing === "monthly" ? "annual" : "monthly")
            }
          >
            <div
              className={cn(
                "h-4 w-4 rounded-full bg-foreground transition-transform",
                billing === "annual" ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </div>
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "text-sm font-medium transition-colors",
              billing === "annual"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Annual
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <StaggerContainer className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <StaggerItem key={plan.id}>
                <Card
                  className={cn(
                    "relative flex flex-col border-2",
                    plan.highlighted
                      ? "border-gradient-start/50 shadow-xl shadow-gradient-start/10"
                      : "border-border"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-bg text-white border-0">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader
                    className={cn(
                      "text-center",
                      plan.highlighted ? "pt-8" : ""
                    )}
                  >
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={cn(
                        "w-full",
                        plan.highlighted
                          ? "gradient-bg text-white hover:opacity-90"
                          : ""
                      )}
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="border-y bg-secondary/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Enterprise
              </Badge>
              <h2 className="text-3xl font-bold">
                Enterprise-Grade Features
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                For businesses and professionals who need more power and
                flexibility.
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enterpriseFeatures.map((feature) => (
              <StaggerItem key={feature}>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 gradient-text" />
                  <span className="font-medium">{feature}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Everything you need to know about our pricing
              </p>
            </div>
          </FadeIn>
          <div className="mt-12">
            <Accordion type="single" collapsible>
              {pricingFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
