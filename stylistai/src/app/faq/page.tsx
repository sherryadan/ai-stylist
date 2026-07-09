"use client";

import { useState } from "react";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { faqs } from "@/data/faqs";
import FadeIn from "@/animations/fade-in";
import StaggerContainer from "@/animations/stagger-container";
import StaggerItem from "@/animations/stagger-item";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/cn";

const categories = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "pricing", label: "Pricing" },
  { id: "brands", label: "Brands" },
  { id: "features", label: "Features" },
  { id: "privacy", label: "Privacy" },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-96 h-96 bg-gradient-start/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-end/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full gradient-bg">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Find answers to common questions about StylistAI, our features,
              pricing, and more.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all",
                    activeCategory === cat.id
                      ? "gradient-bg text-white"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          {filteredFaqs.length === 0 ? (
            <FadeIn>
              <div className="text-center text-muted-foreground py-12">
                No FAQs found for this category.
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer>
              <Accordion type="single" collapsible className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <StaggerItem key={faq.id}>
                    <AccordionItem
                      value={faq.id}
                      className="rounded-xl border border-border bg-card px-6"
                    >
                      <AccordionTrigger className="text-base font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </StaggerItem>
                ))}
              </Accordion>
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <FadeIn>
            <MessageCircle className="mx-auto h-10 w-10 gradient-text mb-4" />
            <h2 className="text-3xl font-bold">Still Have Questions?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Our support team is here to help. Reach out and we&apos;ll get
              back to you as soon as possible.
            </p>
            <div className="mt-8">
              <Button size="lg">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
