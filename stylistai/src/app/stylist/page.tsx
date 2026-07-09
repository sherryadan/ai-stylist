"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStylist } from "@/hooks/use-stylist";
import StylistForm from "@/components/stylist/stylist-form";
import LoadingAnimation from "@/components/stylist/loading-animation";
import RecommendationDisplay from "@/components/stylist/recommendation-display";

export default function StylistPage() {
  const { results, isLoading, resetForm } = useStylist();

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingAnimation key="loading" />
        ) : results ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecommendationDisplay
              results={results}
              onStartOver={resetForm}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-black pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-neutral-200/40 to-transparent dark:from-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                  AI Fashion Stylist
                </h1>
                <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto">
                  Tell us about your style, occasion, and preferences. Our AI
                  will curate the perfect outfit from top brands.
                </p>
              </div>
            </div>

            <StylistForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
