"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const loadingMessages = [
  "Analyzing your style...",
  "Matching with trends...",
  "Curating perfect outfits...",
  "Adding finishing touches...",
];

const gradientColors = [
  "from-violet-500/20 via-fuchsia-500/20 to-rose-500/20",
  "from-sky-500/20 via-indigo-500/20 to-purple-500/20",
  "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  "from-amber-500/20 via-orange-500/20 to-red-500/20",
];

export default function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    const gradientInterval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradientColors.length);
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(gradientInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          key={gradientIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={cn(
            "absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br rounded-full blur-3xl",
            gradientColors[gradientIndex]
          )}
        />
        <motion.div
          key={`reverse-${gradientIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={cn(
            "absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl rounded-full blur-3xl",
            gradientColors[(gradientIndex + 2) % gradientColors.length]
          )}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Animated logo/icon */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-20 w-20 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 flex items-center justify-center shadow-2xl"
          >
            <Sparkles className="h-10 w-10 text-white dark:text-black" />
          </motion.div>

          {/* Orbiting rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-neutral-200 dark:border-neutral-800"
          />
        </div>

        {/* Messages */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-neutral-700 dark:text-neutral-300"
            >
              {loadingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Dot animation */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white"
            />
          ))}
        </div>

        <p className="text-xs text-neutral-400 mt-2">
          Our AI stylist is analyzing your preferences...
        </p>
      </div>
    </motion.div>
  );
}

