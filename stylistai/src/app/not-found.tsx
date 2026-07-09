"use client";

import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/animations/fade-in";
import { Button } from "@/components/ui/button";

const floatingElements = [
  { emoji: "👗", x: "10%", y: "20%", delay: 0 },
  { emoji: "👔", x: "85%", y: "30%", delay: 0.5 },
  { emoji: "👠", x: "20%", y: "70%", delay: 1 },
  { emoji: "🎒", x: "75%", y: "75%", delay: 1.5 },
  { emoji: "🧢", x: "90%", y: "15%", delay: 0.8 },
  { emoji: "💍", x: "5%", y: "50%", delay: 1.2 },
];

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-start/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-gradient-end/10 blur-3xl" />
      </div>

      {/* Floating elements */}
      {floatingElements.map((el) => (
        <motion.div
          key={el.emoji}
          className="absolute pointer-events-none text-3xl opacity-20 dark:opacity-10"
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      <FadeIn>
        <div className="relative text-center">
          {/* 404 */}
          <div className="text-9xl md:text-[10rem] font-bold leading-none">
            <span className="gradient-text">4</span>
            <span className="gradient-text">0</span>
            <span className="gradient-text">4</span>
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Page Not Found
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved. Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button size="lg">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/stylist">
              <Button variant="outline" size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                Go to AI Stylist
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
